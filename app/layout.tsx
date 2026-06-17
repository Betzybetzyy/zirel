import type { Metadata } from "next";
import { Libre_Baskerville, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "sonner";

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zirel Joyería",
  description: "Joyería en oro, plata y enchapados. Lujo sutil, sofisticación y delicadeza.",
  openGraph: {
    title: "Zirel Joyería",
    description: "Joyería en oro, plata y enchapados. Lujo sutil, sofisticación y delicadeza.",
    siteName: "Zirel Joyería",
    locale: "es_CL",
    type: "website",
    images: [{ url: "/logo.png", width: 1100, height: 505, alt: "Zirel Joyería" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${baskerville.variable} ${nunito.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--zirel-marfil)",
              color: "var(--zirel-negro-suave)",
              border: "1px solid var(--zirel-arena)",
            },
          }}
        />
      </body>
    </html>
  );
}