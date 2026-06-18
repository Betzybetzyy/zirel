"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, Sun, Moon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/lib/admin-nav";
import { useAdminUIStore } from "@/lib/admin-ui-store";
import { logout } from "@/app/actions/auth";

type Props = {
  userEmail: string;
  userRole: string;
};

export function AdminSidebar({ userEmail, userRole }: Props) {
  const pathname = usePathname();
  const collapsed = useAdminUIStore((s) => s.collapsed);
  const toggleCollapsed = useAdminUIStore((s) => s.toggleCollapsed);
  const theme = useAdminUIStore((s) => s.theme);
  const toggleTheme = useAdminUIStore((s) => s.toggleTheme);

  useEffect(() => {
    useAdminUIStore.persist.rehydrate();
  }, []);

  const initial = userEmail.charAt(0).toUpperCase();
  const isDark = theme === "dark";

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-200 ease-in-out overflow-hidden",
        "bg-[var(--admin-sidebar-bg)] border-r border-[var(--admin-sidebar-border)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header — h-16 matches navbar height */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-[var(--admin-sidebar-border)] flex-shrink-0",
          collapsed ? "justify-center px-3" : "justify-between px-4"
        )}
      >
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt="Zirel"
              width={68}
              height={32}
              className={isDark ? "brightness-0 invert opacity-85" : "opacity-90"}
            />
            <span
              className="text-[10px] font-medium text-[var(--admin-sidebar-dim)] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Admin
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" title="Dashboard">
            <Image
              src="/logo.png"
              alt="Zirel"
              width={28}
              height={13}
              className={isDark ? "brightness-0 invert opacity-85" : "opacity-90"}
            />
          </Link>
        )}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="flex-shrink-0 rounded-md p-1.5 text-[var(--admin-sidebar-dim)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-sidebar-text)] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 border-l-2",
                active
                  ? "bg-[var(--admin-sidebar-active-bg)] text-[var(--admin-sidebar-active-text)] border-[var(--zirel-dorado-beige)]"
                  : "text-[var(--admin-sidebar-dim)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-sidebar-text)] border-transparent",
                collapsed && "justify-center"
              )}
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate text-[13px] tracking-wide">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-[var(--admin-sidebar-border)] p-3">
        <div
          className={cn(
            "flex items-center gap-2.5 mb-2",
            collapsed && "justify-center"
          )}
        >
          <div
            className="h-7 w-7 flex-shrink-0 rounded-full bg-[var(--zirel-dorado-beige)] flex items-center justify-center"
            title={collapsed ? userEmail : undefined}
          >
            <span
              className="text-[11px] font-semibold text-white"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {initial}
            </span>
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-medium text-[var(--admin-sidebar-text)] leading-tight"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {userEmail}
              </p>
              <p
                className="text-[10px] text-[var(--admin-sidebar-dim)] uppercase tracking-wider leading-tight mt-0.5"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {userRole}
              </p>
            </div>
          )}
        </div>

        {/* Ver tienda */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Ver tienda"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[var(--admin-sidebar-dim)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-sidebar-text)] transition-colors mb-0.5",
            collapsed && "justify-center"
          )}
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
          {!collapsed && <span>Ver tienda</span>}
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Modo claro" : "Modo oscuro"}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[var(--admin-sidebar-dim)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-sidebar-text)] transition-colors mb-0.5",
            collapsed && "justify-center"
          )}
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {isDark ? (
            <Sun className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <Moon className="h-3.5 w-3.5 flex-shrink-0" />
          )}
          {!collapsed && (
            <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
          )}
        </button>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            title={collapsed ? "Cerrar sesión" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[var(--admin-sidebar-dim)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-sidebar-text)] transition-colors",
              collapsed && "justify-center"
            )}
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
