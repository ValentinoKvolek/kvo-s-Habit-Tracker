"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, redirectTo: "/reset-password" }),
      });
      if (!res.ok) {
        toast.error("No pudimos procesar la solicitud. Intentá de nuevo.");
      } else {
        setSent(true);
      }
    } catch {
      toast.error("Algo salió mal. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="text-3xl">✉️</div>
        <p className="text-sm text-parchment-700 dark:text-parchment-300 leading-relaxed">
          Si esa dirección está registrada, recibirás un correo con el enlace para restablecer tu contraseña.
        </p>
        <p className="text-xs text-parchment-400">Revisá también tu carpeta de spam.</p>
        <Link
          href="/login"
          className="text-sm text-sienna-700 hover:text-sienna-900 transition-colors underline underline-offset-2"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Button
        type="submit"
        variant="brand"
        size="lg"
        isLoading={isLoading}
        className="mt-2 w-full"
      >
        Enviar enlace
      </Button>

      <p className="text-center text-sm font-sans text-parchment-500">
        <Link
          href="/login"
          className="text-sienna-700 hover:text-sienna-900 transition-colors underline underline-offset-2"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  );
}
