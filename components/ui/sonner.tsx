"use client"

import { usePathname } from "next/navigation"
import { Toaster as SileoToaster } from "sileo"
import { useThemeStore } from "@/lib/theme-store"
import { useAdminUIStore } from "@/lib/admin-ui-store"

const darkOptions = {
  fill: "#171717",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
  },
}

const Toaster = () => {
  const pathname = usePathname()
  const publicTheme = useThemeStore((s) => s.theme)
  const adminTheme = useAdminUIStore((s) => s.theme)

  const isAdmin = pathname.startsWith("/admin")
  const isDark = isAdmin ? adminTheme === "dark" : publicTheme === "dark"

  return (
    <SileoToaster
      key={isDark ? "dark" : "light"}
      position="top-center"
      options={isDark ? darkOptions : undefined}
    />
  )
}

export { Toaster }
