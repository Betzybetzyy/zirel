"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sileo } from "sileo"
import { Upload } from "lucide-react"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { TextField } from "@/components/form/TextField"
import { SelectField } from "@/components/form/SelectField"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { productoSchema, type ProductoInput } from "@/lib/schemas/producto"
import {
  createProducto,
  updateProducto,
  uploadProductImage,
  getNextSkuForCategory,
} from "@/app/actions/productos"
import type { Category } from "@prisma/client"

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] tracking-[0.18em] uppercase text-foreground/35 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

interface ProductoFormProps {
  categories: Category[]
  productId?: string
  defaultValues?: Partial<ProductoInput>
  defaultImageUrl?: string
}

export function ProductoForm({
  categories,
  productId,
  defaultValues,
  defaultImageUrl,
}: ProductoFormProps) {
  const router = useRouter()
  const isEdit = !!productId

  const form = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: 0,
      stock: 0,
      size: "",
      material: "Plata 925",
      categoryId: "",
      active: true,
      featured: false,
      ...defaultValues,
    },
  })

  // Imagen
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(defaultImageUrl)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onSubmit = form.handleSubmit(async (data) => {
    const result = isEdit
      ? await updateProducto(productId, data)
      : await createProducto(data)

    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }

    // Subir imagen si el usuario eligió una
    if (file && result.product) {
      const fd = new FormData()
      fd.append("productId", result.product.id)
      fd.append("sku", result.product.sku)
      fd.append("file", file)

      const uploadResult = await uploadProductImage(fd)
      if (!uploadResult.success) {
        form.setError("root", { message: uploadResult.error })
        return
      }
    }

    sileo.success({
      title: isEdit ? "Producto actualizado" : "Producto creado",
      description: isEdit
        ? "Los cambios fueron guardados correctamente."
        : "El producto fue creado correctamente.",
    })

    if (!isEdit) form.reset()
    router.push("/admin/productos")
    router.refresh()
  })

  const watchedCategoryId = form.watch("categoryId")

  useEffect(() => {
    if (!watchedCategoryId || isEdit) return
    getNextSkuForCategory(watchedCategoryId).then((sku) => {
      form.setValue("sku", sku)
    })
  }, [watchedCategoryId, isEdit, form])

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {/* Two-column: form fields left, image + config right */}
        <div className="grid lg:grid-cols-[1fr_232px] gap-8 lg:gap-10">

          {/* ── Left: form fields ── */}
          <div className="space-y-5">
            <SectionLabel label="Identificación" />
            <div className="grid md:grid-cols-2 gap-4">
              <TextField name="name" label="Nombre" required />
              <TextField name="sku" label="SKU" required readOnly placeholder="—" />
            </div>

            <SectionLabel label="Precio y categoría" />
            <div className="grid md:grid-cols-2 gap-4">
              <SelectField
                name="categoryId"
                label="Categoría"
                required
                options={categoryOptions}
              />
              <TextField name="price" label="Precio (CLP)" type="number" required />
            </div>

            <SectionLabel label="Inventario" />
            <div className="grid md:grid-cols-2 gap-4">
              <TextField name="stock" label="Stock" type="number" required />
              <TextField name="material" label="Material" required />
            </div>

            <TextField
              name="size"
              label="Talla / Medida"
              placeholder="Ej: Talla 18, 20mm diámetro"
            />

            <TextField
              name="description"
              label="Descripción"
              multiline
              placeholder="Descripción del producto..."
            />
          </div>

          {/* ── Right: image + config ── */}
          <div className="space-y-6">
            {/* Image upload zone */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-foreground/60 mb-3">
                Imagen del producto
              </p>

              {/* Upload zone — full square */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Seleccionar imagen del producto"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className={cn(
                  "relative w-full aspect-square cursor-pointer overflow-hidden transition-colors group",
                  "bg-[var(--zirel-marfil)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  !previewUrl &&
                    "border-2 border-dashed border-[var(--zirel-arena)] hover:border-[var(--zirel-dorado-beige)]"
                )}
              >
                {previewUrl ? (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Vista previa del producto"
                      fill
                      sizes="232px"
                      className="object-contain"
                      unoptimized={previewUrl.startsWith("blob:")}
                    />
                    {/* Hover: change overlay */}
                    <div className="absolute inset-0 bg-[var(--zirel-negro-suave)]/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[var(--zirel-marfil)] text-[9px] tracking-[0.2em] uppercase">
                        Cambiar imagen
                      </span>
                    </div>
                    <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(43,38,35,0.08)] pointer-events-none" />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
                    <Upload
                      strokeWidth={1.25}
                      className="w-7 h-7 text-foreground/20 group-hover:text-[var(--zirel-dorado-beige)] transition-colors"
                    />
                    <span className="text-[10px] leading-snug text-foreground/35 group-hover:text-foreground/50 transition-colors">
                      Haz clic para seleccionar
                    </span>
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="mt-2 space-y-0.5">
                {file && (
                  <p className="text-[11px] text-foreground/50 truncate">{file.name}</p>
                )}
                <p className="text-[10px] text-foreground/30">
                  JPG, PNG, WEBP · Máx. 5 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0]
                  if (selected) setFile(selected)
                  e.target.value = ""
                }}
              />
            </div>

            {/* Config toggles */}
            <div className="pt-1 border-t border-border space-y-4">
              <p className="text-[9px] tracking-[0.18em] uppercase text-foreground/35 pt-3">
                Visibilidad
              </p>

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-3">
                    <FormLabel className="!mt-0 text-[10px] tracking-widest uppercase cursor-pointer text-foreground/65 font-normal">
                      Activo
                    </FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-3">
                    <FormLabel className="!mt-0 text-[10px] tracking-widest uppercase cursor-pointer text-foreground/65 font-normal">
                      Destacado en home
                    </FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-8 pt-6 border-t border-border">
          {form.formState.errors.root && (
            <p className="text-sm text-destructive mb-4">
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/admin/productos")}
              disabled={form.formState.isSubmitting}
              className="text-foreground/60 hover:text-foreground text-[10px] tracking-widest uppercase"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)] border-0 font-semibold text-[10px] tracking-widest uppercase px-6 transition-colors"
            >
              {form.formState.isSubmitting
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear producto"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
