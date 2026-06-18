import { verifyAdmin } from "@/lib/dal";
import { PageMeta } from "@/components/admin/page-meta";

export const metadata = { title: "Productos – Zirel Admin" };

export default async function ProductosPage() {
  await verifyAdmin();

  return (
    <>
      <PageMeta
        title="Productos"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Productos" },
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
