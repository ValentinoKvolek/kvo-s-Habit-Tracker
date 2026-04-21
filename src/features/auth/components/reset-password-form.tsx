"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-parchment-500">El enlace no es válido o ya expiró.</p>
        <Link
          href="/forgot-password"
          className="text-sm text-sienna-700 hover:text-sienna-900 transition-colors underline underline-offset-2"
        >
          Solicitar un nuevo enlace
        </Link>
      </div>
    );
  }

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: data.password, token }),
      });
      if (!res.ok) {
        toast.error("El enlace expiró o no es válido. Solicitá uno nuevo.");
      } else {
        toast.success("¡Contraseña actualizada! Ya podés iniciar sesión.");
        router.push("/login");
      }
    } catch {
      toast.error("Algo salió mal. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nueva contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirmá la contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        variant="brand"
        size="lg"
        isLoading={isLoading}
        className="mt-2 w-full"
      >
        Guardar nueva contraseña
      </Button>
    </form>
  );
}
