import { verifyAdmin } from "@/lib/dal";
import { PageMeta } from "@/components/admin/page-meta";

export const metadata = { title: "Configuración – Zirel Admin" };

export default async function ConfiguracionPage() {
  await verifyAdmin();

  return (
    <>
      <PageMeta
        title="Configuración"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Configuración" },
        ]}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
        <p
          className="text-sm text-[var(--zirel-cafe-topo)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Sección en construcción
        </p>
      </div>
    </>
  );
}
