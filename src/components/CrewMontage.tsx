"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CrewMontageProps {
  onComplete: () => void;
}

const SHOTS = [
  {
    image: "/zorpians/07-data-analyst.png",
    alt: "Data Analyst",
    lines: ["DATA PROCESSING"],
    position: "right" as const,
    effect: "data" as const,
    offset: "translateX(18%)",
  },
  {
    image: "/zorpians/10-communicator.png",
    alt: "Communicator",
    lines: ["TRANSMISSION", "ROUTE CONFIRMED"],
    position: "left" as const,
    effect: "wave" as const,
    offset: "translateX(-16%)",
  },
  {
    image: "/zorpians/19-monitor.png",
    alt: "Monitor",
    lines: ["FINAL SIGNAL", "VALIDATION"],
    position: "right" as const,
    effect: "lock" as const,
    offset: "translateX(10%)",
  },
];

const SHOT_MS = 1500;

export function CrewMontage({ onComplete }: CrewMontageProps) {
  const [shot, setShot] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    SHOTS.forEach((_, i) => {
      if (i > 0) {
        timers.push(setTimeout(() => setShot(i), i * SHOT_MS));
      }
    });

    timers.push(
      setTimeout(() => setComplete(true), SHOTS.length * SHOT_MS),
    );
    timers.push(setTimeout(onComplete, SHOTS.length * SHOT_MS + 900));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const current = SHOTS[shot]!;

  return (
    <motion.div
      className="scene-shot bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.92,
        boxShadow: "inset 0 0 0 4px rgba(57,255,20,0.8)",
        transition: { duration: 0.45 },
      }}
    >
      <AnimatePresence mode="wait">
        {!complete ? (
          <motion.div
            key={shot}
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0, x: shot % 2 === 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shot % 2 === 0 ? -120 : 120 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 z-30 bg-[var(--zorp-green)] origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.22, ease: "easeIn" }}
            />

            {current.effect === "data" && <DataStreams />}
            {current.effect === "wave" && <WaveformCross />}
            {current.effect === "lock" && <TargetingLock />}

            {/* Fullscreen cinematic crop — no container / card */}
            <div
              className={`absolute bottom-0 z-10 ${
                current.position === "left" ? "left-0" : "right-0"
              }`}
              style={{
                height: "clamp(65vh, 74vh, 80vh)",
                width: "auto",
                aspectRatio: "3 / 4",
                transform: current.offset,
              }}
            >
              <Image
                src={current.image}
                alt={current.alt}
                fill
                className="object-contain object-bottom"
                sizes="55vw"
                priority
                draggable={false}
              />
            </div>

            <div
              className={`absolute top-1/2 -translate-y-1/2 z-20 ${
                current.position === "left"
                  ? "right-[6%] md:right-[10%] text-right"
                  : "left-[6%] md:left-[10%] text-left"
              }`}
            >
              {current.lines.map((line) => (
                <p
                  key={line}
                  className="scene-title font-mono text-[var(--zorp-green)] leading-[1.05]"
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="scene-title font-mono text-[var(--zorp-white)] tracking-[0.25em]">
              ABDUCTION COMPLETE
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DataStreams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-[var(--zorp-green)] opacity-35"
          style={{ top: `${12 + i * 10}%`, width: "100%" }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.07, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function WaveformCross() {
  return (
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-end justify-center gap-[3px] h-32 z-[5] px-4"
      aria-hidden
    >
      {Array.from({ length: 64 }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 max-w-[10px] bg-[var(--zorp-green)] origin-bottom opacity-50"
          animate={{ height: [6, 20 + (i % 7) * 10, 6] }}
          transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.015 }}
        />
      ))}
    </div>
  );
}

function TargetingLock() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      aria-hidden
    >
      <motion.div
        className="absolute border-2 border-[var(--zorp-green)] rounded-full opacity-50"
        initial={{ width: "120vw", height: "120vw" }}
        animate={{ width: "70vw", height: "70vw" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{ maxWidth: 900, maxHeight: 900 }}
      />
      <motion.div
        className="absolute border border-[var(--zorp-green)] opacity-80"
        initial={{ width: "100vw", height: "100vw" }}
        animate={{ width: "42vw", height: "42vw" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{ maxWidth: 520, maxHeight: 520 }}
      />
      <motion.div
        className="absolute w-full h-px bg-[var(--zorp-green)] opacity-40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      />
      <motion.div
        className="absolute h-full w-px bg-[var(--zorp-green)] opacity-40"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      />
    </motion.div>
  );
}
