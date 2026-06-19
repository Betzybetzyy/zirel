# Formularios

Patrón estándar para todos los formularios del proyecto: **React Hook Form + Zod + shadcn Form**.

## Stack

| Capa | Qué usar |
|---|---|
| Estado de form | `useForm` de `react-hook-form` |
| Validación | `zodResolver` de `@hookform/resolvers/zod` |
| Schemas | `lib/schemas/<dominio>.ts` |
| Wrappers UI | `components/form/TextField`, `SelectField`, `DateField` |
| Primitivas | `components/ui/form.tsx` (Form, FormField, FormItem, FormLabel, FormControl, FormMessage) |

## Patrón base

```tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/form/TextField"
import { miSchema, type MiInput } from "@/lib/schemas/mi-dominio"

export function MiForm() {
  const form = useForm<MiInput>({
    resolver: zodResolver(miSchema),
    defaultValues: { campo: "" },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await miServerAction(data)
    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }
    form.reset()
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <TextField name="campo" label="Mi campo" required />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  )
}
```

## Criterios obligatorios

- Submit deshabilitado con `form.formState.isSubmitting` (no `useState`).
- Reset tras éxito: `form.reset()`.
- Errores globales (servidor): `form.setError("root", { message: ... })`.
- Valores por defecto en edit: pasar `defaultValues` al `useForm` y llamar `form.reset(data)` cuando llegan los datos.
- Tipos inferidos: `z.infer<typeof miSchema>` como tipo del form — no duplicar interfaces.

## Schemas — `lib/schemas/`

| Archivo | Exports |
|---|---|
| `messages.ts` | `msg` — strings ES reutilizables |
| `order.ts` | `customerSchema`, `orderSchema`, `CustomerInput`, `CreateOrderInput` |
| `login.ts` | `loginSchema`, `LoginInput` |
| `feature-flag.ts` | `flagKeySchema`, `createFeatureFlagSchema`, `CreateFeatureFlagInput` |
| `index.ts` | re-export de todos |

Mensajes en español. Usar `msg.required`, `msg.email`, `msg.min(n)`, `msg.max(n)`, etc.

```ts
import { z } from "zod"
import { msg } from "./messages"

export const productoSchema = z.object({
  nombre: z.string().min(2, msg.min(2)).max(100, msg.max(100)),
  precio: z.number({ error: msg.price }).positive(msg.number.positive),
  categoriaId: z.string().min(1, msg.required),
  descripcion: z.string().max(500, msg.max(500)).optional(),
})

export type ProductoInput = z.infer<typeof productoSchema>
```

## Wrappers — `components/form/`

### `TextField`
```tsx
<TextField
  name="customerName"
  label="Nombre completo"
  required
  type="email"         // default "text"
  multiline            // render Textarea en vez de Input
  placeholder="..."
  autoComplete="name"
/>
```

### `SelectField`
```tsx
<SelectField
  name="categoriaId"
  label="Categoría"
  required
  options={categorias.map(c => ({ value: c.id, label: c.name }))}
/>
```

### `DateField`
```tsx
<DateField
  name="fechaEntrega"
  label="Fecha de entrega"
  min="2025-01-01"
/>
```

## Estilos de campo

Los wrappers aplican automáticamente el estilo de campos del proyecto:
- Label: `text-[10px] tracking-widest uppercase text-[var(--zirel-cafe-topo)]`
- Input: `rounded-none border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)]`
- Error: `text-sm font-medium text-destructive` (vía `FormMessage`)

Sobreescribir con `inputClassName` o `className` cuando el contexto lo requiera (ej: formularios admin con estilos propios).

## Ejemplo de referencia — Producto (para CRUD admin futuro)

```tsx
// lib/schemas/producto.ts
export const productoSchema = z.object({
  nombre: z.string().min(2, msg.min(2)).max(100, msg.max(100)),
  sku: z.string().min(3, msg.min(3)).max(20, msg.max(20)),
  precio: z.number({ error: msg.price }).positive(msg.number.positive),
  categoriaId: z.string().min(1, msg.required),
  descripcion: z.string().max(500, msg.max(500)).optional(),
  activo: z.boolean().default(true),
})
export type ProductoInput = z.infer<typeof productoSchema>

// components/admin/producto-form.tsx
export function ProductoForm({ defaultValues }: { defaultValues?: Partial<ProductoInput> }) {
  const form = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema),
    defaultValues: { nombre: "", sku: "", precio: 0, categoriaId: "", activo: true, ...defaultValues },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = defaultValues
      ? await updateProducto(id, data)
      : await createProducto(data)
    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }
    if (!defaultValues) form.reset()
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <TextField name="nombre" label="Nombre" required />
          <TextField name="sku" label="SKU" required />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TextField name="precio" label="Precio (CLP)" type="number" required />
          <SelectField name="categoriaId" label="Categoría" required options={[...]} />
        </div>
        <TextField name="descripcion" label="Descripción" multiline />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando..." : defaultValues ? "Guardar cambios" : "Crear producto"}
        </Button>
      </form>
    </Form>
  )
}
```
