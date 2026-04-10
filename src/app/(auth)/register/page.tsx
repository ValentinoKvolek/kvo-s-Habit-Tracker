import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Crear cuenta — Momentum",
};

export default function RegisterPage() {
  return (
    <>
      <h2 className="font-serif font-bold text-parchment-950 text-lg mb-1">Empezá hoy</h2>
      <p className="font-sans text-sm text-parchment-500 mb-6">
        Gratis, open source, sin paywalls.
      </p>
      <RegisterForm />
    </>
  );
}
