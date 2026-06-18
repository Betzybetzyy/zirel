# Feature Flags — arquitectura e implementación

## Cómo funciona

| Capa | Archivo | Qué controla |
|---|---|---|
| **Estática** (código) | `lib/feature-flags.ts` | Tipo, label y descripción de flags conocidos |
| **Dinámica** (DB) | tabla `feature_flags` | Estado `enabled` de todos los flags; label/desc de dinámicos |

- `getFeatureFlags()` en `lib/queries.ts` → `FeatureFlagMap` tipado — para layouts y Server Components del sitio público.
- `getAllFlagsForAdmin()` → `AdminFlag[]` — para el panel admin. Incluye estáticos + dinámicos.

## Crear flag estático (en código)

Paso 1 — agregar a `lib/feature-flags.ts`:

```ts
export const FEATURE_FLAGS = [
  {
    key: "mi_nuevo_flag",      // slug: minúsculas, empieza con letra, dígitos/guion/guion_bajo
    label: "Mi nueva función",
    description: "Descripción de qué hace.",
    default: false,
  },
] as const;
```

Paso 2 — usar en layout o Server Component:

```ts
const flags = await getFeatureFlags();
if (!flags.mi_nuevo_flag) redirect("/");
```

El flag aparece automáticamente en el admin. No requiere migraciones — el primer toggle hace `upsert` en DB.

## Crear flag dinámico (desde UI admin)

`/admin/configuracion` → "Modificar" → "+ Nuevo flag".

Flags dinámicos:
- Clave, nombre y descripción almacenados en DB.
- Aparecen en admin con badge "dinámico".
- **No accesibles desde código** vía `getFeatureFlags()` hasta agregarlos al array estático.
- Sirven para reservar claves con anticipación o probar desde UI antes de implementar.

## Promover flag dinámico a código

```ts
// lib/feature-flags.ts
{ key: "mi_flag_dinamico", label: "...", description: "...", default: false }
```

A partir de ese momento `flags.mi_flag_dinamico` es type-safe y su estado viene de DB.

## Modelo en DB

```prisma
model FeatureFlag {
  key         String   @id          // slug único
  label       String   @default("") // para flags dinámicos
  description String   @default("") // para flags dinámicos
  enabled     Boolean
  updatedAt   DateTime @updatedAt
}
```

Flags estáticos ignoran `label`/`description` de DB — siempre se usa el valor del array en código.

## Validación de claves

`/^[a-z][a-z0-9_-]*$/` — minúsculas, empieza con letra, puede contener dígitos, guion o guion bajo. Máximo 50 caracteres.
