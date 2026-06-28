import { prisma } from "./prisma";
import { buildFlagDefaults, FEATURE_FLAGS, type AdminFlag, type FeatureFlagMap } from "./feature-flags";
import type { SaleStatus, PaymentMethod } from "@prisma/client";

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
  const map = buildFlagDefaults();
  try {
    const rows = await prisma.featureFlag.findMany();
    for (const row of rows) {
      if (row.key in map) {
        (map as Record<string, boolean>)[row.key] = row.enabled;
      }
    }
  } catch {
    // DB unreachable at build time — use defaults
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
 * Admin: todos los productos (activos e inactivos) con categoría e imagen principal
 */
export async function getAllProductsForAdmin() {
  return prisma.product.findMany({
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
 * Admin: un producto por ID con categoría y todas sus imágenes
 */
export async function getProductForAdmin(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
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

// ── Ventas ─────────────────────────────────────────────────────────────────

export interface SalesFilters {
  from?: string   // ISO date string (YYYY-MM-DD)
  to?: string     // ISO date string (YYYY-MM-DD)
  status?: SaleStatus
  paymentMethod?: PaymentMethod
}

/**
 * Admin: listado de ventas con filtros opcionales (fecha, estado, método de pago)
 */
export async function getSalesForAdmin(filters: SalesFilters = {}) {
  const { from, to, status, paymentMethod } = filters

  return prisma.sale.findMany({
    where: {
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(`${from}T00:00:00.000-04:00`) } : {}),
              ...(to ? { lte: new Date(`${to}T23:59:59.999-04:00`) } : {}),
            },
          }
        : {}),
      ...(status ? { status } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
    },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Admin: una venta por ID con sus items y pagos
 */
export async function getSaleForAdmin(id: string) {
  return prisma.sale.findUnique({
    where: { id },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "asc" } },
    },
  })
}

/**
 * Admin: productos activos disponibles para registrar una venta
 */
export async function getProductsForSale() {
  return prisma.product.findMany({
    where: { active: true },
    select: { id: true, sku: true, name: true, price: true, stock: true },
    orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
  })
}

/**
 * Dashboard: ventas del período + saldos pendientes (PENDIENTE | CUOTAS | ABONO no ANULADA)
 */
export async function getDashboardData(from: Date, to: Date) {
  const [periodSales, pendingSales] = await Promise.all([
    prisma.sale.findMany({
      where: {
        createdAt: { gte: from, lte: to },
        status: { not: "ANULADA" },
      },
      select: {
        total: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            productName: true,
            productSku: true,
            quantity: true,
            productPrice: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.sale.findMany({
      where: {
        status: { not: "ANULADA" },
        OR: [
          { status: "PENDIENTE" },
          { paymentMethod: { in: ["CUOTAS", "ABONO"] } },
        ],
      },
      select: {
        id: true,
        saleNumber: true,
        customerName: true,
        total: true,
        createdAt: true,
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])
  return { periodSales, pendingSales }
}