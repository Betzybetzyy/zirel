import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageAlt?: string;
};

function normalizeCloudinaryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_600,h_600,c_pad,b_rgb:FFFFFF/");
}

export function ProductCard({ slug, name, price, imageUrl, imageAlt }: ProductCardProps) {
  const normalizedImageUrl = imageUrl ? normalizeCloudinaryUrl(imageUrl) : undefined;
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link href={`/producto/${slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-square bg-[var(--zirel-marfil)] mb-4 overflow-hidden">
        {normalizedImageUrl ? (
          <Image
            src={normalizedImageUrl}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain transition-transform duration-700 group-hover:scale-103"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--zirel-cafe-topo)]/40 text-xs font-serif italic">
            Sin imagen
          </div>
        )}

        {/* Uniform inner border — frames all images consistently */}
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(43,38,35,0.07)] pointer-events-none z-10" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[var(--zirel-negro-suave)]/0 group-hover:bg-[var(--zirel-negro-suave)]/30 transition-all duration-300 flex items-end justify-center pb-5 pointer-events-none z-20">
          <span className="text-[var(--zirel-marfil)] text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Ver pieza
          </span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-[var(--zirel-dorado-beige)]/0 group-hover:border-[var(--zirel-dorado-beige)]/60 transition-all duration-300 pointer-events-none z-20" />
        <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-[var(--zirel-dorado-beige)]/0 group-hover:border-[var(--zirel-dorado-beige)]/60 transition-all duration-300 pointer-events-none z-20" />
      </div>

      {/* Info */}
      <div className="space-y-1.5 min-h-[52px]">
        <h3
          className="font-serif text-[15px] text-[var(--zirel-negro-suave)] leading-snug group-hover:text-[var(--zirel-cafe-topo)] transition-colors duration-200"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-[var(--zirel-dorado-beige)]/55 group-hover:w-6 transition-all duration-300 ease-out" />
          <p className="text-[11px] tracking-[0.15em] text-[var(--zirel-cafe-topo)] font-variant-numeric tabular-nums">
            {formattedPrice}
          </p>
        </div>
      </div>
    </Link>
  );
}
