"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Plus, Settings, ClipboardList, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/tasks", label: "Tareas", icon: ClipboardList },
  { href: "/habits/new", label: "Nuevo", icon: Plus, isAction: true },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-parchment-200/95 dark:bg-[#231c16]/95 backdrop-blur-xl border-t border-parchment-300 pb-safe">
      <div className="flex items-center justify-around h-16 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon, isAction }) => {
          const isActive = pathname.startsWith(href) && !isAction;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-150",
                isAction
                  ? "text-parchment-950"
                  : isActive
                  ? "text-sienna-700"
                  : "text-parchment-500 hover:text-parchment-800"
              )}
            >
              {isAction ? (
                <div className="w-11 h-11 rounded-2xl bg-parchment-950 dark:bg-parchment-100 flex items-center justify-center shadow-md -mt-4">
                  <Icon size={20} className="text-parchment-100 dark:text-parchment-950" />
                </div>
              ) : (
                <>
                  <Icon size={20} />
                  <span className="text-[10px] font-sans font-medium">{label}</span>
                </>
              )}
            </Link>
          );
        })}

        <button
          onClick={handleSignOut}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-parchment-500 hover:text-parchment-800 transition-all duration-150"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-sans font-medium">Salir</span>
        </button>
      </div>
    </nav>
  );
}
