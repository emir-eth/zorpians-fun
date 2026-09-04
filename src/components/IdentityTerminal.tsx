"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isValidHandle, normalizeHandle, saveHandle } from "@/lib/identity";
import { formatHandleDisplay } from "@/lib/identity";
import { Disclaimer } from "./Disclaimer";
import { ScanField, HorizontalScanBeam } from "./cinematic/ScanField";

interface IdentityTerminalProps {
  onComplete: (handle: string) => void;
}

export function IdentityTerminal({ onComplete }: IdentityTerminalProps) {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"form" | "located" | "acquired">("form");
  const [error, setError] = useState("");
  const [handle, setHandle] = useState("");

  const handleInput = useCallback((value: string) => {
    const cleaned = value
      .replace(/^@+/, "")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .slice(0, 32);
    setInput(cleaned);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValidHandle(input)) {
        setError("INVALID HUMAN SIGNAL");
        return;
      }
      const normalized = normalizeHandle(input);
      saveHandle(normalized);
      setHandle(normalized);
      setPhase("located");

      setTimeout(() => setPhase("acquired"), 900);
      setTimeout(() => onComplete(normalized), 1800);
    },
    [input, onComplete],
  );

  return (
    <motion.div
      className="scene-shot flex flex-col items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      {phase !== "form" && (
        <>
          <ScanField active intensity="medium" />
          <HorizontalScanBeam active />
        </>
      )}

      {/* Lock-on brackets */}
      {phase !== "form" && (
        <div className="pointer-events-none absolute inset-8 md:inset-16 border border-[var(--zorp-green-dim)]/40 z-10" aria-hidden>
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[var(--zorp-green)]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[var(--zorp-green)]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[var(--zorp-green)]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[var(--zorp-green)]" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-20 w-full max-w-[560px]"
          >
            <h1 className="scene-title font-mono text-[var(--zorp-white)] mb-3">
              IDENTIFY YOURSELF
            </h1>
            <p className="scene-eyebrow font-mono text-[var(--zorp-gray)] mb-10">
              Transmit your X handle for signal lock
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--zorp-green)] font-mono text-xl">
                  @
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  placeholder="X_HANDLE"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full border-2 border-[var(--zorp-green-dim)] bg-[var(--zorp-graphite)]/80 py-6 pl-14 pr-6 font-mono text-lg md:text-xl tracking-wider text-[var(--zorp-white)] placeholder:text-[var(--zorp-gray-dim)] focus:border-[var(--zorp-green)]"
                />
              </div>

              {error && (
                <p className="scene-eyebrow font-mono text-red-500">{error}</p>
              )}

              <button
                type="submit"
                className="w-full border-2 border-[var(--zorp-green-dim)] bg-transparent py-5 font-mono scene-label tracking-[0.2em] text-[var(--zorp-green)] transition-colors hover:border-[var(--zorp-green)] hover:bg-[rgba(57,255,20,0.05)] cursor-pointer"
              >
                TRANSMIT
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="located"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-20 text-center w-full"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="scene-label font-mono text-[var(--zorp-green)] mb-10"
            >
              HUMAN SIGNAL LOCATED
            </motion.p>

            <div className="space-y-4 font-mono">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="scene-title text-[var(--zorp-white)]"
              >
                {formatHandleDisplay(handle)}
              </motion.p>
              <p className="scene-label tracking-[0.35em] text-[var(--zorp-gray)]">
                EARTH
              </p>
              {phase === "acquired" && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="scene-title text-[var(--zorp-green)] pt-6"
                >
                  STATUS: ACQUIRED
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <Disclaimer compact />
      </div>
    </motion.div>
  );
}
