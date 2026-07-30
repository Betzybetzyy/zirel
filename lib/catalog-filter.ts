import { formatCLP } from "@/lib/utils-format";

/**
 * Filtrado y orden del catálogo público. Funciones puras — sin acceso a DB,
 * sin React — para poder testearlas de forma aislada (scripts/catalog-filter.test.ts)
 * y para que `CatalogView` no cargue con esta lógica.
 */

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "newest", label: "Recién llegados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A–Z" },
];

export interface CatalogProduct {
  slug: string;
  name: string;
  price: number;
  stock: number;
  material: string;
  size?: string | null;
  featured: boolean;
  createdAt: Date | string;
  images: { url: string; alt: string | null }[];
}

export interface CatalogFilters {
  q: string;
  sort: SortOption;
  priceBucket: number | null;
  onlyAvailable: boolean;
  material: string | null;
  size: string | null;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: "",
  sort: "featured",
  priceBucket: null,
  onlyAvailable: false,
  material: null,
  size: null,
};

export interface PriceBucket {
  index: number;
  label: string;
  min: number;
  max: number | null; // null = sin tope superior
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Divide el rango real de precios del catálogo en `count` tramos iguales. */
export function computePriceBuckets(products: Pick<CatalogProduct, "price">[], count = 3): PriceBucket[] {
  if (products.length === 0) return [];

  const prices = products.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return [{ index: 0, label: formatCLP(min), min, max: null }];
  }

  const step = (max - min) / count;
  return Array.from({ length: count }, (_, i) => {
    const bucketMin = Math.round(min + step * i);
    const bucketMax = i === count - 1 ? null : Math.round(min + step * (i + 1));
    return {
      index: i,
      label: bucketMax === null ? `Desde ${formatCLP(bucketMin)}` : `${formatCLP(bucketMin)} – ${formatCLP(bucketMax)}`,
      min: bucketMin,
      max: bucketMax,
    };
  });
}

export function filterProducts<T extends CatalogProduct>(
  products: T[],
  filters: CatalogFilters,
  buckets: PriceBucket[]
): T[] {
  let result = products;

  const q = filters.q.trim();
  if (q) {
    const needle = normalize(q);
    result = result.filter((p) => normalize(p.name).includes(needle));
  }

  if (filters.onlyAvailable) {
    result = result.filter((p) => p.stock > 0);
  }

  if (filters.material) {
    result = result.filter((p) => p.material === filters.material);
  }

  if (filters.size) {
    result = result.filter((p) => p.size === filters.size);
  }

  if (filters.priceBucket !== null) {
    const bucket = buckets[filters.priceBucket];
    if (bucket) {
      result = result.filter((p) =>
        bucket.max === null ? p.price >= bucket.min : p.price >= bucket.min && p.price < bucket.max
      );
    }
  }

  return result;
}

export function sortProducts<T extends CatalogProduct>(products: T[], sort: SortOption): T[] {
  const sorted = [...products];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    case "featured":
    default:
      // Array.sort es estable (ES2019+): dentro de cada grupo se conserva el orden recibido.
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }
  return sorted;
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.priceBucket !== null ||
    filters.onlyAvailable ||
    filters.material !== null ||
    filters.size !== null
  );
}
