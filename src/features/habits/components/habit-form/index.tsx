"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, type HabitInput } from "@/features/habits/schema";
import { createHabit, updateHabit } from "@/features/habits/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { NameDescriptionSection } from "./name-description-section";
import { IconColorSection } from "./icon-color-section";
import { FrequencySection } from "./frequency-section";
import { TimeSlotSection } from "./time-slot-section";
import { CategorySection } from "./category-section";
import { ReminderSection } from "./reminder-section";
import { TargetCountSection } from "./target-count-section";

interface HabitFormProps {
  mode: "create" | "edit";
  habitId?: string;
  defaultValues?: Partial<HabitInput>;
}

export function HabitForm({ mode, habitId, defaultValues }: HabitFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      color: "violet",
      icon: "star",
      frequency: "daily",
      targetCount: 1,
      category: "general",
      sportType: undefined,
      ...defaultValues,
    },
  });

  async function onSubmit(data: HabitInput) {
    setIsLoading(true);
    try {
      if (mode === "create") {
        const result = await createHabit(data);
        toast.success("¡Hábito creado! Empezá hoy.");
        router.push(`/habits/${result.id}`);
      } else if (habitId) {
        await updateHabit(habitId, data);
        toast.success("Hábito actualizado.");
        router.push(`/habits/${habitId}`);
      }
      router.refresh();
    } catch {
      toast.error("Algo salió mal. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <NameDescriptionSection />
        <IconColorSection />
        <FrequencySection />
        <TimeSlotSection />
        <CategorySection />
        <ReminderSection />
        <TargetCountSection />

        <Button
          type="submit"
          variant="brand"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          {mode === "create" ? "Crear hábito" : "Guardar cambios"}
        </Button>
      </form>
    </FormProvider>
  );
}
