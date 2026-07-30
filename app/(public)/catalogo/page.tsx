import { Suspense } from "react";
import { getAllProducts } from "@/lib/queries";
import { CatalogHero } from "@/components/ui/catalog-hero";
import { CatalogView } from "@/components/ui/catalog-view";
import { CatalogSkeleton } from "@/components/ui/catalog-skeleton";

export const revalidate = 3600;

export const metadata = {
  title: "Catálogo | Zirel Joyería",
  description: "Descubre toda nuestra colección de joyería en plata 925.",
};

export default async function CatalogoPage() {
  const products = await getAllProducts();

  return (
    <>
      <CatalogHero eyebrow="Colección completa" title="Catálogo" description="Cada pieza, cuidadosamente seleccionada para ti." />

      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView products={products} />
      </Suspense>
    </>
  );
}
