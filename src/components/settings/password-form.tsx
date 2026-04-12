"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
  newPassword: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});
type PasswordInput = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  async function onSubmit(data: PasswordInput) {
    setIsLoading(true);
    try {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });
      if (result.error) {
        toast.error(result.error.message ?? "No se pudo cambiar la contraseña.");
      } else {
        toast.success("Contraseña actualizada.");
        reset();
      }
    } catch {
      toast.error("Algo salió mal. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        label="Contraseña actual"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <Input
        label="Nueva contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Mínimo 8 caracteres, 1 mayúscula y 1 número"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        label="Confirmá la nueva contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" variant="default" size="sm" isLoading={isLoading} className="self-end">
        Cambiar contraseña
      </Button>
    </form>
  );
}
