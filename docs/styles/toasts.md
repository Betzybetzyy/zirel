# Notificaciones / Toasts (Sonner)

Componente: `components/ui/sonner.tsx`, montado una sola vez en `app/layout.tsx` como `<Toaster />`.

## Config

| Prop | Valor |
|---|---|
| `position` | `top-center` |
| `closeButton` | siempre visible |
| `theme` | dinámico (ver abajo) |

Íconos lucide por tipo: `CircleCheckIcon` (success), `OctagonXIcon` (error), `InfoIcon` (info), `TriangleAlertIcon` (warning), `Loader2Icon` (loading). Color de ícono = `--zirel-dorado-beige`.

## Tema dark/light — quirk importante

Sonner portalea sus toasts a `<body>`, **fuera** del `<div data-admin-theme>` que envuelve el admin. Las vars `--zirel-*` no resuelven al tema oscuro dentro del portal.

Solución implementada:
- El wrapper lee `useAdminUIStore((s) => s.theme)` y `usePathname()`.
- Solo activa dark si `pathname.startsWith("/admin") && theme === "dark"`.
- Sitio público siempre light (aunque el store persista `"dark"` de visita anterior al admin).

## Colores (en `app/globals.css` bajo `[data-sonner-toaster]`)

| Modo | Fondo | Texto | Borde |
|---|---|---|---|
| Light | `var(--zirel-marfil)` | `var(--zirel-negro-suave)` | `var(--zirel-arena)` |
| Dark | `#221c19` | `#ece4d8` | `#4a3c32` |

Los hexes dark son los mismos del bloque `[data-admin-theme="dark"]` en globals.css. Se duplican explícitos porque las vars CSS no cruzan el portal de sonner.

Sombra: `0 4px 24px color-mix(in srgb, var(--zirel-cafe-topo) 12%, transparent)`.

## Uso

```ts
import { toast } from "sonner"

toast.success("Producto añadido al carrito")
toast.error("Tu carrito está vacío")
toast("Mensaje neutro")
```

No pasar estilos inline en el call-site — el theming vive en el wrapper y en globals.css.
