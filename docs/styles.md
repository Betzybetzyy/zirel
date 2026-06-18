# Guía de diseño — Zirel

Referencia de reglas de diseño para mantener coherencia visual en toda la app.

---

## Paleta de colores

Todas las variables están definidas en `app/globals.css`. **Nunca usar hex arbitrarios** — siempre usar las variables CSS.

### Variables Zirel (primitivas)

| Variable | Hex | Uso |
|---|---|---|
| `--zirel-marfil` | `#F7F3EE` | Fondo principal |
| `--zirel-beige-suave` | `#E9DFD2` | Fondos secundarios, chips inactivos |
| `--zirel-arena` | `#D8C7B5` | Bordes, inputs, switch inactivo |
| `--zirel-dorado-claro` | `#DABF9D` | Hover de botones dorados |
| `--zirel-dorado-beige` | `#C7A87E` | **Acento principal** — botones, switch activo, íconos activos |
| `--zirel-cafe-topo` | `#6E5A4B` | Texto secundario / muted |
| `--zirel-negro-suave` | `#2B2623` | Texto principal, foreground |

### Tokens shadcn vinculados

Usar los tokens semánticos en componentes genéricos, las primitivas solo cuando se necesita control exacto.

```
--background      → --zirel-marfil
--foreground      → --zirel-negro-suave
--muted-foreground → --zirel-cafe-topo
--border          → --zirel-arena
--accent          → --zirel-dorado-beige
--ring            → --zirel-dorado-beige
--destructive     → #B85A5A
```

### Modo oscuro (admin)

El admin tiene un tema oscuro activado con `data-admin-theme="dark"` en el elemento raíz. Las mismas variables se redefinen dentro de ese selector. El público no tiene modo oscuro, en caso de tener se debe actualizar esto.

---

## Tipografía

Dos fuentes, sin mezclar con otras:

| Fuente | Variable CSS | Uso |
|---|---|---|
| `Libre Baskerville` | `var(--font-serif)` / `var(--font-baskerville)` | Headings (`h1`–`h6`) |
| `Nunito Sans` | `var(--font-sans)` / `var(--font-nunito)` | Cuerpo, UI, labels |

### Reglas

- Headings tienen `font-weight: 400`, `letter-spacing: -0.025em`, `text-wrap: balance` — definidos globalmente en `globals.css`. No sobreescribir sin razón.
- Párrafos tienen `text-wrap: pretty` — evita palabras huérfanas.
- En componentes UI (botones, labels, badges) usar siempre `style={{ fontFamily: "var(--font-nunito)" }}` si el componente puede heredar otra fuente accidentalmente.
- Labels pequeños en uppercase: `tracking-widest` o `tracking-[0.15em–0.3em]`, `text-[9px]–text-xs`, `font-bold`.

---

## Bordes y radios

```
--radius: 0.375rem  (base)
--radius-sm: 0.125rem
--radius-md: 0.25rem
--radius-lg: 0.375rem
--radius-xl: 0.625rem
```

Además se usan `rounded-xl` y `rounded-2xl` en contenedores grandes (modales, cards principales). Elementos internos usan radios menores (`rounded-md`, `rounded-lg`).

**Regla:** variar el radio según jerarquía — los contenedores externos son más redondeados que sus hijos.

---

## Noise overlay

`globals.css` agrega un noise texture global vía `body::after` (SVG fractal, opacidad `0.018`, `pointer-events: none`, `z-index: 9998`). Rompe la planitud digital sin afectar la legibilidad. No eliminarlo ni duplicarlo.

---

## Sombras

Usar sombras teñidas con el color de fondo, no negro puro. Ejemplo para superficies sobre fondo marfil:

```css
box-shadow: 0 4px 24px color-mix(in srgb, var(--zirel-cafe-topo) 12%, transparent);
```

El componente `Switch` usa `shadow-lg` sobre el thumb blanco — aceptable porque contrasta sobre fondo coloreado.

---

## Modales (`Dialog`)

