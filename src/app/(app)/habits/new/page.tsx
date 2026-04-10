import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HabitForm } from "@/components/habits/habit-form";

export const metadata = {
  title: "Nuevo hábito — Momentum",
};

export default function NewHabitPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Nuevo hábito</h1>
          <p className="text-sm text-white/40">Empezá con algo pequeño</p>
        </div>
      </div>

      <HabitForm mode="create" />
    </div>
  );
}
