# Tipografía — Zirel

Dos fuentes únicas. No mezclar con otras.

| Fuente | Variable CSS | Uso |
|---|---|---|
| `Libre Baskerville` | `var(--font-serif)` / `var(--font-baskerville)` | Headings (`h1`–`h6`) |
| `Nunito Sans` | `var(--font-sans)` / `var(--font-nunito)` | Cuerpo, UI, labels |

## Reglas

- Headings: `font-weight: 400`, `letter-spacing: -0.025em`, `text-wrap: balance` — definidos globalmente en `globals.css`. No sobreescribir sin razón.
- Párrafos: `text-wrap: pretty` — evita palabras huérfanas.
- En componentes UI (botones, labels, badges): `style={{ fontFamily: "var(--font-nunito)" }}` si el componente puede heredar otra fuente.
- Labels pequeños uppercase: `tracking-widest` o `tracking-[0.15em–0.3em]`, `text-[9px]–text-xs`, `font-bold`.
