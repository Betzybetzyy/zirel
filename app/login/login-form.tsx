"use client";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm({ next }: { next: string }) {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-[var(--zirel-cafe-topo)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-[var(--zirel-arena)] bg-white px-3 py-2 text-sm text-[var(--zirel-negro-suave)] outline-none focus:border-[var(--zirel-dorado-beige)] focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-[var(--zirel-cafe-topo)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-[var(--zirel-arena)] bg-white px-3 py-2 text-sm text-[var(--zirel-negro-suave)] outline-none focus:border-[var(--zirel-dorado-beige)] focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        />
      </div>

      {error && (
        <p
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-[var(--zirel-negro-suave)] px-4 py-2.5 text-sm font-semibold text-[var(--zirel-marfil)] transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {pending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
