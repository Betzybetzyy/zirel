"use server";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function login(
  prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/admin";

  if (!email || !password) {
    return "Email y contraseña son requeridos.";
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch {
    return "Error de servidor. Intenta nuevamente.";
  }

  if (!user) {
    return "Credenciales incorrectas.";
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return "Credenciales incorrectas.";
  }

  await createSession(user.id, user.role);
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
