"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
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

const FLAG_ICONS: Record<string, React.ReactNode> = {
  cart: <ShoppingCart className="size-4" />,
};

interface FeatureFlagsDialogProps {
  initial: AdminFlag[];
}

export function FeatureFlagsDialog({ initial }: FeatureFlagsDialogProps) {
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<AdminFlag[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isCreating, startCreate] = useTransition();

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
        toast.error("No se pudo guardar el cambio.");
      } else {
        const label = flags.find((f) => f.key === key)?.label ?? key;
        toast.success(`${label} ${value ? "activado" : "desactivado"}.`);
      }
    });
  }

  function handleCreate() {
    startCreate(async () => {
      const result = await createFeatureFlag({
        key: newKey,
        label: newLabel,
        description: newDesc,
      });
      if (!result.success) {
        toast.error(result.error ?? "No se pudo crear el flag.");
      } else {
        setFlags((prev) => [
          ...prev,
          { key: newKey, label: newLabel, description: newDesc, enabled: false, isDynamic: true },
        ]);
        setNewKey("");
        setNewLabel("");
        setNewDesc("");
        setShowCreate(false);
        toast.success(`Flag "${newLabel}" creado.`);
      }
    });
  }

  const canSubmit =
    newKey.length >= 2 &&
    /^[a-z][a-z0-9_-]*$/.test(newKey) &&
    newLabel.trim().length >= 2;

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
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">
          {/* Header */}
          <div
            className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3"
            style={{
              background: "color-mix(in srgb, var(--zirel-marfil) 50%, white)",
            }}
          >
            <div
              className="size-7 rounded-md flex items-center justify-center shrink-0"
              style={{
                background:
                  "color-mix(in srgb, var(--zirel-dorado-beige) 15%, transparent)",
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
          <div className="px-4 pt-3">
            {flags.map((flag) => {
              const isActive = flag.enabled;
              return (
                <div
                  key={flag.key}
                  className="flex items-center gap-4 px-3 py-4 rounded-xl transition-colors duration-200"
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
                        : "var(--zirel-beige-suave)",
                      color: isActive
                        ? "var(--zirel-dorado-beige)"
                        : "var(--zirel-cafe-topo)",
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
                            : "var(--zirel-beige-suave)",
                          color: "var(--zirel-cafe-topo)",
                        }}
                      >
                        {isActive ? "activo" : "inactivo"}
                      </span>
                      {flag.isDynamic && (
                        <span
                          className="text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm"
                          style={{
                            background: "var(--zirel-beige-suave)",
                            color: "var(--zirel-cafe-topo)",
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
          <div
            className="mx-4 mb-4 rounded-xl border border-dashed border-[var(--border)] overflow-hidden transition-all duration-200"
          >
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
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Nuevo flag
                  </p>
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setNewKey("");
                      setNewLabel("");
                      setNewDesc("");
                    }}
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
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="mi_flag"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    />
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
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Mi funcionalidad"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Descripción <span className="normal-case tracking-normal font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="¿Qué hace este flag?"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  />
                </div>

                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!canSubmit || isCreating}
                  className="w-full bg-[#C7A87E] text-[#1e1a17] hover:bg-[#DABF9D] border-0 font-semibold text-xs h-8"
                >
                  {isCreating ? "Creando..." : "Crear flag"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