### Estructura base

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">

    {/* Header */}
    <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3"
         style={{ background: "color-mix(in srgb, var(--zirel-marfil) 50%, white)" }}>
      {/* Ícono opcional */}
      <div className="size-7 rounded-md flex items-center justify-center shrink-0"
           style={{ background: "color-mix(in srgb, var(--zirel-dorado-beige) 15%, transparent)",
                    color: "var(--zirel-dorado-beige)" }}>
        <MiIcono className="size-3.5" />
      </div>
      <DialogTitle className="text-sm font-semibold tracking-widest uppercase text-[var(--foreground)]"
                   style={{ fontFamily: "var(--font-nunito)" }}>
        Título
      </DialogTitle>
    </div>

    {/* Body */}
    <div className="px-4 py-3">
      {/* contenido */}
    </div>

  </DialogContent>
</Dialog>
```

### Reglas de modales

| Decisión | Regla |
|---|---|
| Padding | `p-0` en `DialogContent`, controlar padding interno por sección |
| Borde de header | `border-b border-[var(--border)]` |
| Fondo de header | `color-mix(in srgb, var(--zirel-marfil) 50%, white)` — tono marfil suave |
| Ícono de header | `size-7 rounded-md` con fondo dorado al 15% de opacidad |
| Título | `text-sm font-semibold tracking-widest uppercase`, fuente Nunito |
| Descripción | Solo cuando es imprescindible. Omitir si el título es autoexplicativo |
| Ancho | `max-w-md` para modales estándar, `max-w-lg` para contenido más amplio |
| Bordes | `rounded-2xl overflow-hidden` — obligatorio para que el clip funcione |
| Close button | El componente `DialogContent` lo agrega automáticamente (`showCloseButton` prop) |

### Cuándo NO usar modal

- Edición inline simple → usar campo editable en contexto.
- Confirmación de una sola acción → usar `AlertDialog` o un botón de confirmación inline.
- Formularios largos (más de 5 campos) → preferir página propia o slide-over.

---

## Rows de configuración / listas de opciones

Patrón usado en el modal de feature flags, replicable para cualquier lista de configuración:

```tsx
<div
  className="flex items-center gap-4 px-3 py-4 rounded-xl transition-colors duration-200"
  style={{ background: isActive
    ? "color-mix(in srgb, var(--zirel-dorado-beige) 8%, transparent)"
    : "transparent" }}
>
  {/* Ícono contextual */}
  <div className="size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
       style={{
         background: isActive
           ? "color-mix(in srgb, var(--zirel-dorado-beige) 18%, transparent)"
           : "var(--zirel-beige-suave)",
         color: isActive ? "var(--zirel-dorado-beige)" : "var(--zirel-cafe-topo)",
       }}>
    <MiIcono className="size-4" />
  </div>

  {/* Texto */}
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-0.5">
      <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
      <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm"
            style={{
              background: isActive
                ? "color-mix(in srgb, var(--zirel-dorado-beige) 18%, transparent)"
                : "var(--zirel-beige-suave)",
              color: "var(--zirel-cafe-topo)",
            }}>
        {isActive ? "activo" : "inactivo"}
      </span>
    </div>
    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{description}</p>
  </div>

  {/* Control */}
  <Switch checked={isActive} onCheckedChange={handleToggle} />
