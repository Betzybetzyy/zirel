import { Suspense } from "react";
import { getCategoryBySlug, getCategories } from "@/lib/queries";
import { CatalogHero } from "@/components/ui/catalog-hero";
import { CatalogView } from "@/components/ui/catalog-view";
import { CatalogSkeleton } from "@/components/ui/catalog-skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada" };

  return {
    title: `${category.name} | Zirel Joyería`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <CatalogHero
        eyebrow="Colección"
        title={category.name}
        description={category.description}
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: "Inicio", href: "/" }, { label: "Catálogo", href: "/catalogo" }, { label: category.name }]}
          />
        }
      />

      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView products={category.products} />
      </Suspense>
    </>
  );
}
