"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Flame, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Hábitos", icon: Flame },
  { href: "/tasks", label: "Tareas", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-parchment-200 border-r border-parchment-300 p-4 fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 mb-8 px-2">
        <img src="/logo.png" alt="Constantia" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <span className="font-serif font-bold text-parchment-950 text-sm tracking-wide">Constantia</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/habits"
            ? pathname.startsWith("/habits") || (pathname === "/dashboard" && false)
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm font-sans transition-all duration-150",
                isActive
                  ? "bg-parchment-300 text-parchment-950 font-medium"
                  : "text-parchment-600 hover:text-parchment-950 hover:bg-parchment-300/60"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: theme toggle + settings */}
      <div className="flex items-center justify-between mt-4 px-1">
        <ThemeToggle />
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 px-2 py-2 rounded-sm text-xs font-sans transition-all duration-150",
            pathname.startsWith("/settings")
              ? "text-parchment-950 bg-parchment-300"
              : "text-parchment-500 hover:text-parchment-800 hover:bg-parchment-300/60"
          )}
        >
          <Settings size={13} />
          Ajustes
        </Link>
      </div>
    </aside>
  );
}
