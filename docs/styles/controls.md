# Botones y controles

## Botones — variantes frecuentes

| Variante | Cuándo |
|---|---|
| Primario dorado | Acción principal admin: `bg-[#C7A87E] text-[#1e1a17] hover:bg-[#DABF9D] border-0 font-semibold` |
| Primario oscuro | `variant="default"` — usa `--primary` (negro suave) |
| Secundario | `variant="secondary"` — usa `--secondary` (beige suave) |
| Ghost | Acciones terciarias, navegación discreta |
| Destructivo | `variant="destructive"` — usa `--destructive` (#B85A5A) |

## Reglas de botones

- Ícono `size-4` con `gap-2` cuando botón tiene ícono + texto.
- No más de dos variantes visuales distintas en la misma sección.
- Botones destructivos: siempre pedir confirmación antes de ejecutar.

## Switch

- Forma: `rounded-full` en root y thumb (píldora).
- Estado inactivo: `--zirel-arena`.
- Estado activo: `--zirel-dorado-beige` (dorado, no negro).
- Thumb: blanco con `shadow-lg`.

Definido en `components/ui/switch.tsx`.
