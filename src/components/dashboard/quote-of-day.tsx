"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Quote } from "@/lib/utils/quotes";

const QuoteIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    className="text-sienna-500 flex-shrink-0"
  >
    <path
      d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
      fill="currentColor"
    />
    <path
      d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
      fill="currentColor"
    />
  </svg>
);

// ── Variante flotante (desktop) ──────────────────────────────────────────────

export function QuoteOfDay({ quote }: { quote: Quote }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="fixed bottom-6 right-6 z-30 hidden md:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex flex-col items-end gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[240px] pl-3 border-l border-sienna-400/60"
            >
              <p className="font-serif italic text-[12px] text-parchment-700 leading-relaxed mb-2">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-3 bg-parchment-300 flex-shrink-0" />
                <p className="font-sans text-[10px] text-parchment-400 leading-snug">
                  {quote.author}
                  {quote.source && (
                    <span className="text-parchment-300">, <em>{quote.source}</em></span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 bg-parchment-200 border border-parchment-300 rounded-full px-3 py-1.5 shadow-sm cursor-pointer select-none"
        >
          <QuoteIcon />
          <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-parchment-500">
            Frase del día
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Variante inline (mobile) ─────────────────────────────────────────────────

export function QuoteOfDayInline({ quote }: { quote: Quote }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="md:hidden mt-10 mb-2"
    >
      {/* Pill trigger — igual estética que el desktop */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-parchment-200 border border-parchment-300 rounded-full px-3 py-1.5 shadow-sm select-none"
      >
        <QuoteIcon />
        <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-parchment-500">
          Frase del día
        </span>
      </motion.button>

      {/* Quote expandible */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 pl-3 border-l border-sienna-400/50">
              <p className="font-serif italic text-[12px] text-parchment-700 leading-relaxed mb-2">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-3 bg-parchment-300 flex-shrink-0" />
                <p className="font-sans text-[10px] text-parchment-400 leading-snug">
                  {quote.author}
                  {quote.source && (
                    <span className="text-parchment-300">, <em>{quote.source}</em></span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
