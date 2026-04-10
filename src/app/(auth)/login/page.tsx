import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Iniciar sesión — Momentum",
};

export default function LoginPage() {
  return (
    <>
      <h2 className="font-serif font-bold text-parchment-950 text-lg mb-1">Bienvenido de vuelta</h2>
      <p className="font-sans text-sm text-parchment-500 mb-6">
        Continuá con tus hábitos donde los dejaste.
      </p>
      <LoginForm />
    </>
  );
}
