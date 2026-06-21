# Notificaciones / Toasts (Sileo)

Componente: `components/ui/sonner.tsx`, montado una sola vez en `app/layout.tsx` como `<Toaster />`.

## Config

| Prop | Valor |
|---|---|
| `position` | `top-center` |
| `key` | `"dark"` o `"light"` (fuerza remount al cambiar tema) |
| `options` | dinámico (ver abajo) |

Sin íconos custom — Sileo usa su propio sistema SVG con morfing animado.

## Tema dark/light

El wrapper lee dos stores según la ruta:

- `/admin` → `useAdminUIStore((s) => s.theme)`
- resto → `useThemeStore((s) => s.theme)`

`key={isDark ? "dark" : "light"}` fuerza un remount completo del Toaster al cambiar tema, necesario porque `options.fill` en Sileo no es reactivo después del mount inicial.

## Opciones por tema

| Modo | `fill` | Texto título | Texto descripción |
|---|---|---|---|
| Light | `#FFFFFF` (default) | natural (oscuro) | natural (gris) |
| Dark | `#171717` | `text-white!` | `text-white/75!` |

El badge/círculo de estado mantiene siempre su color de notificación (verde/rojo/amber/azul) — no se sobreescribe.

## Uso

```ts
import { sileo } from "sileo"

// éxito con descripción
sileo.success({
  title: "Añadido al carrito",
  description: "Producto fue agregado exitosamente.",
})

// error con descripción
sileo.error({
  title: "Error en el pedido",
  description: "Inténtalo nuevamente.",
})

// warning / info
sileo.warning({ title: "Almacenamiento casi lleno" })
sileo.info({ title: "Nueva actualización disponible" })
```

Estructura siempre `{ title, description? }`. No usar string directo. No pasar `fill` ni `styles` en el call-site — el theming global vive en el wrapper.
