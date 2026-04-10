"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits/new", label: "Nuevo hábito", icon: Plus },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-parchment-200 border-r border-parchment-300 p-4 fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-7 h-7 rounded-sm border border-parchment-400 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-sienna-700">
            <path d="M12 3L12 21M3 12L21 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-serif font-bold text-parchment-950 text-sm tracking-wide">Momentum</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm font-sans transition-all duration-150",
              pathname.startsWith(href) && href !== "/habits/new"
                ? "bg-parchment-300 text-parchment-950 font-medium"
                : "text-parchment-600 hover:text-parchment-950 hover:bg-parchment-300/60"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm font-sans text-parchment-500 hover:text-parchment-800 hover:bg-parchment-300/60 transition-all duration-150 mt-4"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </button>
    </aside>
  );
}
