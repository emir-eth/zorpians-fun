"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { HumanProfile } from "@/lib/profile";
import { SCENE_ASSETS } from "@/lib/scene-assets";

interface HumanScanSceneProps {
  profile: HumanProfile;
  onComplete: () => void;
}

const STATS = [
  { key: "intelligence" as const, label: "INTELLIGENCE" },
  { key: "greed" as const, label: "GREED" },
  { key: "memeResistance" as const, label: "MEME RESISTANCE" },
  { key: "cosmicCompatibility" as const, label: "COSMIC COMPATIBILITY" },
];

function MachineStat({
  label,
  value,
  visible,
}: {
  label: string;
  value: number;
  visible: boolean;
}) {
  return (
    <div className="font-mono min-w-[150px]">
      <div className="flex justify-between items-baseline gap-3 text-[11px] md:text-xs tracking-[0.18em]">
        <span className="text-[var(--zorp-gray)]">{label}</span>
        {visible && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--zorp-green)]"
          >
            {value}%
          </motion.span>
        )}
      </div>
      <div className="h-px mt-1 bg-[var(--zorp-graphite-light)] overflow-hidden">
        {visible && (
          <motion.div
            className="h-full bg-[var(--zorp-green)]"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </div>
    </div>
  );
}

export function HumanScanScene({ profile, onComplete }: HumanScanSceneProps) {
  const [visibleStats, setVisibleStats] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);

  useEffect(() => {
    const timers = Array.from({ length: STATS.length }, (_, i) =>
      setTimeout(() => setVisibleStats(i + 1), 400 + i * 350),
    );
    timers.push(setTimeout(() => setShowVerdict(true), 3800));
    timers.push(setTimeout(onComplete, 5500));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="scene-shot bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        clipPath: ["inset(0 0 0 0)", "inset(0 0 100% 0)"],
        transition: { duration: 0.4, ease: "easeIn" },
      }}
    >
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-40"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      <header className="absolute top-6 left-6 md:left-10 z-30">
        <p className="scene-eyebrow font-mono text-[var(--zorp-gray)]">HUMAN ANALYSIS</p>
        <p className="scene-label font-mono text-[var(--zorp-green)] mt-1">SCANNING HUMAN...</p>
      </header>

      {/* ONE lab illustration — device is the environment */}
      <div className="absolute inset-0">
        {/* Scientist — background, lower weight */}
        <div
          className="absolute z-[5] pointer-events-none"
          style={{
            right: "2vw",
            bottom: "4vh",
            height: "clamp(330px, 43vh, 560px)",
            width: "auto",
            aspectRatio: "3 / 4",
            opacity: 0.7,
          }}
        >
          <Image
            src="/zorpians/03-scientist.png"
            alt="Scientist"
            fill
            className="object-contain object-bottom"
            sizes="30vw"
            draggable={false}
          />
        </div>

        {/* Scanner device — environment / dominant plane */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            top: "52%",
            transform: "translate(-42%, -50%)",
            width: "clamp(760px, 68vw, 1250px)",
            aspectRatio: "1 / 1",
          }}
        >
          <Image
            src={SCENE_ASSETS.scannerDevice}
            alt="Scanner Device"
            fill
            className="object-contain"
            sizes="68vw"
            priority
            draggable={false}
          />

          {/* Stats attached to machine face */}
          <div className="absolute top-[16%] right-[6%] md:right-[10%] space-y-3 md:space-y-4 z-20 pointer-events-none">
            {STATS.map((stat, i) => (
              <MachineStat
                key={stat.key}
                label={stat.label}
                value={profile[stat.key]}
                visible={i < visibleStats}
              />
            ))}
          </div>
        </div>

        {/* Scanner — foreground left, cropped out of frame */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: 0,
            bottom: "-8vh",
            height: "clamp(500px, 68vh, 850px)",
            width: "auto",
            aspectRatio: "3 / 4",
            transform: "translateX(-8%)",
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none" />
          <Image
            src="/zorpians/01-scanner.png"
            alt="Scanner"
            fill
            className="object-contain object-bottom"
            sizes="40vw"
            priority
            draggable={false}
          />
        </div>
      </div>

      <AnimatePresence>
        {showVerdict && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-30 scene-label font-mono text-[var(--zorp-white)]"
          >
            {profile.scanVerdict}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
