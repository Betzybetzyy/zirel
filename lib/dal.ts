import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, type SessionPayload } from "@/lib/session";

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const token = (await cookies()).get("session")?.value;
  const session = await decrypt(token);
  if (!session?.userId) {
    redirect("/");
  }
  return session;
});

export const verifyAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/");
  }
  return session;
});

export const isAuthenticated = cache(async (): Promise<boolean> => {
  const token = (await cookies()).get("session")?.value;
  const session = await decrypt(token);
  return !!session?.userId;
});

export const getCurrentUser = cache(async (): Promise<SessionPayload | null> => {
  const token = (await cookies()).get("session")?.value;
  return decrypt(token);
});
