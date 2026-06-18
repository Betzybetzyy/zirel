"use client"

import { usePathname } from "next/navigation"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { useAdminUIStore } from "@/lib/admin-ui-store"

const Toaster = ({ ...props }: ToasterProps) => {
  const pathname = usePathname()
  const adminTheme = useAdminUIStore((s) => s.theme)

  const dark = pathname.startsWith("/admin") && adminTheme === "dark"

  return (
    <Sonner
      theme={dark ? "dark" : "light"}
      className="zirel-toast"
      closeButton
      position="top-center"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
