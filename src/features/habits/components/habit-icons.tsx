import {
  Book,
  Dumbbell,
  Heart,
  Droplets,
  Moon,
  Sun,
  Brain,
  Music,
  Code,
  Pen,
  PersonStanding,
  Salad,
  PiggyBank,
  Star,
} from "lucide-react";
import type { HabitIcon } from "@/db/schema";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  book: Book,
  dumbbell: Dumbbell,
  heart: Heart,
  droplets: Droplets,
  moon: Moon,
  sun: Sun,
  brain: Brain,
  music: Music,
  code: Code,
  pen: Pen,
  running: PersonStanding,
  salad: Salad,
  "piggy-bank": PiggyBank,
  star: Star,
};

interface HabitIconsProps {
  icon: string;
  color?: string;
  size?: number;
  className?: string;
}

export function HabitIcons({ icon, color, size = 20, className }: HabitIconsProps) {
  const Icon = ICON_MAP[icon] ?? Star;
  return <Icon size={size} color={color} className={className} />;
}

export const ICON_OPTIONS = Object.keys(ICON_MAP) as HabitIcon[];
