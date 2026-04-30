import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tipos
type ProductRow = {
  SKU: string;
  Categoría: string;
  Nombre: string;
  "Precio (CLP)": number;
  Descripción: string;
  "Talla / Detalle": string;
  Material: string;
  Stock: number;
  "Foto principal": string;
  Activo: string;
};

// Configuración
const EXCEL_PATH = path.join(process.cwd(), "seed-data", "inventario.xlsx");
const FOTOS_DIR = path.join(process.cwd(), "seed-data", "fotos");

// Mapeo categoría → carpeta + slug
const CATEGORY_CONFIG: Record<
  string,
  { folder: string; slug: string; description: string; order: number }
> = {
  Anillos: {
    folder: "anillos",
    slug: "anillos",
    description: "Anillos en plata 925 con diseños únicos y delicados.",
    order: 1,
  },
  Aros: {
    folder: "aros",
    slug: "aros",
    description: "Aros en plata 925, desde clásicos hasta diseños especiales.",
    order: 2,
  },
  Pulseras: {
    folder: "pulseras",
    slug: "pulseras",
    description: "Pulseras en plata 925 para complementar cada estilo.",
    order: 3,
  },
  Collares: {
    folder: "collares",
    slug: "collares",
    description: "Collares y cadenas en plata 925 con detalles refinados.",
    order: 4,
  },
};

/**
 * Convierte el nombre del producto en un slug URL-friendly
 * "Anillo Triple Circón" → "anillo-triple-circon"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function findPhotoPath(dir: string, fileName: string): string | null {
  const exact = path.join(dir, fileName);
  if (fs.existsSync(exact)) return exact;

  const base = path.join(dir, path.parse(fileName).name);
  for (const ext of IMAGE_EXTENSIONS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Sube una imagen a Cloudinary
 */
async function uploadImage(
  filePath: string,
  publicId: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "zirel/products",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    transformation: [
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
  });
  return result.secure_url;
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlySkus = onlyArg ? new Set(onlyArg.replace("--only=", "").split(",").map((s) => s.trim())) : null;

  console.log("🌱 Iniciando seed de Zirel...\n");
  if (onlySkus) console.log(`   Modo retry — solo SKUs: ${[...onlySkus].join(", ")}\n`);

  // Validar archivos
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`❌ No se encontró el Excel en: ${EXCEL_PATH}`);
  }
  if (!fs.existsSync(FOTOS_DIR)) {
    throw new Error(`❌ No se encontró la carpeta de fotos en: ${FOTOS_DIR}`);
  }

  // === 1. Leer el Excel ===
  console.log("📄 Leyendo inventario.xlsx...");
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets["Inventario Zirel"];
  if (!sheet) throw new Error("❌ No se encontró la hoja 'Inventario Zirel'");

  const rows = XLSX.utils.sheet_to_json<ProductRow>(sheet, { range: 3 });
  console.log(`   ✓ ${rows.length} productos encontrados en Excel\n`);

  // === 2. Limpiar BD (solo en seed completo) ===
  if (!onlySkus) {
    console.log("🧹 Limpiando datos previos...");
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log("   ✓ BD limpia\n");
  }

  // === 3. Crear o cargar categorías ===
  console.log("📁 Cargando categorías...");
  const categoryMap = new Map<string, string>(); // nombre → id

  for (const [name, config] of Object.entries(CATEGORY_CONFIG)) {
    const cat = onlySkus
      ? await prisma.category.findUnique({ where: { slug: config.slug } })
      : await prisma.category.create({
          data: { name, slug: config.slug, description: config.description, order: config.order },
        });
    if (!cat) throw new Error(`Categoría "${name}" no encontrada. Corre el seed completo primero.`);
    categoryMap.set(name, cat.id);
    console.log(`   ✓ ${name} (${cat.id})`);
  }
  console.log("");

  // === 4. Crear productos + subir fotos ===
  console.log("📦 Creando productos y subiendo fotos a Cloudinary...");
  console.log("   (esto puede tardar varios minutos)\n");

  let success = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      const sku = row.SKU?.trim();
      const categoryName = row.Categoría?.trim();
      const productName = row.Nombre?.trim();

      if (!sku || !categoryName || !productName) {
        skipped++;
        continue;
      }

      if (onlySkus && !onlySkus.has(sku)) continue;

      const isActive = row.Activo?.trim().toLowerCase() === "sí" || row.Activo?.trim().toLowerCase() === "si";
      const config = CATEGORY_CONFIG[categoryName];

      if (!config) {
        errors.push(`${sku}: categoría desconocida "${categoryName}"`);
        continue;
      }

      // Buscar la foto (soporta .jpg, .jpeg, .png, .webp)
      const photoFileName = row["Foto principal"]?.trim();
      const photoPath = findPhotoPath(path.join(FOTOS_DIR, config.folder), photoFileName);

      if (!photoPath) {
        errors.push(`${sku}: no se encontró la foto "${photoFileName}" en ${path.join(FOTOS_DIR, config.folder)}`);
        continue;
      }

      // Subir a Cloudinary
      process.stdout.write(`   ⏳ ${sku} ${productName.padEnd(40)} subiendo...`);
      const imageUrl = await uploadImage(photoPath, sku);

      // Crear producto en BD
      const categoryId = categoryMap.get(categoryName)!;
      const slug = slugify(productName) + "-" + sku.toLowerCase();

      await prisma.product.create({
        data: {
          sku,
          slug,
          name: productName,
          description: row.Descripción?.trim() || productName,
          price: row["Precio (CLP)"],
          size: row["Talla / Detalle"]?.trim() === "—" ? null : row["Talla / Detalle"]?.trim(),
          material: row.Material?.trim() || "Plata 925",
          stock: row.Stock || 1,
          active: isActive,
          categoryId,
          images: {
            create: {
              url: imageUrl,
              alt: productName,
              order: 0,
              isPrimary: true,
            },
          },
        },
      });

      process.stdout.write(` ✅\n`);
      success++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      errors.push(`${row.SKU}: ${errorMsg}`);
      process.stdout.write(` ❌\n`);
      console.error(`      → ${errorMsg}`);
    }
  }

  // === 5. Resumen ===
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DEL SEED");
  console.log("=".repeat(60));
  console.log(`✅ Productos creados:  ${success}`);
  console.log(`⏭️  Filas omitidas:     ${skipped}`);
  console.log(`❌ Errores:            ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n⚠️  Detalle de errores:");
    errors.forEach((e) => console.log(`   - ${e}`));
  }

  console.log("\n🎉 Seed completado.");
}

main()
  .catch((e) => {
    console.error("\n💥 Error fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });