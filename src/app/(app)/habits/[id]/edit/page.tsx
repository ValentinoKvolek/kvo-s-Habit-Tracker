import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getHabitById } from "@/lib/queries/habit.queries";
import { HabitForm } from "@/components/habits/habit-form";
import { DeleteHabitButton } from "@/components/habits/delete-habit-button";
import type { HabitColor, HabitIcon } from "@/lib/db/schema";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHabitPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const habit = await getHabitById(id, session.user.id);
  if (!habit) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/habits/${id}`}
          className="p-2 rounded-xl text-parchment-500 hover:text-parchment-950 hover:bg-parchment-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-parchment-950">Editar hábito</h1>
          <p className="text-sm text-parchment-500">{habit.name}</p>
        </div>
      </div>

      <HabitForm
        mode="edit"
        habitId={id}
        defaultValues={{
          name: habit.name,
          description: habit.description ?? undefined,
          icon: habit.icon as HabitIcon,
          color: habit.color as HabitColor,
          frequency: habit.frequency as "daily" | "weekly" | "monthly" | "custom",
          targetCount: habit.targetCount,
        }}
      />

      {/* Danger zone */}
      <div className="mt-10 pt-6 border-t border-parchment-300">
        <h3 className="text-sm font-medium text-parchment-500 mb-4">Zona de peligro</h3>
        <DeleteHabitButton habitId={id} habitName={habit.name} />
      </div>
    </div>
  );
}
