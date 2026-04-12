"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, SkipForward, Settings2, Plus, Minus } from "lucide-react";
import { saveStudySession } from "@/lib/actions/study.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "pomodoro-settings";

const DEFAULTS = {
  workMin: 25,
  shortMin: 5,
  longMin: 15,
};

function loadSettings(): typeof DEFAULTS {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      workMin: Number(parsed.workMin) || DEFAULTS.workMin,
      shortMin: Number(parsed.shortMin) || DEFAULTS.shortMin,
      longMin: Number(parsed.longMin) || DEFAULTS.longMin,
    };
  } catch {
    return DEFAULTS;
  }
}

const LONG_BREAK_EVERY = 4;

type Phase = "idle" | "work" | "shortBreak" | "longBreak";

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Listo para empezar",
  work: "Tiempo de trabajo",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
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
  const [settings, setSettings] = useState(DEFAULTS);
  const [showSettings, setShowSettings] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULTS.workMin * 60);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalToday, setTotalToday] = useState(todayCompletedSessions);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  function initAudio() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }

  function playBell() {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const ring = () => {
      // Dos dings rápidos estilo iOS — agudos, suaves, cortos
      [0, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 1567; // G6 — agudo y liviano
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.008); // ataque rápido
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55); // decay corto
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(ring);
    } else {
      ring();
    }
  }

  // Load persisted settings on mount
  useEffect(() => {
    const saved = loadSettings();
    setSettings(saved);
    setSecondsLeft(saved.workMin * 60);
  }, []);

  function getPhaseDuration(p: Phase, s: typeof DEFAULTS): number {
    switch (p) {
      case "idle":
      case "work":
        return s.workMin * 60;
      case "shortBreak":
        return s.shortMin * 60;
      case "longBreak":
        return s.longMin * 60;
    }
  }

  const totalDuration = getPhaseDuration(phase, settings);
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
    playBell();

    try {
      const result = await saveStudySession(habitId, date, {
        sessions: 1,
        totalMinutes: settings.workMin,
      });
      const newTotal = result.totalSessions;
      setTotalToday(newTotal);
      onSessionComplete?.(newTotal);

      const newCycles = cyclesCompleted + 1;
      setCyclesCompleted(newCycles);

      const isLongBreak = newCycles % LONG_BREAK_EVERY === 0;
      const nextPhase: Phase = isLongBreak ? "longBreak" : "shortBreak";
      setPhase(nextPhase);
      setSecondsLeft(getPhaseDuration(nextPhase, settings));

      toast.success(`¡Pomodoro completado! ${newTotal}/${targetCount} hoy`, {
        description: isLongBreak ? "Merecés un descanso largo 🎉" : "Tomá un descanso corto.",
      });
    } catch {
      toast.error("No se pudo guardar la sesión.");
    } finally {
      setIsSaving(false);
    }
  }, [clearTimer, cyclesCompleted, date, habitId, onSessionComplete, targetCount, settings]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === "work") {
            handleWorkComplete();
          } else {
            clearTimer();
            setIsRunning(false);
            setPhase("idle");
            setSecondsLeft(settings.workMin * 60);
            playBell();
            toast("Descanso terminado. ¡Listo para el siguiente!", { icon: "⏰" });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, phase, handleWorkComplete, clearTimer, settings.workMin]);

  function handleStartPause() {
    initAudio(); // inicializar AudioContext desde gesto de usuario
    if (phase === "idle") {
      setPhase("work");
      setSecondsLeft(settings.workMin * 60);
      setIsRunning(true);
      return;
    }
    setIsRunning((r) => !r);
  }

  function handleReset() {
    clearTimer();
    setIsRunning(false);
    setPhase("idle");
    setSecondsLeft(settings.workMin * 60);
  }

  function handleSkip() {
    clearTimer();
    setIsRunning(false);
    if (phase === "work") {
      const isLongBreak = (cyclesCompleted + 1) % LONG_BREAK_EVERY === 0;
      const next: Phase = isLongBreak ? "longBreak" : "shortBreak";
      setPhase(next);
      setSecondsLeft(getPhaseDuration(next, settings));
    } else {
      setPhase("idle");
      setSecondsLeft(settings.workMin * 60);
    }
  }

  function handleSettingChange(key: keyof typeof DEFAULTS, value: number) {
    const clamped = Math.max(1, Math.min(120, value));
    const next = { ...settings, [key]: clamped };
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Reset timer to reflect new duration when idle
    if (phase === "idle") {
      setSecondsLeft(next.workMin * 60);
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
      <div className="relative flex items-center mb-4">
        <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider">
          Pomodoro
        </h2>
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          className={cn(
            "absolute right-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            showSettings
              ? "bg-parchment-400 text-parchment-950"
              : "text-parchment-400 hover:text-parchment-950 hover:bg-parchment-300"
          )}
          aria-label="Configurar tiempos"
        >
          <Settings2 size={15} />
        </button>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mb-5 p-3 bg-parchment-100 border border-parchment-300 rounded-xl">
              {[
                { key: "workMin" as const, label: "Trabajo", color: PHASE_COLORS.work },
                { key: "shortMin" as const, label: "Descanso\ncorto", color: PHASE_COLORS.shortBreak },
                { key: "longMin" as const, label: "Descanso\nlargo", color: PHASE_COLORS.longBreak },
              ].map(({ key, label, color: c }, i) => (
                <div
                  key={key}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 py-1",
                    i < 2 && "border-r border-parchment-300 pr-2"
                  )}
                >
                  <span
                    className="h-7 flex items-center justify-center text-[9px] font-semibold uppercase tracking-wider text-center leading-tight whitespace-pre"
                    style={{ color: c }}
                  >
                    {label}
                  </span>

                  {/* + button */}
                  <button
                    type="button"
                    disabled={isRunning || settings[key] >= 120}
                    onClick={() => handleSettingChange(key, settings[key] + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-parchment-200 hover:bg-parchment-300 text-parchment-600 hover:text-parchment-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={12} />
                  </button>

                  {/* Value display */}
                  <motion.span
                    key={settings[key]}
                    initial={{ scale: 0.85, opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-xl font-bold tabular-nums leading-none"
                    style={{ color: c }}
                  >
                    {settings[key]}
                  </motion.span>
                  <span className="text-[10px] text-parchment-400 -mt-1">min</span>

                  {/* - button */}
                  <button
                    type="button"
                    disabled={isRunning || settings[key] <= 1}
                    onClick={() => handleSettingChange(key, settings[key] - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-parchment-200 hover:bg-parchment-300 text-parchment-600 hover:text-parchment-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              ))}
            </div>
            {isRunning && (
              <p className="text-xs text-parchment-500 text-center mb-4 -mt-3">
                Pausá el timer para editar los tiempos.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
