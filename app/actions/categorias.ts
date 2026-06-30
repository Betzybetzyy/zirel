"use server"

import { revalidatePath } from "next/cache"
import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
import { categoriaSchema, type CategoriaInput } from "@/lib/schemas/categoria"

export async function createCategoria(data: CategoriaInput) {
  await verifyAdmin()
  const parsed = categoriaSchema.safeParse(data)
  if (!parsed.success) return { success: false as const, error: "Datos inválidos" }

  const { name, description, order } = parsed.data
  try {
    const category = await prisma.category.create({
      data: { name, slug: toSlug(name), description: description || null, order },
    })
    revalidatePath("/admin/categorias")
    revalidatePath("/")
    return { success: true as const, category }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("Unique constraint")) {
      return { success: false as const, error: "Ya existe una categoría con ese nombre" }
    }
    return { success: false as const, error: "Error al crear la categoría" }
  }
}

export async function updateCategoria(id: string, data: CategoriaInput) {
  await verifyAdmin()
  const parsed = categoriaSchema.safeParse(data)
  if (!parsed.success) return { success: false as const, error: "Datos inválidos" }

  const { name, description, order } = parsed.data
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug: toSlug(name), description: description || null, order },
    })
    revalidatePath("/admin/categorias")
    revalidatePath("/")
    return { success: true as const, category }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("Unique constraint")) {
      return { success: false as const, error: "Ya existe una categoría con ese nombre" }
    }
    return { success: false as const, error: "Error al actualizar la categoría" }
  }
}

export async function deleteCategoria(id: string) {
  await verifyAdmin()
  try {
    const productsCount = await prisma.product.count({ where: { categoryId: id } })
    if (productsCount > 0) {
      return {
        success: false as const,
        error: `Esta categoría tiene ${productsCount} producto${productsCount > 1 ? "s" : ""} asociado${productsCount > 1 ? "s" : ""} y no puede eliminarse`,
      }
    }
    await prisma.category.delete({ where: { id } })
    revalidatePath("/admin/categorias")
    revalidatePath("/")
    return { success: true as const }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error al eliminar la categoría"
    return { success: false as const, error: msg }
  }
}
