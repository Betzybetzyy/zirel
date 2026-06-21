"use server"

import { revalidatePath } from "next/cache"
import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { cloudinary } from "@/lib/cloudinary"
import { productoSchema, type ProductoInput } from "@/lib/schemas/producto"
import { toSlug } from "@/lib/utils"

export async function createProducto(data: ProductoInput) {
  await verifyAdmin()

  const parsed = productoSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos" }
  }

  const { name, sku, ...rest } = parsed.data

  try {
    const product = await prisma.product.create({
      data: {
        ...rest,
        name,
        sku: sku.toUpperCase(),
        slug: toSlug(name),
        description: rest.description ?? "",
      },
    })
    revalidatePath("/admin/productos")
    revalidatePath("/")
    return { success: true as const, product }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("Unique constraint") && msg.includes("sku")) {
      return { success: false as const, error: "El SKU ya existe en otro producto" }
    }
    if (msg.includes("Unique constraint") && msg.includes("slug")) {
      return { success: false as const, error: "Ya existe un producto con ese nombre" }
    }
    return { success: false as const, error: "Error al crear el producto" }
  }
}

export async function updateProducto(id: string, data: ProductoInput) {
  await verifyAdmin()

  const parsed = productoSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: "Datos inválidos" }
  }

  const { name, sku, ...rest } = parsed.data

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        name,
        sku: sku.toUpperCase(),
        slug: toSlug(name),
        description: rest.description ?? "",
      },
    })
    revalidatePath("/admin/productos")
    revalidatePath("/")
    return { success: true as const, product }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("Unique constraint")) {
      return { success: false as const, error: "El SKU o nombre ya existe en otro producto" }
    }
    return { success: false as const, error: "Error al actualizar el producto" }
  }
}

export async function uploadProductImage(formData: FormData) {
  await verifyAdmin()

  const productId = formData.get("productId")
  const sku = formData.get("sku")
  const file = formData.get("file")

  if (typeof productId !== "string" || typeof sku !== "string") {
    return { success: false as const, error: "Datos inválidos" }
  }

  if (!(file instanceof File)) {
    return { success: false as const, error: "Archivo inválido" }
  }

  if (!file.type.startsWith("image/")) {
    return { success: false as const, error: "El archivo debe ser una imagen" }
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
  if (file.size > MAX_SIZE) {
    return { success: false as const, error: "La imagen no puede superar 5 MB" }
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "zirel/products",
      public_id: sku.toUpperCase(),
      overwrite: true,
      resource_type: "image",
      transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
    })

    const url = result.secure_url

    // Upsert: actualizar imagen principal existente o crear una nueva
    const existing = await prisma.productImage.findFirst({
      where: { productId, isPrimary: true },
    })

    if (existing) {
      await prisma.productImage.update({
        where: { id: existing.id },
        data: { url },
      })
    } else {
      await prisma.productImage.create({
        data: { productId, url, isPrimary: true, order: 0 },
      })
    }

    revalidatePath("/admin/productos")
    revalidatePath("/")
    return { success: true as const, url }
  } catch {
    return { success: false as const, error: "Error al subir la imagen" }
  }
}

export async function getNextSkuForCategory(categoryId: string): Promise<string> {
  await verifyAdmin()

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { slug: true },
  })

  const products = await prisma.product.findMany({
    where: { categoryId },
    select: { sku: true },
  })

  let maxNum = 0
  let prefix: string | null = null

  for (const { sku } of products) {
    const match = sku.match(/^(.+)-(\d+)$/)
    if (match) {
      const num = parseInt(match[2], 10)
      if (num > maxNum) {
        maxNum = num
        prefix = match[1]
      }
    }
  }

  if (!prefix) {
    prefix = (category?.slug ?? "prd").replace(/-/g, "").slice(0, 3).toUpperCase()
  }

  return `${prefix}-${String(maxNum + 1).padStart(3, "0")}`
}

export async function deleteProducto(id: string) {
  await verifyAdmin()

  try {
    // Leer sku antes de borrar para destruir asset de Cloudinary
    const product = await prisma.product.findUnique({
      where: { id },
      select: { sku: true },
    })

    await prisma.product.delete({ where: { id } })

    // Limpiar asset de Cloudinary (best-effort, no bloquea si falla)
    if (product?.sku) {
      await cloudinary.uploader
        .destroy(`zirel/products/${product.sku.toUpperCase()}`)
        .catch(() => null)
    }

    revalidatePath("/admin/productos")
    revalidatePath("/")
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Error al eliminar el producto" }
  }
}
