"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/features/auth/schema";
import { signUp } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(
          result.error.message ?? "Error al crear la cuenta."
        );
      } else {
        router.push("/dashboard");
        router.refresh();
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
        label="Nombre"
        type="text"
        placeholder="Tu nombre"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Mínimo 8 caracteres, 1 mayúscula y 1 número"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirmá tu contraseña"
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
        Crear cuenta gratis
      </Button>

      <p className="text-center text-sm font-sans text-parchment-500">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/login"
          className="text-sienna-700 hover:text-sienna-900 transition-colors underline underline-offset-2"
        >
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
