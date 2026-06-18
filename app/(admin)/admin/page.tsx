import { verifyAdmin } from "@/lib/dal";
import { PageMeta } from "@/components/admin/page-meta";

export const metadata = { title: "Dashboard – Zirel Admin" };

export default async function AdminPage() {
  await verifyAdmin();

  return (
    <>
      <PageMeta
        title="Dashboard"
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Pedidos pendientes" value="—" />
        <StatCard label="Productos activos" value="—" />
        <StatCard label="Categorías" value="—" />
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <p
        className="text-sm text-[var(--zirel-cafe-topo)]"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-3xl font-bold text-[var(--zirel-negro-suave)]"
        style={{ fontFamily: "var(--font-baskerville)" }}
      >
        {value}
      </p>
    </div>
  );
}
