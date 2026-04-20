"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Plus, TrendingUp } from "lucide-react";
import { HABIT_COLOR_MAP } from "@/lib/colors";
import { getVirtusRank, getVirtusColor, VIRTUS_MAX } from "@/features/entries/logic";
import type { HabitColor } from "@/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HabitOverviewItem = {
  id: string;
  name: string;
  color: string;
  category: string;
  currentStreak: number;
  virtusScore: number;
  isCompletedToday: boolean;
  weekCompletion: boolean[];
};

type Props = {
  habits: HabitOverviewItem[];
  completedToday: number;
  totalToday: number;
  last7Days: string[];
  userName: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CAT_LABELS: Record<string, string> = {
  general: "General",
  sport: "Deporte",
  study: "Estudio",
  health: "Salud",
};
const CAT_COLORS: Record<string, string> = {
  general: "#8b4513",
  sport: "#b07a30",
  study: "#5a6faa",
  health: "#a85860",
};
const DAY_SHORT = ["L", "M", "X", "J", "V", "S", "D"];

function getColor(color: string): string {
  return HABIT_COLOR_MAP[color as HabitColor]?.hex ?? "#8b4513";
}

// ─── Today ring ───────────────────────────────────────────────────────────────

function TodayRing({ pct, done, total }: { pct: number; done: number; total: number }) {
  const S = 120, sw = 9, r = (S - sw) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: S, height: S }}>
      <svg width={S} height={S} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={S / 2} cy={S / 2} r={r} fill="none"
          stroke="rgba(139,69,19,0.10)" strokeWidth={sw} />
        <motion.circle
          cx={S / 2} cy={S / 2} r={r} fill="none"
          stroke={pct === 100 ? "#4a8c5c" : "#8b4513"}
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <motion.span
          className="text-2xl font-serif font-bold text-parchment-950 dark:text-parchment-50 leading-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
        >
          {pct}%
        </motion.span>
        <span className="text-[10px] text-parchment-500 dark:text-parchment-400 leading-none">
          {done}/{total}
        </span>
      </div>
    </div>
  );
}

// ─── Virtus badge ─────────────────────────────────────────────────────────────

