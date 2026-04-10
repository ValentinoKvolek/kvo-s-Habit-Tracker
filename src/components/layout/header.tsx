import type { Session } from "@/lib/auth";

interface HeaderProps {
  session: Session;
  title?: string;
}

export function Header({ session, title }: HeaderProps) {
  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        {title && (
          <h1 className="text-xl font-bold text-white">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-violet-300">{initials}</span>
        </div>
      </div>
    </header>
  );
}
