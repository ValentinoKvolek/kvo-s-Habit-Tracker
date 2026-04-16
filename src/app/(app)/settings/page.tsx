import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata = {
  title: "Ajustes — Constantia",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-lg">
      {/* Identity */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-11 h-11 rounded-full bg-sienna-100 border border-sienna-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-sienna-700">{initials}</span>
        </div>
        <div>
          <p className="font-serif font-semibold text-parchment-950">{session.user.name}</p>
          <p className="text-sm text-parchment-500">{session.user.email}</p>
        </div>
      </div>

      {/* Nombre */}
      <section className="py-7 border-t border-parchment-300">
        <p className="text-xs font-medium uppercase tracking-widest text-parchment-400 mb-5">
          Nombre
        </p>
        <ProfileForm currentName={session.user.name} />
      </section>

      {/* Contraseña */}
      <section className="py-7 border-t border-parchment-300">
        <p className="text-xs font-medium uppercase tracking-widest text-parchment-400 mb-5">
          Contraseña
        </p>
        <PasswordForm />
      </section>

      {/* Apariencia */}
      <section className="py-7 border-t border-parchment-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-parchment-950">Apariencia</p>
            <p className="text-xs text-parchment-500 mt-0.5">
              Seguí el sistema o elegí manualmente
            </p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Sesión */}
      <section className="py-7 border-t border-parchment-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-parchment-950">Sesión activa</p>
            <p className="text-xs text-parchment-500 mt-0.5">{session.user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-parchment-300 pt-6 pb-8">
        <p className="text-xs text-parchment-400">
          Constantia · Open source ·{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sienna-700 transition-colors"
          >
            GitHub ↗
          </a>
        </p>
      </div>
    </div>
  );
}
