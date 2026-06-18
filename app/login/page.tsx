import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin – Zirel Joyería" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/admin" } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--zirel-marfil)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Zirel" width={120} height={55} priority />
          <h1
            className="text-xl font-bold text-[var(--zirel-negro-suave)]"
            style={{ fontFamily: "var(--font-baskerville)" }}
          >
            Panel de administración
          </h1>
        </div>

        <div className="rounded-xl border border-[var(--zirel-arena)] bg-white p-6 shadow-sm">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
