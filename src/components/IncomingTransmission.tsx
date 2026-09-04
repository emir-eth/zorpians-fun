"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalText } from "./TerminalText";
import { Disclaimer } from "./Disclaimer";
import { ScanField } from "./cinematic/ScanField";

interface IncomingTransmissionProps {
  onComplete: () => void;
}

const PREAMBLE = [
  "SIGNAL INTERCEPTED",
  "ORIGIN: UNKNOWN",
  "SOURCE: PLANET ZORP",
];

export function IncomingTransmission({ onComplete }: IncomingTransmissionProps) {
  const [stage, setStage] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 900),
      setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 350);
        setStage(2);
      }, 1700),
      setTimeout(() => setStage(3), 2500),
      setTimeout(() => setStage(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className={`scene-shot flex flex-col items-center justify-center px-6 overflow-hidden ${
        glitch ? "glitch-active" : ""
      }`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      {stage >= 3 && <ScanField active intensity={stage >= 3 ? "medium" : "low"} />}

      <div className="relative z-10 w-full max-w-2xl">
        {stage >= 0 && (
          <TerminalText lines={PREAMBLE} lineDelay={0.35} className="mb-12 text-base md:text-lg" />
        )}

        <AnimatePresence>
          {stage >= 2 && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="scene-title font-mono text-[var(--zorp-white)] text-center mb-8"
            >
              INCOMING TRANSMISSION
            </motion.h1>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <p className="scene-label font-mono text-[var(--zorp-green)]">
                UNKNOWN HUMAN DETECTED
              </p>
              <p className="scene-eyebrow font-mono text-[var(--zorp-gray)]">
                PLANET ZORP IS SCANNING EARTH.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage >= 4 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onComplete}
              className="mt-14 block mx-auto font-mono scene-label tracking-widest text-[var(--zorp-green)] border border-[var(--zorp-green-dim)] px-10 py-5 hover:border-[var(--zorp-green)] hover:bg-[rgba(57,255,20,0.05)] transition-colors cursor-pointer"
            >
              {"> IDENTIFY YOURSELF"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <Disclaimer compact />
      </div>
    </motion.div>
  );
}
