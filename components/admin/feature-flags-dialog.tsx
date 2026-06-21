"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sileo } from "sileo";
import { SlidersHorizontal, ShoppingCart, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { type AdminFlag } from "@/lib/feature-flags";
import { updateFeatureFlag, createFeatureFlag } from "@/app/actions/feature-flags";
import { useAdminUIStore } from "@/lib/admin-ui-store";
import { createFeatureFlagSchema, type CreateFeatureFlagInput } from "@/lib/schemas/feature-flag";

const FLAG_ICONS: Record<string, React.ReactNode> = {
  cart: <ShoppingCart className="size-4" />,
};

interface FeatureFlagsDialogProps {
  initial: AdminFlag[];
}

export function FeatureFlagsDialog({ initial }: FeatureFlagsDialogProps) {
  const adminTheme = useAdminUIStore((s) => s.theme);
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<AdminFlag[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);

  const form = useForm<CreateFeatureFlagInput>({
    resolver: zodResolver(createFeatureFlagSchema),
    defaultValues: { key: "", label: "", description: "" },
  });

  function handleToggle(key: string, value: boolean) {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: value } : f))
    );
    startTransition(async () => {
      const result = await updateFeatureFlag(key, value);
      if (!result.success) {
        setFlags((prev) =>
          prev.map((f) => (f.key === key ? { ...f, enabled: !value } : f))
        );
        sileo.error({
          title: "Error al guardar",
          description: "No se pudo actualizar el flag.",
        });
      } else {
        const label = flags.find((f) => f.key === key)?.label ?? key;
        sileo.success({
          title: `${label} ${value ? "activado" : "desactivado"}`,
          description: `El flag fue ${value ? "activado" : "desactivado"} correctamente.`,
        });
      }
    });
  }

  const handleCreate = form.handleSubmit(async (data) => {
    const result = await createFeatureFlag({
      key: data.key,
      label: data.label,
      description: data.description ?? "",
    });
    if (!result.success) {
      sileo.error({
        title: "Error al crear",
        description: result.error ?? "No se pudo crear el flag.",
      });
    } else {
      setFlags((prev) => [
        ...prev,
        {
          key: data.key,
          label: data.label,
          description: data.description ?? "",
          enabled: false,
          isDynamic: true,
        },
      ]);
      form.reset();
      setShowCreate(false);
      sileo.success({
        title: `"${data.label}" creado`,
        description: "El flag fue creado correctamente.",
      });
    }
  });

  const isCreating = form.formState.isSubmitting;
  const errors = form.formState.errors;

  function handleCloseCreate() {
    setShowCreate(false);
    form.reset();
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 flex-shrink-0 bg-[#C7A87E] text-[#1e1a17] hover:bg-[#DABF9D] border-0 font-semibold"
      >
        <SlidersHorizontal className="size-4" />
        Modificar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-admin-theme={adminTheme} className="max-w-md rounded-2xl overflow-hidden p-0">
          {/* Header */}
          <div
            className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3"
            style={{
              background: adminTheme === "dark"
                ? "var(--secondary)"
                : "color-mix(in srgb, var(--zirel-marfil) 50%, white)",
            }}
          >
            <div
              className="size-7 rounded-md flex items-center justify-center shrink-0"
              style={{
                background: "color-mix(in srgb, var(--zirel-dorado-beige) 18%, var(--card))",
                color: "var(--zirel-dorado-beige)",
              }}
            >
              <SlidersHorizontal className="size-3.5" />
            </div>
            <DialogTitle
              className="text-sm font-semibold tracking-widest uppercase text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Funcionalidades
            </DialogTitle>
          </div>

          {/* Flag list */}
          <div className="px-4 pt-2 pb-3">
            {flags.map((flag) => {
              const isActive = flag.enabled;
              return (
                <div
                  key={flag.key}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors duration-200"
                  style={{
                    background: isActive
                      ? "color-mix(in srgb, var(--zirel-dorado-beige) 8%, transparent)"
                      : "transparent",
                  }}
                >
                  <div
                    className="size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
                    style={{
                      background: isActive
                        ? "color-mix(in srgb, var(--zirel-dorado-beige) 18%, transparent)"
                        : "var(--secondary)",
                      color: isActive
                        ? "var(--zirel-dorado-beige)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {FLAG_ICONS[flag.key] ?? <SlidersHorizontal className="size-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p
                        className="text-sm font-semibold text-[var(--foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {flag.label}
                      </p>
                      <span
                        className="text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm transition-colors duration-200"
                        style={{
                          background: isActive
                            ? "color-mix(in srgb, var(--zirel-dorado-beige) 18%, transparent)"
                            : "var(--secondary)",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {isActive ? "activo" : "inactivo"}
                      </span>
                      {flag.isDynamic && (
                        <span
                          className="text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm"
                          style={{
                            background: "var(--secondary)",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          dinámico
                        </span>
                      )}
                    </div>
                    {flag.description && (
                      <p
                        className="text-xs text-[var(--muted-foreground)] leading-relaxed"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {flag.description}
                      </p>
                    )}
                  </div>

                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => handleToggle(flag.key, checked)}
                    disabled={isPending}
                    aria-label={flag.label}
                    className="shrink-0"
                  />
                </div>
              );
            })}
          </div>

          {/* Create section */}
          <div className="mx-4 mb-4 rounded-xl border border-dashed border-[var(--border)] overflow-hidden transition-all duration-200">
            {!showCreate ? (
              <button
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--zirel-beige-suave)] transition-colors duration-150"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                <Plus className="size-3.5" />
                Nuevo flag
              </button>
            ) : (
              <form onSubmit={handleCreate} className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Nuevo flag
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseCreate}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label
                      className="block text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-1"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      Clave
                    </label>
                    <input
                      type="text"
                      placeholder="mi_flag"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)] aria-invalid:border-destructive"
                      style={{ fontFamily: "var(--font-nunito)" }}
                      aria-invalid={!!errors.key}
                      {...form.register("key", {
                        setValueAs: (v: string) =>
                          v.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                      })}
                    />
                    {errors.key && (
                      <p className="mt-0.5 text-[10px] text-destructive" role="alert">
                        {errors.key.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-[1.5]">
                    <label
                      className="block text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-1"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Mi funcionalidad"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)] aria-invalid:border-destructive"
                      style={{ fontFamily: "var(--font-nunito)" }}
                      aria-invalid={!!errors.label}
                      {...form.register("label")}
                    />
                    {errors.label && (
                      <p className="mt-0.5 text-[10px] text-destructive" role="alert">
                        {errors.label.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Descripción{" "}
                    <span className="normal-case tracking-normal font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="¿Qué hace este flag?"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                    {...form.register("description")}
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreating}
                  className="w-full bg-[#C7A87E] text-[#1e1a17] hover:bg-[#DABF9D] border-0 font-semibold text-xs h-8"
                >
                  {isCreating ? "Creando..." : "Crear flag"}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
