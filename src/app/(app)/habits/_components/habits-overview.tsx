"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Flame, Plus, TrendingUp } from "lucide-react";
import { HABIT_COLOR_MAP } from "@/lib/colors";
import type { HabitColor } from "@/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HabitOverviewItem = {
  id: string;
  name: string;
  color: string;
  category: string;
  currentStreak: number;
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

// ─── Marble Bust ─────────────────────────────────────────────────────────────

function MarbleBust() {
  return (
    <div className="flex flex-col items-center select-none">
      <style>{`
        @keyframes bust-sway {
          0%,100% { transform: perspective(700px) rotateY(-10deg) rotateX(3deg); }
          50%      { transform: perspective(700px) rotateY(10deg)  rotateX(-2deg); }
        }
        @keyframes bust-glow {
          0%,100% { opacity: 0.18; }
          50%      { opacity: 0.32; }
        }
        .bust-sway { animation: bust-sway 9s ease-in-out infinite; transform-style: preserve-3d; }
        .bust-glow { animation: bust-glow 4s ease-in-out infinite; }
      `}</style>

      <div className="bust-sway">
        <svg viewBox="0 0 200 280" width="160" height="224" aria-hidden="true">
          <defs>
            <linearGradient id="mg-face" x1="25%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%"   stopColor="#f0ece4" />
              <stop offset="45%"  stopColor="#ddd5c8" />
              <stop offset="80%"  stopColor="#c8bfb0" />
              <stop offset="100%" stopColor="#b5aa9a" />
            </linearGradient>
            <linearGradient id="mg-body" x1="20%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%"   stopColor="#e8e0d4" />
              <stop offset="50%"  stopColor="#cfc5b5" />
              <stop offset="100%" stopColor="#b0a595" />
            </linearGradient>
            <linearGradient id="mg-plinth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#d5cdc0" />
              <stop offset="100%" stopColor="#a89f90" />
            </linearGradient>
            <linearGradient id="mg-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="white" stopOpacity="0.55" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="bust-drop" x="-20%" y="-10%" width="140%" height="140%">
              <feDropShadow dx="5" dy="10" stdDeviation="8"
                floodColor="#1c1510" floodOpacity="0.22" />
            </filter>
            <filter id="face-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="3" stdDeviation="3"
                floodColor="#1c1510" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* ── Plinth base ── */}
          <rect x="22" y="248" width="156" height="28" rx="3"
            fill="url(#mg-plinth)"
            style={{ filter: "drop-shadow(0 2px 5px rgba(28,21,16,0.25))" }} />
          <rect x="32" y="233" width="136" height="18" rx="2" fill="url(#mg-plinth)" />

          {/* ── Toga / torso ── */}
          <path d="M52,222 L47,233 L153,233 L148,222 L135,155 L65,155 Z"
            fill="url(#mg-body)" filter="url(#bust-drop)" />

          {/* Toga folds left */}
          <path d="M52,222 Q46,207 50,190 Q52,175 58,165 L65,155 L65,180 Q60,195 56,210 Z"
            fill="#b8ae9f" opacity="0.7" />
          {/* Toga folds right */}
          <path d="M148,222 Q154,207 150,190 Q148,175 142,165 L135,155 L135,180 Q140,195 144,210 Z"
            fill="#b8ae9f" opacity="0.7" />
          {/* Toga draped line */}
          <path d="M65,155 Q80,148 100,147 Q120,148 135,155" stroke="#a09080"
            strokeWidth="1.5" fill="none" opacity="0.5" />

          {/* ── Shoulders ── */}
          <path d="M43,190 Q33,178 38,160 L65,155 L65,195 Q55,193 43,190 Z"
            fill="url(#mg-body)" />
          <path d="M157,190 Q167,178 162,160 L135,155 L135,195 Q145,193 157,190 Z"
            fill="url(#mg-body)" />

          {/* ── Neck ── */}
          <rect x="88" y="118" width="24" height="40" rx="5"
            fill="url(#mg-face)" />

          {/* ── Head ── */}
          <ellipse cx="100" cy="86" rx="40" ry="46"
            fill="url(#mg-face)" filter="url(#face-shadow)" />

          {/* Hair */}
          <path d="M61,74 Q60,48 100,44 Q140,48 139,74 Q130,60 100,58 Q70,60 61,74 Z"
            fill="#c0b5a3" />
          {/* Laurel wreath hints */}
          <path d="M63,72 Q59,63 66,60 Q70,59 68,67" fill="#9a8c6a" opacity="0.45" />
          <path d="M72,63 Q70,54 77,52 Q81,51 79,60" fill="#9a8c6a" opacity="0.45" />
          <path d="M83,58 Q82,49 89,48 Q93,47 92,56" fill="#9a8c6a" opacity="0.35" />
          <path d="M137,72 Q141,63 134,60 Q130,59 132,67" fill="#9a8c6a" opacity="0.45" />
          <path d="M128,63 Q130,54 123,52 Q119,51 121,60" fill="#9a8c6a" opacity="0.45" />
          <path d="M117,58 Q118,49 111,48 Q107,47 108,56" fill="#9a8c6a" opacity="0.35" />

          {/* Eye sockets — subtle */}
          <ellipse cx="85"  cy="85" rx="8" ry="6" fill="#b8ae9e" opacity="0.38" />
          <ellipse cx="115" cy="85" rx="8" ry="6" fill="#b8ae9e" opacity="0.38" />
          {/* Pupils */}
          <ellipse cx="85"  cy="86" rx="3.5" ry="3" fill="#8c7d6a" opacity="0.55" />
          <ellipse cx="115" cy="86" rx="3.5" ry="3" fill="#8c7d6a" opacity="0.55" />

          {/* Nose */}
          <path d="M100,78 L97,99 Q100,102 103,99 L100,78"
            fill="#c2b8a8" stroke="#a89e8e" strokeWidth="0.5" />

          {/* Brow ridge */}
          <path d="M78,79 Q85,76 92,79" stroke="#a89e8e" strokeWidth="1.2"
            fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M108,79 Q115,76 122,79" stroke="#a89e8e" strokeWidth="1.2"
            fill="none" strokeLinecap="round" opacity="0.6" />

          {/* Mouth */}
          <path d="M92,108 Q100,112 108,108"
            stroke="#9e9080" strokeWidth="1.5" fill="none"
            strokeLinecap="round" opacity="0.6" />
          <path d="M95,108 Q100,105 105,108"
            stroke="#9e9080" strokeWidth="1" fill="none"
            strokeLinecap="round" opacity="0.4" />

          {/* ── Highlight gloss ── */}
          <ellipse cx="80" cy="68" rx="14" ry="18"
            fill="url(#mg-highlight)" className="bust-glow" />
          <ellipse cx="75" cy="170" rx="8" ry="20"
            fill="url(#mg-highlight)" opacity="0.2" />
        </svg>
      </div>

      {/* Label on plinth */}
      <div className="mt-1 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-parchment-500 dark:text-parchment-400">
          Marcus Aurelius
        </p>
        <p className="text-[9px] text-parchment-400 dark:text-parchment-500 tracking-wide">
          121–180 d.C.
        </p>
      </div>
    </div>
  );
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
          className="text-2xl font-serif font-bold text-parchment-950 dark:text-parchment-100 leading-none"
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
          fontSize={13} fontFamily="var(--font-serif)" fontWeight="700">{habits.length}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="currentColor"
          fontSize={7} opacity={0.5} fontFamily="var(--font-sans)">hábitos</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1">
        {segs.map((s, i) => s && (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-parchment-600 dark:text-parchment-300 flex-1">{s.label}</span>
            <span className="text-xs font-medium text-parchment-400 dark:text-parchment-500">{s.cnt}</span>
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
  const topStreaks = [...habits]
    .filter((h) => h.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak)
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
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-500 mb-1">
            Hoy
          </p>
          <h1 className="text-xl font-serif font-bold text-parchment-950 dark:text-parchment-100 leading-tight mb-1.5">
            {allDone ? "Virtud consumada ✦" : `Hola, ${userName}`}
          </h1>
          <p className="text-xs text-parchment-500 dark:text-parchment-400 mb-4 leading-relaxed">
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

      {/* ── MARBLE BUST ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-10 flex flex-col items-center py-6 rounded-2xl bg-gradient-to-b from-parchment-200/60 dark:from-parchment-900/60 to-transparent border border-parchment-300 dark:border-parchment-700"
      >
        <MarbleBust />
        <blockquote className="mt-4 px-6 text-center max-w-xs">
          <p className="text-sm font-serif italic text-parchment-700 dark:text-parchment-300 leading-relaxed">
            "El obstáculo es el camino."
          </p>
          <footer className="mt-1.5 text-[10px] uppercase tracking-widest text-parchment-400 dark:text-parchment-500">
            Meditaciones · Marco Aurelio
          </footer>
        </blockquote>
      </motion.section>

      {/* ── HABIT LIST ── */}
      {habits.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-500">
              Tus Hábitos
            </h2>
            <span className="text-[10px] text-parchment-400 dark:text-parchment-500">← 7 días</span>
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
                        <span className="text-sm font-medium text-parchment-900 dark:text-parchment-100 truncate">
                          {h.name}
                        </span>
                        {h.currentStreak > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold flex-shrink-0" style={{ color }}>
                            <Flame size={9} />{h.currentStreak}
                          </span>
                        )}
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
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-500 mb-4">
              Por categoría
            </h3>
            <CategoryDonut habits={habits} />
          </div>
          <div className="rounded-2xl bg-parchment-100 dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 p-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-500 mb-4">
              Completados · 7 días
            </h3>
            <WeekBars habits={habits} />
          </div>
        </motion.section>
      )}

      {/* ── TOP STREAKS ── */}
      {topStreaks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45 }}
          className="rounded-2xl bg-gradient-to-br from-parchment-200/80 dark:from-parchment-800/80 to-parchment-100 dark:to-parchment-900 border border-parchment-300 dark:border-parchment-700 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={12} className="text-parchment-400 dark:text-parchment-500" />
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-parchment-400 dark:text-parchment-500">
              Rachas activas
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {topStreaks.map((h, i) => {
              const color = getColor(h.color);
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <Link key={h.id} href={`/habits/${h.id}`} className="flex items-center gap-3 group">
                  <span className="text-base leading-none w-5 flex-shrink-0">{medals[i]}</span>
                  <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="flex-1 text-sm text-parchment-800 dark:text-parchment-200 truncate group-hover:text-parchment-950 dark:group-hover:text-parchment-100 transition-colors">
                    {h.name}
                  </span>
                  <span className="text-xs font-bold flex-shrink-0 flex items-center gap-1" style={{ color }}>
                    <Flame size={11} />{h.currentStreak} días
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}
