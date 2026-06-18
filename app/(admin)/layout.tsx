import { verifyAdmin } from "@/lib/dal";
import { getUserById } from "@/lib/queries";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdmin();
  const user = await getUserById(session.userId);

  return (
    <AdminShell>
      <AdminSidebar
        userEmail={user?.email ?? session.userId}
        userRole={user?.role ?? session.role}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </AdminShell>
  );
}
