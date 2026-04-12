"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(60, "Máximo 60 caracteres"),
});
type ProfileInput = z.infer<typeof profileSchema>;

export function ProfileForm({ currentName }: { currentName: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentName },
  });

  async function onSubmit(data: ProfileInput) {
    if (data.name === currentName) return;
    setIsLoading(true);
    try {
      const result = await authClient.updateUser({ name: data.name });
      if (result.error) {
        toast.error(result.error.message ?? "No se pudo actualizar el nombre.");
      } else {
        toast.success("Nombre actualizado.");
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
        label="Nombre"
        placeholder="Tu nombre"
        error={errors.name?.message}
        {...register("name")}
      />
      <Button type="submit" variant="default" size="sm" isLoading={isLoading} className="self-end">
        Guardar
      </Button>
    </form>
  );
}
