"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { COMPANIES, type HumanProfile } from "@/lib/profile";
import { SCENE_ASSETS } from "@/lib/scene-assets";

interface CompanyAssignmentSceneProps {
  profile: HumanProfile;
  onComplete: () => void;
}

export function CompanyAssignmentScene({
  profile,
  onComplete,
}: CompanyAssignmentSceneProps) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [assigned, setAssigned] = useState(false);
  const targetIndex = COMPANIES.findIndex(
    (c) => c.ticker === profile.company.ticker,
  );

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const totalCycles = 28 + targetIndex;
    const interval = setInterval(() => {
      if (cancelled) return;
      frame++;
      setCycleIndex(frame % COMPANIES.length);
      if (frame >= totalCycles) {
        clearInterval(interval);
        setCycleIndex(targetIndex);
        setAssigned(true);
        setTimeout(() => {
          if (!cancelled) onComplete();
        }, 2200);
      }
    }, 95);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [onComplete, targetIndex]);

  const display = assigned ? profile.company : COMPANIES[cycleIndex]!;

  return (
    <motion.div
      className="scene-shot bg-black"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ scale: 1.08, opacity: 0, transition: { duration: 0.35 } }}
    >
      <header className="absolute top-6 left-6 md:left-10 z-30">
        <p className="scene-eyebrow font-mono text-[var(--zorp-gray)]">
          CORPORATE LINK PROTOCOL
        </p>
        <p className="scene-label font-mono text-[var(--zorp-green)] mt-1">
          {assigned ? "ASSIGNMENT COMPLETE" : "SELECTING EARTH ENTITY..."}
        </p>
      </header>

      {/* Terminal — the room / environment */}
      <motion.div
        className="absolute left-1/2 z-10"
        style={{
          bottom: "-6vh",
          width: "clamp(950px, 82vw, 1500px)",
          aspectRatio: "5 / 4",
          transform: "translateX(-50%)",
        }}
        animate={{ filter: assigned ? "brightness(0.72)" : "brightness(1)" }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={SCENE_ASSETS.corporateTerminal}
          alt="Corporate Terminal"
          fill
          className="object-contain object-bottom"
          sizes="82vw"
          priority
          draggable={false}
        />

        {/* Single ticker — centered on terminal screen */}
        <div className="absolute inset-x-[16%] top-[8%] h-[26%] flex items-center justify-center z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={assigned ? "locked" : display.ticker}
              initial={{ opacity: 0, y: assigned ? 8 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: assigned ? 0.35 : 0.05 }}
              className="text-center w-full"
            >
              {!assigned ? (
                <p className="scene-ticker font-mono text-[var(--zorp-green)] drop-shadow-[0_0_24px_rgba(57,255,20,0.55)]">
                  {display.ticker}
                </p>
              ) : (
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <p className="scene-ticker font-mono text-[var(--zorp-green)]">
                    {display.ticker}
                  </p>
                  <p className="scene-title font-mono text-[var(--zorp-white)]">
                    {display.name}
                  </p>
                  <p className="scene-label font-mono text-[var(--zorp-green)] tracking-[0.25em]">
                    {profile.greyClass}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Corporate — overlaps left edge of machine */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: "4vw",
          bottom: "-8vh",
          height: "clamp(430px, 58vh, 720px)",
          width: "auto",
          aspectRatio: "3 / 4",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/75 to-transparent z-10 pointer-events-none" />
        <Image
          src="/zorpians/04-corporate.png"
          alt="Corporate"
          fill
          className="object-contain object-bottom"
          sizes="35vw"
          draggable={false}
        />
      </div>

      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 scene-eyebrow font-mono text-[var(--zorp-gray)] text-center px-4">
        SIMULATION ONLY — FINAL COMPANY IS ASSIGNED AT MINT.
      </p>
    </motion.div>
  );
}
