# Paleta de colores — Zirel

**Nunca usar hex arbitrarios.** Siempre variables CSS de `app/globals.css`.

## Variables primitivas

| Variable | Hex | Uso |
|---|---|---|
| `--zirel-marfil` | `#F7F3EE` | Fondo principal |
| `--zirel-beige-suave` | `#E9DFD2` | Fondos secundarios, chips inactivos |
| `--zirel-arena` | `#D8C7B5` | Bordes, inputs, switch inactivo |
| `--zirel-dorado-claro` | `#DABF9D` | Hover de botones dorados |
| `--zirel-dorado-beige` | `#C7A87E` | **Acento principal** — botones, switch activo, íconos activos |
| `--zirel-cafe-topo` | `#6E5A4B` | Texto secundario / muted |
| `--zirel-negro-suave` | `#2B2623` | Texto principal, foreground |

## Tokens shadcn vinculados

Usar tokens semánticos en componentes genéricos, primitivas solo para control exacto.

```
--background       → --zirel-marfil
--foreground       → --zirel-negro-suave
--muted-foreground → --zirel-cafe-topo
--border           → --zirel-arena
--accent           → --zirel-dorado-beige
--ring             → --zirel-dorado-beige
--destructive      → #B85A5A
```

## Modo oscuro (admin)

Activado con `data-admin-theme="dark"` en el elemento raíz. Las mismas variables se redefinen dentro de ese selector. El sitio público no tiene modo oscuro.
