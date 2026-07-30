/**
 * Self-check para lib/catalog-filter.ts — no hay framework de tests en el repo,
 * así que es un script assert-based corrido con tsx: `npx tsx scripts/catalog-filter.test.ts`.
 */
import assert from "node:assert";
import {
  computePriceBuckets,
  filterProducts,
  sortProducts,
  DEFAULT_FILTERS,
  type CatalogProduct,
} from "../lib/catalog-filter";

function product(overrides: Partial<CatalogProduct>): CatalogProduct {
  return {
    slug: "anillo",
    name: "Anillo",
    price: 10000,
    stock: 5,
    material: "Plata 925",
    size: null,
    featured: false,
    createdAt: new Date("2026-01-01"),
    images: [],
    ...overrides,
  };
}

const products: CatalogProduct[] = [
  product({ slug: "a", name: "Anillo Luna", price: 10000, stock: 0, material: "Plata 925", createdAt: new Date("2026-01-01") }),
  product({ slug: "b", name: "Aro Sol", price: 20000, stock: 3, material: "Oro 18k", createdAt: new Date("2026-03-01"), featured: true }),
  product({ slug: "c", name: "Collar Estrella", price: 30000, stock: 10, material: "Plata 925", size: "45cm", createdAt: new Date("2026-02-01") }),
];

const buckets = computePriceBuckets(products);

// Sin filtros: devuelve el array intacto
assert.deepStrictEqual(filterProducts(products, DEFAULT_FILTERS, buckets), products, "sin filtros debe devolver todo");

// Búsqueda case/acento-insensible
assert.strictEqual(filterProducts(products, { ...DEFAULT_FILTERS, q: "luna" }, buckets).length, 1);
assert.strictEqual(filterProducts(products, { ...DEFAULT_FILTERS, q: "LÚNA" }, buckets).length, 1);
assert.strictEqual(filterProducts(products, { ...DEFAULT_FILTERS, q: "zzz" }, buckets).length, 0);

// disp=1 excluye stock 0
assert.strictEqual(filterProducts(products, { ...DEFAULT_FILTERS, onlyAvailable: true }, buckets).length, 2);
assert.ok(!filterProducts(products, { ...DEFAULT_FILTERS, onlyAvailable: true }, buckets).some((p) => p.slug === "a"));

// Tramo de precio: primer bucket incluye su mínimo, excluye el tope superior (pertenece al siguiente tramo)
const first = buckets[0];
assert.ok(first.max !== null);
const atMin = filterProducts(products, { ...DEFAULT_FILTERS, priceBucket: 0 }, buckets);
assert.ok(atMin.every((p) => p.price >= first.min && (first.max === null || p.price < first.max)));

// Último bucket: sin tope superior, incluye el precio máximo
const last = buckets[buckets.length - 1];
assert.strictEqual(last.max, null);
const priciest = filterProducts(products, { ...DEFAULT_FILTERS, priceBucket: buckets.length - 1 }, buckets);
assert.ok(priciest.some((p) => p.price === 30000));

// Material + disponibilidad combinados
const combined = filterProducts(products, { ...DEFAULT_FILTERS, material: "Plata 925", onlyAvailable: true }, buckets);
assert.deepStrictEqual(combined.map((p) => p.slug), ["c"]);

// Talla
assert.deepStrictEqual(
  filterProducts(products, { ...DEFAULT_FILTERS, size: "45cm" }, buckets).map((p) => p.slug),
  ["c"]
);

// Orden por precio
assert.deepStrictEqual(sortProducts(products, "price-asc").map((p) => p.slug), ["a", "b", "c"]);
assert.deepStrictEqual(sortProducts(products, "price-desc").map((p) => p.slug), ["c", "b", "a"]);

// Orden por nombre
assert.deepStrictEqual(sortProducts(products, "name-asc").map((p) => p.slug), ["a", "b", "c"]);

// Orden por recientes
assert.deepStrictEqual(sortProducts(products, "newest").map((p) => p.slug), ["b", "c", "a"]);

// Destacados: el featured va primero, el resto conserva orden relativo (sort estable)
assert.strictEqual(sortProducts(products, "featured")[0].slug, "b");

// Un solo precio en el catálogo → un solo bucket, sin dividir por cero
const sameBuckets = computePriceBuckets([product({ price: 15000 })]);
assert.strictEqual(sameBuckets.length, 1);
assert.strictEqual(sameBuckets[0].max, null);

// Catálogo vacío → sin buckets, sin crash
assert.deepStrictEqual(computePriceBuckets([]), []);

console.log("catalog-filter: todos los checks pasaron");
