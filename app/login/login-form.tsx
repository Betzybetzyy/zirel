"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/schemas/login";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", next },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const error = await login(data);
    if (error) {
      form.setError("root", { message: error });
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />

        <TextField
          name="email"
          label="Correo electrónico"
          type="email"
          required
          autoComplete="email"
          inputClassName="rounded-md border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)] text-sm text-[var(--zirel-negro-suave)]"
        />

        {/* Password con toggle show/hide */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password-field"
            className="text-sm font-semibold text-[var(--zirel-cafe-topo)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Contraseña <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              id="password-field"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full rounded-md border border-[var(--zirel-arena)] bg-white px-3 py-2 pr-10 text-sm text-[var(--zirel-negro-suave)] outline-none focus:border-[var(--zirel-dorado-beige)] focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
              style={{ fontFamily: "var(--font-nunito)" }}
              {...form.register("password")}
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
          {form.formState.errors.password && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p
            className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-[var(--zirel-negro-suave)] px-4 py-2.5 text-sm font-semibold text-[var(--zirel-marfil)] transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}
