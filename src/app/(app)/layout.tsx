import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      {/* Main content — offset for sidebar on desktop */}
      <main className="md:pl-56 pb-36 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
