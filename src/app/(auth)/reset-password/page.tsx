import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Nueva contraseña — Constantia",
};

export default function ResetPasswordPage() {
  return (
    <>
      <h2 className="font-serif font-bold text-parchment-950 text-lg mb-1">Nueva contraseña</h2>
      <p className="font-sans text-sm text-parchment-500 mb-6">
        Elegí una contraseña segura para tu cuenta.
      </p>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
