# Superficies — bordes, radios, sombras, noise

## Radios

```
--radius:    0.375rem  (base)
--radius-sm: 0.125rem
--radius-md: 0.25rem
--radius-lg: 0.375rem
--radius-xl: 0.625rem
```

`rounded-xl` / `rounded-2xl` en contenedores grandes (modales, cards). Hijos usan radios menores.
**Regla:** contenedor externo más redondeado que sus hijos.

## Sombras

Teñidas con el color de fondo, no negro puro:

```css
box-shadow: 0 4px 24px color-mix(in srgb, var(--zirel-cafe-topo) 12%, transparent);
```

El `Switch` usa `shadow-lg` en thumb blanco — aceptable sobre fondo coloreado.

## Noise overlay

`globals.css` agrega textura noise global vía `body::after` (SVG fractal, opacidad `0.018`, `pointer-events: none`, `z-index: 9998`). No eliminarlo ni duplicarlo.

Z-index de noise: `9998`. Overlays/modales deben usar `z-50` o superior, sin superar `9997` en capas decorativas.
