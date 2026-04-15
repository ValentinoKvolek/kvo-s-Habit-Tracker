"use client";

import { motion } from "motion/react";

interface StreakRingProps {
  /** 0–100 progress percentage */
  progress: number;
  color: string; // hex or oklch
  size?: number;
  strokeWidth?: number;
  streak?: number;
  isCompleted?: boolean;
  label?: string; // e.g. "2/3" for count-based habits
}

export function StreakRing({
  progress,
  color,
  size = 64,
  strokeWidth = 5,
  streak = 0,
  isCompleted = false,
  label,
}: StreakRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isCompleted ? (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            width={size * 0.35}
            height={size * 0.35}
            viewBox="0 0 24 24"
            fill="none"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          </motion.svg>
        ) : label ? (
          <motion.span
            key={label}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold leading-none"
            style={{ color, fontSize: size * 0.19 }}
          >
            {label}
          </motion.span>
        ) : streak > 0 ? (
          <span
            className="text-xs font-bold leading-none"
            style={{ color, fontSize: size * 0.22 }}
          >
            {streak}
          </span>
        ) : null}
      </div>
    </div>
  );
}
