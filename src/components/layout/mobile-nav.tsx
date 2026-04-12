"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Settings, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/tasks", label: "Tareas", icon: ClipboardList },
  { href: "/habits/new", label: "Nuevo", icon: Plus, isAction: true },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-parchment-200/95 backdrop-blur-xl border-t border-parchment-300 pb-safe">
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
                <div className="w-11 h-11 rounded-2xl bg-parchment-950 flex items-center justify-center shadow-md -mt-4">
                  <Icon size={20} className="text-parchment-100" />
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
      </div>
    </nav>
  );
}