function VirtusBadge({ score }: { score: number }) {
  const color = getVirtusColor(score);
  const S = 34, sw = 3, r = (S - sw) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (score / VIRTUS_MAX) * circ;
  const label = score >= 1000 ? "MAX" : String(score);
  const fontSize = label.length >= 4 ? "6px" : "7px";
  return (
    <div className="relative flex-shrink-0" style={{ width: S, height: S }} title={`Virtus: ${score}/1000`}>
      <svg width={S} height={S} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={S / 2} cy={S / 2} r={r} fill="none"
          stroke="rgba(139,69,19,0.10)" strokeWidth={sw} />
        <circle cx={S / 2} cy={S / 2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold leading-none" style={{ color, fontSize }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Week dots ────────────────────────────────────────────────────────────────

function WeekDots({ completion, color }: { completion: boolean[]; color: string }) {
  return (
    <div className="flex items-center gap-[3px]">
      {completion.map((done, i) => (
        <div
          key={i}
          className="rounded-[3px] transition-all"
          title={DAY_SHORT[i]}
          style={{
            width: 13, height: 13,
            backgroundColor: done ? color : "transparent",
            border: `1.5px solid ${done ? color : "rgba(120,100,80,0.2)"}`,
            opacity: 0.7 + i * 0.043,
          }}
        />
      ))}
    </div>
  );
}

// ─── Category donut ───────────────────────────────────────────────────────────

function CategoryDonut({ habits }: { habits: HabitOverviewItem[] }) {
  const cats = ["general", "sport", "study", "health"];
  const counts = cats.map((c) => habits.filter((h) => h.category === c).length);
  const total = habits.length || 1;
  const S = 96, cx = S / 2, cy = S / 2, r = 36, ir = 22;

  let cum = 0;
  const segs = counts.map((cnt, i) => {
    if (cnt === 0) return null;
    const pct = cnt / total;
    const a0 = cum * 2 * Math.PI - Math.PI / 2;
    const a1 = (cum + pct) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const la = pct > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a1), yi0 = cy + ir * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a0), yi1 = cy + ir * Math.sin(a0);
    const d = `M${x0} ${y0} A${r} ${r} 0 ${la} 1 ${x1} ${y1} L${xi0} ${yi0} A${ir} ${ir} 0 ${la} 0 ${xi1} ${yi1}Z`;
    return { d, color: CAT_COLORS[cats[i]], label: CAT_LABELS[cats[i]], cnt };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={S} height={S} className="flex-shrink-0">
        {segs.map((s, i) => s && (
          <path key={i} d={s.d} fill={s.color} opacity={0.82} />
        ))}
        <text x={cx} y={cy - 3} textAnchor="middle" fill="currentColor"
          className="fill-parchment-950 dark:fill-parchment-50"
          fontSize={13} fontFamily="var(--font-serif)" fontWeight="700">{habits.length}</text>
        <text x={cx} y={cy + 10} textAnchor="middle"
          className="fill-parchment-500 dark:fill-parchment-300"
          fontSize={7} fontFamily="var(--font-sans)">hábitos</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1">
        {segs.map((s, i) => s && (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-parchment-600 dark:text-parchment-200 flex-1">{s.label}</span>
            <span className="text-xs font-medium text-parchment-400 dark:text-parchment-300">{s.cnt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Week bars ────────────────────────────────────────────────────────────────

function WeekBars({ habits }: { habits: HabitOverviewItem[] }) {
  const maxH = 52, bW = 20, gap = 5, total = habits.length || 1;
  const bars = habits[0]?.weekCompletion.map((_, di) =>
    (habits.filter((h) => h.weekCompletion[di]).length / total) * 100
  ) ?? Array(7).fill(0);

  return (
    <svg width={(bW + gap) * 7 - gap} height={maxH + 18} className="overflow-visible">
      {bars.map((pct, i) => {
        const h = Math.max(3, (pct / 100) * maxH);
        const x = i * (bW + gap), y = maxH - h;
        const isToday = i === 6;
        return (
          <g key={i}>
            <rect x={x} y={0} width={bW} height={maxH} fill="rgba(139,69,19,0.06)" rx={3} />
            <motion.rect
              x={x} width={bW}
              fill={isToday ? "#8b4513" : "rgba(139,69,19,0.35)"} rx={3}
              initial={{ height: 0, y: maxH }}
              animate={{ height: h, y }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: "easeOut" }}
            />
            <text x={x + bW / 2} y={maxH + 13} textAnchor="middle" fontSize={8}
              fill={isToday ? "#8b4513" : "rgba(120,100,80,0.5)"}
              fontWeight={isToday ? "700" : "400"}
              fontFamily="var(--font-sans)">
              {DAY_SHORT[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HabitsOverview({ habits, completedToday, totalToday, userName }: Props) {
  const pct = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);
  const allDone = totalToday > 0 && completedToday === totalToday;
  const topVirtus = [...habits]
    .filter((h) => h.virtusScore > 0)
    .sort((a, b) => b.virtusScore - a.virtusScore)
    .slice(0, 3);

  return (
    <div className="relative pb-8">

      {/* ── HERO ── */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="flex items-center gap-6 mb-10 px-1"
      >
        <TodayRing pct={pct} done={completedToday} total={totalToday} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-300 mb-1">
            Hoy
          </p>
          <h1 className="text-xl font-serif font-bold text-parchment-950 dark:text-parchment-50 leading-tight mb-1.5">
            {allDone ? "Virtud consumada ✦" : `Hola, ${userName}`}
          </h1>
          <p className="text-xs text-parchment-500 dark:text-parchment-300 mb-4 leading-relaxed">
            {allDone
              ? "Completaste todos los hábitos de hoy."
              : totalToday === 0
              ? "Crea tu primer hábito y empieza a construir tu carácter."
              : `${completedToday} de ${totalToday} completados. Quedan ${totalToday - completedToday}.`}
          </p>
          <Link
            href="/habits/new"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-parchment-950 dark:bg-parchment-100 text-parchment-100 dark:text-parchment-950 hover:opacity-80 transition-opacity"
          >
            <Plus size={12} /> Nuevo hábito
          </Link>
        </div>
      </motion.section>


      {/* ── HABIT LIST ── */}
      {habits.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-300">
              Tus Hábitos
            </h2>
            <span className="text-[10px] text-parchment-400 dark:text-parchment-300">← 7 días</span>
          </div>
          <div className="flex flex-col gap-2">
            {habits.map((h, i) => {
              const color = getColor(h.color);
              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, duration: 0.35 }}
                >
                  <Link
                    href={`/habits/${h.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-parchment-100 dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 hover:bg-parchment-200 dark:hover:bg-parchment-800 hover:border-parchment-300 dark:hover:border-parchment-600 transition-all group"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-parchment-900 dark:text-parchment-50 truncate">
                          {h.name}
                        </span>
                        {h.virtusScore > 0 && <VirtusBadge score={h.virtusScore} />}
                      </div>
                      <WeekDots completion={h.weekCompletion} color={color} />
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                      style={{
                        border: `2px solid ${color}`,
                        backgroundColor: h.isCompletedToday ? color : "transparent",
                      }}
                    >
                      {h.isCompletedToday && (
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5L3.5 6.5L7.5 2" stroke="white" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <p className="text-sm text-parchment-500 dark:text-parchment-400 max-w-xs leading-relaxed">
            Ningún hábito aún. Comienza con uno pequeño — la constancia lo construirá todo.
          </p>
          <Link
            href="/habits/new"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-parchment-950 dark:bg-parchment-100 text-parchment-100 dark:text-parchment-950 hover:opacity-80 transition-opacity"
          >
            <Plus size={13} /> Crear primer hábito
          </Link>
        </motion.div>
      )}

      {/* ── STATS ── */}
      {habits.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
        >
          <div className="rounded-2xl bg-parchment-100 dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 p-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-300 mb-4">
              Por categoría
            </h3>
            <CategoryDonut habits={habits} />
          </div>
          <div className="rounded-2xl bg-parchment-100 dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 p-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-300 mb-4">
              Completados · 7 días
            </h3>
            <WeekBars habits={habits} />
          </div>
        </motion.section>
      )}

      {/* ── TOP VIRTUS ── */}
      {topVirtus.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45 }}
          className="rounded-2xl bg-gradient-to-br from-parchment-200/80 dark:from-parchment-800/80 to-parchment-100 dark:to-parchment-900 border border-parchment-300 dark:border-parchment-700 p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={12} className="text-parchment-400 dark:text-parchment-500" />
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-500">
              Virtus
            </h3>
          </div>
          <p className="text-[9px] text-parchment-400 dark:text-parchment-500 mb-4 leading-relaxed">
            Puntuación de consistencia 0–100. Un día perdido reduce el score sin reiniciarlo.
          </p>
          <div className="flex flex-col gap-3">
            {topVirtus.map((h, i) => {
              const color = getColor(h.color);
              const rankColors = ["#b07a30", "#8d7a62", "#6b5c48"];
              const vc = getVirtusColor(h.virtusScore);
              const rank = getVirtusRank(h.virtusScore);
              return (
                <Link key={h.id} href={`/habits/${h.id}`} className="flex items-center gap-3 group">
                  <span className="text-[11px] font-bold w-5 flex-shrink-0 text-center" style={{ color: rankColors[i] }}>{i + 1}</span>
                  <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm text-parchment-800 dark:text-parchment-100 truncate group-hover:text-parchment-950 dark:group-hover:text-parchment-50 transition-colors">
                      {h.name}
                    </span>
                    <span className="block text-[9px] italic truncate" style={{ color: vc }}>
                      {rank.philosopher}
                    </span>
                  </div>
                  <VirtusBadge score={h.virtusScore} />
                </Link>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}
