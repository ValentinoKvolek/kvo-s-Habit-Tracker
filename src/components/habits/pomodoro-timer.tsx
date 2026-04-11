"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { saveStudySession } from "@/lib/actions/study.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
const LONG_BREAK_EVERY = 4;

type Phase = "idle" | "work" | "shortBreak" | "longBreak";

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Listo para empezar",
  work: "Tiempo de trabajo",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
};

const PHASE_DURATIONS: Record<Phase, number> = {
  idle: WORK_MINUTES * 60,
  work: WORK_MINUTES * 60,
  shortBreak: SHORT_BREAK_MINUTES * 60,
  longBreak: LONG_BREAK_MINUTES * 60,
};

const PHASE_COLORS: Record<Phase, string> = {
  idle: "#8d7a62",
  work: "#c0392b",
  shortBreak: "#27ae60",
  longBreak: "#2980b9",
};

interface PomodoroTimerProps {
  habitId: string;
  date: string;
  targetCount: number;
  todayCompletedSessions: number;
  onSessionComplete?: (newTotal: number) => void;
}

export function PomodoroTimer({
  habitId,
  date,
  targetCount,
  todayCompletedSessions,
  onSessionComplete,
}: PomodoroTimerProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalToday, setTotalToday] = useState(todayCompletedSessions);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = PHASE_DURATIONS[phase];
  const progress = ((totalDuration - secondsLeft) / totalDuration) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleWorkComplete = useCallback(async () => {
    clearTimer();
    setIsRunning(false);
    setIsSaving(true);

    try {
      const result = await saveStudySession(habitId, date, {
        sessions: 1,
        totalMinutes: WORK_MINUTES,
      });
      const newTotal = result.totalSessions;
      setTotalToday(newTotal);
      onSessionComplete?.(newTotal);

      const newCycles = cyclesCompleted + 1;
      setCyclesCompleted(newCycles);

      const isLongBreak = newCycles % LONG_BREAK_EVERY === 0;
      const nextPhase: Phase = isLongBreak ? "longBreak" : "shortBreak";
      setPhase(nextPhase);
      setSecondsLeft(PHASE_DURATIONS[nextPhase]);

      toast.success(`¡Pomodoro completado! ${newTotal}/${targetCount} hoy`, {
        description: isLongBreak ? "Merecés un descanso largo 🎉" : "Tomá un descanso corto.",
      });
    } catch {
      toast.error("No se pudo guardar la sesión.");
    } finally {
      setIsSaving(false);
    }
  }, [clearTimer, cyclesCompleted, date, habitId, onSessionComplete, targetCount]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === "work") {
            handleWorkComplete();
          } else {
            // Break finished — go back to idle
            clearTimer();
            setIsRunning(false);
            setPhase("idle");
            setSecondsLeft(WORK_MINUTES * 60);
            toast("Descanso terminado. ¡Listo para el siguiente!", { icon: "⏰" });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, handleWorkComplete, clearTimer]);

  function handleStartPause() {
    if (phase === "idle") {
      setPhase("work");
      setSecondsLeft(WORK_MINUTES * 60);
      setIsRunning(true);
      return;
    }
    setIsRunning((r) => !r);
  }

  function handleReset() {
    clearTimer();
    setIsRunning(false);
    setPhase("idle");
    setSecondsLeft(WORK_MINUTES * 60);
  }

  function handleSkip() {
    clearTimer();
    setIsRunning(false);
    if (phase === "work") {
      // Skip work — no session saved
      const isLongBreak = (cyclesCompleted + 1) % LONG_BREAK_EVERY === 0;
      const next: Phase = isLongBreak ? "longBreak" : "shortBreak";
      setPhase(next);
      setSecondsLeft(PHASE_DURATIONS[next]);
    } else {
      setPhase("idle");
      setSecondsLeft(WORK_MINUTES * 60);
    }
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = PHASE_COLORS[phase];

  return (
    <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-4">
        Pomodoro
      </h2>

      <div className="flex flex-col items-center gap-5">
        {/* Ring + countdown */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.07)"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span
              className="text-3xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {timeString}
            </span>
            <span className="text-xs text-parchment-500 text-center px-2 leading-tight">
              {PHASE_LABELS[phase]}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-10 h-10 rounded-xl bg-parchment-300 hover:bg-parchment-400 text-parchment-600 hover:text-parchment-950 transition-colors flex items-center justify-center"
            aria-label="Reiniciar"
          >
            <RotateCcw size={16} />
          </button>

          <motion.button
            type="button"
            onClick={handleStartPause}
            disabled={isSaving}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors disabled:opacity-60",
              phase === "work" && isRunning
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-parchment-950 text-parchment-100 hover:bg-parchment-800"
            )}
            aria-label={isRunning ? "Pausar" : "Iniciar"}
          >
            {isRunning ? <Pause size={22} /> : <Play size={22} />}
          </motion.button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-10 h-10 rounded-xl bg-parchment-300 hover:bg-parchment-400 text-parchment-600 hover:text-parchment-950 transition-colors flex items-center justify-center"
            aria-label="Saltar"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Today's progress */}
        <div className="w-full flex items-center justify-between bg-parchment-300/50 rounded-xl px-4 py-2.5">
          <span className="text-sm text-parchment-600">Sesiones hoy</span>
          <span className="text-sm font-semibold text-parchment-950">
            {totalToday}
            <span className="font-normal text-parchment-500"> / {targetCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
