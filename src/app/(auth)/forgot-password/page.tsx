import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata = {
  title: "Recuperar contraseña — Constantia",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="font-serif font-bold text-parchment-950 text-lg mb-1">¿Olvidaste tu contraseña?</h2>
      <p className="font-sans text-sm text-parchment-500 mb-6">
        Ingresá tu email y te enviaremos un enlace para restablecerla.
      </p>
      <ForgotPasswordForm />
    </>
  );
}
