import { verifyAdmin } from "@/lib/dal"
import { PageMeta } from "@/components/admin/page-meta"
import { ClienteForm } from "@/components/admin/cliente-form"

export const metadata = { title: "Nuevo cliente – Zirel Admin" }

export default async function NuevoClientePage() {
  await verifyAdmin()

  return (
    <>
      <PageMeta
        title="Nuevo cliente"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Clientes", href: "/admin/clientes" },
          { label: "Nuevo cliente" },
        ]}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h2
            className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Registrar cliente
          </h2>
        </div>
        <div className="p-6">
          <ClienteForm />
        </div>
      </div>
    </>
  )
}
