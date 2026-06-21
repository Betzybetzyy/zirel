# Layout — header, sidebar, imágenes

## Header público

- `sticky top-0 z-50`, altura `h-20`.
- Fondo: `bg-[var(--zirel-marfil)]/95 backdrop-blur-sm` con borde inferior `border-[var(--zirel-arena)]/40`.
- Logo: `mix-blend-multiply` para fusionar con fondo marfil.
- Max-width contenedor: `max-w-7xl px-6`.

## Sidebar admin

Variables dedicadas con prefijo `--admin-sidebar-*` — no contaminan los tokens globales. Soporta modo oscuro via `data-admin-theme="dark"`. Ancho: `w-60` expandido, `w-16` colapsado.

## Imágenes de producto

- Solo Cloudinary (`res.cloudinary.com` en allowlist de `next.config.ts`).
- Cards: fondo beige exterior + contenedor blanco interior + `object-contain`.
- **No usar `mix-blend-multiply`** en imágenes de producto — tiñe la joyería plateada.
