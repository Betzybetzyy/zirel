"use server";

import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const keySchema = z
  .string()
  .min(2)
  .max(50)
  .regex(/^[a-z][a-z0-9_-]*$/, "Solo minúsculas, números, guion o guion bajo.");

export async function updateFeatureFlag(key: string, enabled: boolean) {
  try {
    await verifyAdmin();
    const validKey = keySchema.parse(key);
    z.boolean().parse(enabled);

    await prisma.featureFlag.upsert({
      where: { key: validKey },
      create: { key: validKey, enabled, label: "", description: "" },
      update: { enabled },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/configuracion");

    return { success: true as const };
  } catch (error) {
    console.error("[updateFeatureFlag]", error instanceof Error ? error.message : error);
    return { success: false as const, error: "Error al actualizar el flag." };
  }
}

export async function createFeatureFlag(data: {
  key: string;
  label: string;
  description: string;
}) {
  try {
    await verifyAdmin();

    const validKey = keySchema.parse(data.key);
    const validLabel = z.string().min(2).max(80).parse(data.label.trim());
    const validDesc = z.string().max(200).parse(data.description.trim());

    const existing = await prisma.featureFlag.findUnique({ where: { key: validKey } });
    if (existing) {
      return { success: false as const, error: "Ya existe un flag con esa clave." };
    }

    await prisma.featureFlag.create({
      data: { key: validKey, label: validLabel, description: validDesc, enabled: false },
    });

    revalidatePath("/admin/configuracion");

    return { success: true as const };
  } catch (error) {
    console.error("[createFeatureFlag]", error instanceof Error ? error.message : error);
    return { success: false as const, error: "Error al crear el flag." };
  }
}
