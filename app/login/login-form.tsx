"use client";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm({ next }: { next: string }) {
  const [error, action, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-[var(--zirel-arena)] bg-white px-3 py-2 pr-10 text-sm text-[var(--zirel-negro-suave)] outline-none focus:border-[var(--zirel-dorado-beige)] focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-negro-suave)]"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
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
