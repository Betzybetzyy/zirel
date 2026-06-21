# Modales y rows de configuración

## Dialog — estructura base

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">

    {/* Header */}
    <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3"
         style={{ background: "color-mix(in srgb, var(--zirel-marfil) 50%, white)" }}>
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

## Reglas de modales

| Decisión | Regla |
|---|---|
| Padding | `p-0` en `DialogContent`, controlar padding interno por sección |
| Borde de header | `border-b border-[var(--border)]` |
| Fondo de header | `color-mix(in srgb, var(--zirel-marfil) 50%, white)` |
| Ícono de header | `size-7 rounded-md`, fondo dorado al 15% opacidad |
| Título | `text-sm font-semibold tracking-widest uppercase`, fuente Nunito |
| Descripción | Solo cuando imprescindible. Omitir si el título es autoexplicativo |
| Ancho | `max-w-md` estándar, `max-w-lg` para contenido más amplio |
| Bordes | `rounded-2xl overflow-hidden` — obligatorio para que el clip funcione |
| Close button | `DialogContent` lo agrega automáticamente (`showCloseButton` prop) |

## Cuándo NO usar modal

- Edición inline simple → campo editable en contexto.
- Confirmación de una sola acción → `AlertDialog` o botón de confirmación inline.
- Formularios largos (más de 5 campos) → página propia o slide-over.

## Rows de configuración

Patrón para listas de opciones con toggle (ej: feature flags):

```tsx
<div
  className="flex items-center gap-4 px-3 py-4 rounded-xl transition-colors duration-200"
  style={{ background: isActive
    ? "color-mix(in srgb, var(--zirel-dorado-beige) 8%, transparent)"
    : "transparent" }}
>
  <div className="size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
       style={{
         background: isActive
           ? "color-mix(in srgb, var(--zirel-dorado-beige) 18%, transparent)"
           : "var(--zirel-beige-suave)",
         color: isActive ? "var(--zirel-dorado-beige)" : "var(--zirel-cafe-topo)",
       }}>
    <MiIcono className="size-4" />
  </div>

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

  <Switch checked={isActive} onCheckedChange={handleToggle} />
</div>
```
