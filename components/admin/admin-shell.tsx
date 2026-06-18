"use client";

import { useAdminUIStore } from "@/lib/admin-ui-store";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const theme = useAdminUIStore((s) => s.theme);

  return (
    <div
      className="flex min-h-screen bg-[var(--zirel-marfil)]"
      data-admin-theme={theme}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
