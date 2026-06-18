import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const EXCEL_PATH = path.join(process.cwd(), "seed-data", "inventario.xlsx");
const FOTOS_DIR = path.join(process.cwd(), "seed-data", "fotos");

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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

async function uploadImage(filePath: string, publicId: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "zirel/products",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
  });
  return result.secure_url;
}

function cloudinaryUrl(sku: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  return `https://res.cloudinary.com/${cloudName}/image/upload/zirel/products/${sku}`;
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlySkus = onlyArg
    ? new Set(onlyArg.replace("--only=", "").split(",").map((s) => s.trim()))
    : null;
  const skipUpload = process.argv.includes("--skip-upload");

  console.log("🌱 Iniciando seed de Zirel...\n");
  if (skipUpload) console.log("   Modo --skip-upload: usa URLs de Cloudinary existentes (no re-sube fotos)\n");
  if (onlySkus) console.log(`   Modo retry — solo SKUs: ${[...onlySkus].join(", ")}\n`);

  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`❌ No se encontró el Excel en: ${EXCEL_PATH}`);
  }

  console.log("📄 Leyendo inventario.xlsx...");
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets["Inventario Zirel"];
  if (!sheet) throw new Error("❌ No se encontró la hoja 'Inventario Zirel'");

  const rows = XLSX.utils.sheet_to_json<ProductRow>(sheet, { range: 3 });
  console.log(`   ✓ ${rows.length} productos encontrados en Excel\n`);

  // En modo skip-upload hacemos upsert — no borramos todo
  if (!onlySkus && !skipUpload) {
    console.log("🧹 Limpiando datos previos...");
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log("   ✓ BD limpia\n");
  }

  console.log("📁 Cargando categorías...");
  const categoryMap = new Map<string, string>();

  for (const [name, config] of Object.entries(CATEGORY_CONFIG)) {
    const cat =
      onlySkus || skipUpload
        ? await prisma.category.upsert({
            where: { slug: config.slug },
            update: {},
            create: {
              name,
              slug: config.slug,
              description: config.description,
              order: config.order,
            },
          })
        : await prisma.category.create({
            data: {
              name,
              slug: config.slug,
              description: config.description,
              order: config.order,
            },
          });
    categoryMap.set(name, cat.id);
    console.log(`   ✓ ${name} (${cat.id})`);
  }
  console.log("");

  console.log("📦 Procesando productos...");
  if (!skipUpload) console.log("   (subiendo fotos a Cloudinary — puede tardar varios minutos)\n");

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

      const isActive =
        row.Activo?.trim().toLowerCase() === "sí" ||
        row.Activo?.trim().toLowerCase() === "si";
      const config = CATEGORY_CONFIG[categoryName];

      if (!config) {
        errors.push(`${sku}: categoría desconocida "${categoryName}"`);
        continue;
      }

      const categoryId = categoryMap.get(categoryName)!;
      const slug = slugify(productName) + "-" + sku.toLowerCase();
      const description =
        row.Descripción != null
          ? String(row.Descripción).trim() || productName
          : productName;
      const size = (() => {
        const t =
          row["Talla / Detalle"] != null
            ? String(row["Talla / Detalle"]).trim()
            : null;
        return !t || t === "—" ? null : t;
      })();
      const material =
        row.Material != null
          ? String(row.Material).trim() || "Plata 925"
          : "Plata 925";
      const stock = row.Stock || 1;

      let imageUrl: string | null;

      if (skipUpload) {
        imageUrl = cloudinaryUrl(sku);
        process.stdout.write(
          `   ⏭️  ${sku} ${productName.padEnd(40)} url Cloudinary...`
        );
      } else {
        const photoFileName = row["Foto principal"]?.trim();
        const photoPath = photoFileName
          ? findPhotoPath(path.join(FOTOS_DIR, config.folder), photoFileName)
          : null;

        if (!photoPath) {
          console.log(
            `   ⚠️  ${sku}: foto "${photoFileName ?? "(sin nombre)"}" no encontrada — producto sin imagen`
          );
          imageUrl = null;
        } else {
          process.stdout.write(
            `   ⏳ ${sku} ${productName.padEnd(40)} subiendo...`
          );
          imageUrl = await uploadImage(photoPath, sku);
        }
      }

      if (skipUpload || onlySkus) {
        // Upsert: actualiza si existe, crea si no
        const saved = await prisma.product.upsert({
          where: { sku },
          update: {
            name: productName,
            slug,
            description,
            price: row["Precio (CLP)"],
            size,
            material,
            stock,
            active: isActive,
            categoryId,
          },
          create: {
            sku,
            slug,
            name: productName,
            description,
            price: row["Precio (CLP)"],
            size,
            material,
            stock,
            active: isActive,
            categoryId,
          },
        });

        if (imageUrl) {
          await prisma.productImage.deleteMany({ where: { productId: saved.id } });
          await prisma.productImage.create({
            data: {
              url: imageUrl,
              alt: productName,
              order: 0,
              isPrimary: true,
              productId: saved.id,
            },
          });
        }
      } else {
        await prisma.product.create({
          data: {
            sku,
            slug,
            name: productName,
            description,
            price: row["Precio (CLP)"],
            size,
            material,
            stock,
            active: isActive,
            categoryId,
            ...(imageUrl && {
              images: {
                create: {
                  url: imageUrl,
                  alt: productName,
                  order: 0,
                  isPrimary: true,
                },
              },
            }),
          },
        });
      }

      process.stdout.write(` ✅\n`);
      success++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      errors.push(`${row.SKU}: ${errorMsg}`);
      process.stdout.write(` ❌\n`);
      console.error(`      → ${errorMsg}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DEL SEED");
  console.log("=".repeat(60));
  console.log(`✅ Productos procesados: ${success}`);
  console.log(`⏭️  Filas omitidas:       ${skipped}`);
  console.log(`❌ Errores:              ${errors.length}`);

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
