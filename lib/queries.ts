import { prisma } from "./prisma";

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