"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

function normalizeCloudinaryUrl(url: string, size = 1200): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${size},h_${size},c_pad,b_rgb:FFFFFF/`);
}

/**
 * Galería de la ficha de producto. Antes los thumbnails eran <div> sin onClick
 * y el anillo activo estaba hardcodeado a i === 0 — se veían varias fotos
 * pero no se podía abrir ninguna. Ahora son botones reales con estado.
 */
export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative">
        {/* Corner accent brackets */}
        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />
        <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />
        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[var(--zirel-dorado-beige)]/50 pointer-events-none z-10" />

        <div className="relative aspect-square bg-[var(--zirel-marfil)] overflow-hidden">
          {active ? (
            <Image
              key={active.id}
              src={normalizeCloudinaryUrl(active.url, 1200)}
              alt={active.alt || productName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--zirel-cafe-topo)]/40 font-serif italic text-sm">
              Sin imagen
            </div>
          )}
          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(43,38,35,0.08)] pointer-events-none" />
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver imagen ${i + 1} de ${productName}`}
              aria-current={i === activeIndex}
              className={`relative aspect-square overflow-hidden bg-[var(--zirel-marfil)] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--zirel-dorado-beige)] focus-visible:ring-offset-1 ${
                i === activeIndex
                  ? "shadow-[inset_0_0_0_1.5px_var(--zirel-dorado-beige)]"
                  : "shadow-[inset_0_0_0_1px_rgba(43,38,35,0.08)] hover:shadow-[inset_0_0_0_1.5px_var(--zirel-dorado-beige)]"
              }`}
            >
              <Image
                src={normalizeCloudinaryUrl(img.url, 300)}
                alt={img.alt || productName}
                fill
                sizes="15vw"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
