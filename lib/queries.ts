import { prisma } from "./prisma";
import { buildFlagDefaults, FEATURE_FLAGS, type AdminFlag, type FeatureFlagMap } from "./feature-flags";

/**
 * Obtiene email y rol de un usuario por su ID (usado en el layout admin)
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { email: true, role: true },
  });
}

/**
 * Obtiene todas las categorías ordenadas
 */
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
  });
}

/**
 * Obtiene una categoría por su slug, con sus productos activos
 */
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/**
 * Obtiene todos los productos activos con su foto principal
 */
export async function getAllProducts() {
  return prisma.product.findMany({
    where: { active: true },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: [{ category: { order: "asc" } }, { createdAt: "asc" }],
  });
}

/**
 * Obtiene un producto por su slug, con todas sus imágenes
 */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
}

/**
 * Lee todos los feature flags desde DB, merged con sus defaults.
 * Flags ausentes en DB usan el valor default definido en lib/feature-flags.ts.
 */
export async function getFeatureFlags(): Promise<FeatureFlagMap> {
  const rows = await prisma.featureFlag.findMany();
  const map = buildFlagDefaults();
  for (const row of rows) {
    if (row.key in map) {
      (map as Record<string, boolean>)[row.key] = row.enabled;
    }
  }
  return map;
}

/**
 * Devuelve todos los flags para el admin: estáticos (label desde código) +
 * dinámicos creados desde la UI (label desde DB). Los estáticos van primero.
 */
export async function getAllFlagsForAdmin(): Promise<AdminFlag[]> {
  const rows = await prisma.featureFlag.findMany();
  const dbMap = new Map(rows.map((r) => [r.key, r]));
  const staticKeys = new Set<string>(FEATURE_FLAGS.map((f) => f.key));

  const result: AdminFlag[] = [];

  for (const staticFlag of FEATURE_FLAGS) {
    const db = dbMap.get(staticFlag.key);
    result.push({
      key: staticFlag.key,
      label: staticFlag.label,
      description: staticFlag.description,
      enabled: db?.enabled ?? staticFlag.default,
      isDynamic: false,
    });
  }

  for (const row of rows) {
    if (!staticKeys.has(row.key)) {
      result.push({
        key: row.key,
        label: row.label || row.key,
        description: row.description,
        enabled: row.enabled,
        isDynamic: true,
      });
    }
  }

  return result;
}

/**
 * Obtiene productos destacados (featured) para el home
 */
export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}