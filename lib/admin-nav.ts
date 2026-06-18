import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];
