import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata = {
  title: "Ajustes — Momentum",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Ajustes</h1>
        <p className="text-sm text-white/40 mt-1">Tu cuenta y preferencias</p>
      </div>

      {/* Profile card */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-violet-300">
              {session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-white">{session.user.name}</p>
            <p className="text-sm text-white/40">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-4">
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
          Sobre Momentum
        </h3>
        <div className="flex flex-col gap-2 text-sm text-white/60">
          <p>Open source · Gratis para siempre</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Ver código en GitHub →
          </a>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
          Sesión
        </h3>
        <SignOutButton />
      </div>
    </div>
  );
}
