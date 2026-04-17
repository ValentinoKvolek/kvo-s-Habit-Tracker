"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createTaskList } from "@/features/tasks/actions";

const LIST_COLORS = [
  { id: "sienna", hex: "#8b4513" },
  { id: "teal", hex: "#3d8c7a" },
  { id: "indigo", hex: "#5a6faa" },
  { id: "rose", hex: "#a85860" },
  { id: "amber", hex: "#b07a30" },
  { id: "slate", hex: "#6b7280" },
];

interface NewListFormProps {
  onCreated: (id: string, name: string, color: string) => void;
}

export function NewListForm({ onCreated }: NewListFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("sienna");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      try {
        const result = await createTaskList(name.trim(), color);
        onCreated(result.id, name.trim(), color);
        setName("");
        setColor("sienna");
        setOpen(false);
      } catch {
        toast.error("No se pudo crear la lista.");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-parchment-500 hover:text-parchment-800 transition-colors py-1 px-2 rounded-lg hover:bg-parchment-200"
      >
        <Plus size={13} />
        Nueva lista
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-parchment-200 border border-parchment-300 rounded-xl px-3 py-2">
      <div className="flex gap-1">
        {LIST_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setColor(c.id)}
            className="w-4 h-4 rounded-full transition-transform"
            style={{
              backgroundColor: c.hex,
              transform: color === c.id ? "scale(1.3)" : "scale(1)",
              outline: color === c.id ? `2px solid ${c.hex}` : "none",
              outlineOffset: "2px",
            }}
          />
        ))}
      </div>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la lista..."
        className="flex-1 text-sm bg-transparent outline-none text-parchment-950 placeholder:text-parchment-400 min-w-0"
      />
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="text-xs font-medium text-sienna-700 hover:text-sienna-900 disabled:opacity-40 transition-colors"
      >
        Crear
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-parchment-400 hover:text-parchment-700">
        <X size={14} />
      </button>
    </form>
  );
}

export { LIST_COLORS };
