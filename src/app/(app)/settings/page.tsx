import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";

export const metadata = {
  title: "Ajustes — Constantia",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-parchment-950">Ajustes</h1>
        <p className="text-sm text-parchment-500 mt-1">Tu cuenta y preferencias</p>
      </div>

      {/* Profile card */}
      <div className="bg-parchment-200 border border-parchment-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-sienna-100 border border-sienna-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-sienna-700">
              {session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-parchment-950">{session.user.name}</p>
            <p className="text-sm text-parchment-500">{session.user.email}</p>
          </div>
        </div>
        <div className="border-t border-parchment-300 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-parchment-500 mb-3">
            Cambiar nombre
          </h3>
          <ProfileForm currentName={session.user.name} />
        </div>
      </div>

      {/* Password section */}
      <div className="bg-parchment-200 border border-parchment-300 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-4">
          Contraseña
        </h3>
        <PasswordForm />
      </div>

      {/* About section */}
      <div className="bg-parchment-200 border border-parchment-300 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-3">
          Sobre Constantia
        </h3>
        <div className="flex flex-col gap-2 text-sm text-parchment-600">
          <p>Open source · Gratis para siempre</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sienna-700 hover:text-sienna-800 transition-colors"
          >
            Ver código en GitHub →
          </a>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-parchment-200 border border-parchment-300 rounded-xl p-5">
        <h3 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-3">
          Sesión
        </h3>
        <SignOutButton />
      </div>
    </div>
  );
}
