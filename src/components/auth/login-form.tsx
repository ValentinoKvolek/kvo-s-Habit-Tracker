"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";
import { signIn } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(
          result.error.message ?? "Error al iniciar sesión. Verificá tus credenciales."
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="brand"
        size="lg"
        isLoading={isLoading}
        className="mt-2 w-full"
      >
        Iniciar sesión
      </Button>

      <p className="text-center text-sm font-sans text-parchment-500">
        ¿No tenés cuenta?{" "}
        <Link
          href="/register"
          className="text-sienna-700 hover:text-sienna-900 transition-colors underline underline-offset-2"
        >
          Registrate gratis
        </Link>
      </p>
    </form>
  );
}
