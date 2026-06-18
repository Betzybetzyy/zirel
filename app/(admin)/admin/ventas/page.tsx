import { verifyAdmin } from "@/lib/dal";
import { PageMeta } from "@/components/admin/page-meta";

export const metadata = { title: "Ventas – Zirel Admin" };

export default async function VentasPage() {
  await verifyAdmin();

  return (
    <>
      <PageMeta
        title="Ventas"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Ventas" },
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
