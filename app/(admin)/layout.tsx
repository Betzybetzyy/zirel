import { verifyAdmin } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import Image from "next/image";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--zirel-marfil)]">
      <header className="border-b border-[var(--zirel-arena)] bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Zirel" width={80} height={37} />
            <span
              className="text-sm font-semibold text-[var(--zirel-cafe-topo)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Admin
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-[var(--zirel-cafe-topo)] hover:text-[var(--zirel-negro-suave)] transition-colors"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
