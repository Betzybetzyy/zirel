"use server";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { loginSchema, type LoginInput } from "@/lib/schemas/login";

export async function login(data: LoginInput): Promise<string | null> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos.";
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const next = parsed.data.next || "/admin";

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
