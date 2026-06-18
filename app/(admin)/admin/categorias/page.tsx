import { verifyAdmin } from "@/lib/dal";
import { PageMeta } from "@/components/admin/page-meta";

export const metadata = { title: "Categorías – Zirel Admin" };

export default async function CategoriasPage() {
  await verifyAdmin();

  return (
    <>
      <PageMeta
        title="Categorías"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categorías" },
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
