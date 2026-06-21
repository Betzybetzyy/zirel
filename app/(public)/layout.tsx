import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { getFeatureFlags } from "@/lib/queries";
import { PublicShell } from "@/components/ui/public-shell";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = await getFeatureFlags();

  return (
    <PublicShell>
      <Header cartEnabled={flags.cart} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </PublicShell>
  );
}