</div>
```

---

## Botones

### Variantes de uso frecuente

| Variante | Cuándo |
|---|---|
| Primario dorado | Acción principal en admin: `bg-[#C7A87E] text-[#1e1a17] hover:bg-[#DABF9D] border-0 font-semibold` |
| Primario oscuro | `variant="default"` — usa `--primary` (negro suave) |
| Secundario | `variant="secondary"` — usa `--secondary` (beige suave) |
| Ghost | Acciones terciarias, navegación discreta |
| Destructivo | `variant="destructive"` — usa `--destructive` (#B85A5A) |

### Reglas

- Siempre incluir ícono de 4px (`size-4`) con `gap-2` cuando el botón tiene ícono + texto.
- No usar más de dos variantes visuales distintas en la misma sección.
- Botones de confirmación destructiva: siempre pedir confirmación antes de ejecutar.

---

## Switch

- Forma: `rounded-full` en root y thumb (píldora).
- Estado inactivo: `--zirel-arena`.
- Estado activo: `--zirel-dorado-beige` (dorado, no el negro).
- Thumb: blanco con `shadow-lg`.

Definido en `components/ui/switch.tsx`.

---

## Header público

- `sticky top-0 z-50`, altura `h-20`.
- Fondo: `bg-[var(--zirel-marfil)]/95 backdrop-blur-sm` con borde inferior `border-[var(--zirel-arena)]/40`.
- Logo: `mix-blend-multiply` para fusionar con el fondo marfil.
- Max-width contenedor: `max-w-7xl px-6`.

---

## Sidebar admin

Variables dedicadas con prefijo `--admin-sidebar-*` para no contaminar el sistema de tokens global. Soporta modo oscuro via `data-admin-theme="dark"`. Ancho: `w-60` expandido, `w-16` colapsado.

---

## Imágenes de producto

- Solo Cloudinary (`res.cloudinary.com` en allowlist de `next.config.ts`).
- Cards: fondo beige exterior + contenedor blanco interior + `object-contain`.
- **No usar `mix-blend-multiply`** en imágenes de producto — tiñe la joyería plateada.

---

## Feature Flags — arquitectura e implementación

### Cómo funciona

Los feature flags tienen dos capas:

| Capa | Archivo | Qué controla |
|---|---|---|
| **Estática** (código) | `lib/feature-flags.ts` | Tipo, label y descripción de flags conocidos |
| **Dinámica** (DB) | tabla `feature_flags` | Estado `enabled` de todos los flags; label/desc de dinámicos |

`getFeatureFlags()` en `lib/queries.ts` devuelve `FeatureFlagMap` tipado — para uso en layouts y Server Components del sitio público.

`getAllFlagsForAdmin()` devuelve `AdminFlag[]` — para el panel admin. Incluye estáticos + dinámicos.

### Crear un flag estático (en código)

Paso 1 — Agregar a `lib/feature-flags.ts`:

```ts
export const FEATURE_FLAGS = [
  {
    key: "cart",
    label: "Carro de compra",
    description: "...",
    default: true,
  },
  {
    key: "mi_nuevo_flag",      // slug: minúsculas, guion o guion bajo
    label: "Mi nueva función",
    description: "Descripción de qué hace.",
    default: false,
  },
] as const;
```

Paso 2 — Usarlo en cualquier layout o Server Component:

```ts
const flags = await getFeatureFlags();
if (!flags.mi_nuevo_flag) redirect("/");
```

El flag estático aparece automáticamente en el admin. No requiere migraciones — la primera vez que se activa/desactiva, el `upsert` crea el registro en DB.

### Crear un flag dinámico (desde la UI admin)

Ir a `/admin/configuracion` → botón "Modificar" → "+ Nuevo flag".

Los flags dinámicos:
- Tienen clave, nombre y descripción almacenados en DB.
- Aparecen en el admin con badge "dinámico".
- **No son accesibles desde el código** vía `getFeatureFlags()` hasta que se agreguen al array estático en `lib/feature-flags.ts`.
- Sirven para reservar claves con anticipación o probar desde la UI antes de implementar.

### Usar un flag dinámico en código

Una vez creado desde la UI, moverlo al array estático:

```ts
// lib/feature-flags.ts
{ key: "mi_flag_dinamico", label: "...", description: "...", default: false }
```

A partir de ese momento `flags.mi_flag_dinamico` es type-safe y su estado (enabled/disabled) se toma de la DB como cualquier flag estático.

### Modelo en DB

```prisma
model FeatureFlag {
  key         String   @id          // slug único
  label       String   @default("") // para flags dinámicos
  description String   @default("") // para flags dinámicos
  enabled     Boolean
  updatedAt   DateTime @updatedAt
}
```

Los flags estáticos ignoran `label`/`description` de DB — siempre se usa el valor del array en código.

### Validación de claves

Solo se aceptan claves que cumplan: `/^[a-z][a-z0-9_-]*$/` — minúsculas, empieza con letra, puede contener dígitos, guion o guion bajo. Máximo 50 caracteres.

---

## Reglas generales

- **Un acento, un color.** Solo `--zirel-dorado-beige` como acento. No introducir colores extra.
- **Sin grises neutros.** Todos los grises están teñidos con el tono cálido de la paleta.
- **Transiciones:** `duration-200` para hover/focus, `duration-200` para cambios de color en rows.
- **Scroll:** `scroll-behavior: smooth` definido globalmente.
- **Z-index de noise overlay:** `9998`. Cualquier overlay/modal debe usar `z-50` o superior pero sin superar `9997` en capas decorativas.
- **`color-mix()`** para transparencias de marca — no usar `opacity` en el elemento si afecta al contenido hijo.
