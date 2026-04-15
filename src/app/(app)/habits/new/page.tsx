import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HabitForm } from "@/features/habits/components/habit-form";

export const metadata = {
  title: "Nuevo hábito — Constantia",
};

export default function NewHabitPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl text-parchment-500 hover:text-parchment-950 hover:bg-parchment-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-parchment-950">Nuevo hábito</h1>
          <p className="text-sm text-parchment-500">Empezá con algo pequeño</p>
        </div>
      </div>

      <HabitForm mode="create" />
    </div>
  );
}
