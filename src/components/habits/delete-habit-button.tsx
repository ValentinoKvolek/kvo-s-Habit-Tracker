"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHabit, archiveHabit } from "@/lib/actions/habit.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteHabitButtonProps {
  habitId: string;
  habitName: string;
}

export function DeleteHabitButton({ habitId, habitName }: DeleteHabitButtonProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  async function handleArchive() {
    setIsArchiving(true);
    try {
      await archiveHabit(habitId);
      toast.success("Hábito archivado. Podés encontrarlo en ajustes.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("No se pudo archivar.");
    } finally {
      setIsArchiving(false);
      setShowDialog(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteHabit(habitId);
      toast.success("Hábito eliminado permanentemente.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar.");
    } finally {
      setIsDeleting(false);
      setShowDialog(false);
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDialog(true)}
        >
          Archivar
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDialog(true)}
        >
          Eliminar hábito
        </Button>
      </div>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title="¿Qué querés hacer?"
      >
        <p className="text-sm text-parchment-600 mb-5">
          <strong className="text-parchment-950">{habitName}</strong> —{" "}
          Archivar preserva tu historial. Eliminar borra todo permanentemente.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="md"
            isLoading={isArchiving}
            onClick={handleArchive}
            className="w-full"
          >
            Archivar (mantiene el historial)
          </Button>
          <Button
            variant="danger"
            size="md"
            isLoading={isDeleting}
            onClick={handleDelete}
            className="w-full"
          >
            Eliminar permanentemente
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowDialog(false)}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </Dialog>
    </>
  );
}
