import { verifyAdmin } from "@/lib/dal";
import { PageMeta } from "@/components/admin/page-meta";
import { getAllFlagsForAdmin } from "@/lib/queries";
import { FeatureFlagsDialog } from "@/components/admin/feature-flags-dialog";

export const metadata = { title: "Configuración – Zirel Admin" };

export default async function ConfiguracionPage() {
  await verifyAdmin();
  const flags = await getAllFlagsForAdmin();

  return (
    <>
      <PageMeta
        title="Configuración"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Configuración" },
        ]}
      />

      <div className="space-y-6">
        {/* Feature Flags card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          {/* Card header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--border)]">
            <div>
              <h2
                className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Feature Flags
              </h2>
              <p
                className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Controla funcionalidades del sitio en tiempo real sin desplegar.
              </p>
            </div>
            <FeatureFlagsDialog initial={flags} />
          </div>

          {/* Flags list */}
          <div className="divide-y divide-[var(--border)]">
            {flags.map((flag) => {
              const enabled = flag.enabled;
              return (
                <div
                  key={flag.key}
                  className="flex items-center justify-between gap-6 px-6 py-4"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p
                      className="text-sm font-medium text-[var(--foreground)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {flag.label}
                    </p>
                    <p
                      className="text-xs text-[var(--muted-foreground)] leading-relaxed"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {flag.description}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      background: enabled
                        ? "color-mix(in srgb, #C7A87E 18%, transparent)"
                        : "color-mix(in srgb, var(--muted-foreground) 12%, transparent)",
                      color: enabled ? "#C7A87E" : "var(--muted-foreground)",
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{
                        background: enabled ? "#C7A87E" : "var(--muted-foreground)",
                      }}
                    />
                    {enabled ? "Activo" : "Inactivo"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
