"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleSignOut}
      isLoading={isLoading}
    >
      Cerrar sesión
    </Button>
  );
}
