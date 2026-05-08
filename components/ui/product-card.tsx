import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageAlt?: string;
};

export function ProductCard({ slug, name, price, imageUrl, imageAlt }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link
      href={`/producto/${slug}`}
      className="group block"
    >
      {/* Imagen */}
      <div className="aspect-square bg-[var(--zirel-beige-suave)] mb-4 p-2">
        <div className="relative w-full h-full bg-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--zirel-cafe-topo)]/40 text-xs">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-center px-2">
        <h3 className="font-serif text-base text-[var(--zirel-negro-suave)] leading-tight mb-1">
          {name}
        </h3>
        <p className="text-sm tracking-wide text-[var(--zirel-cafe-topo)]">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}