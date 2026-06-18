import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { getFeatureFlags } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = await getFeatureFlags();

  return (
    <>
      <Header cartEnabled={flags.cart} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
