"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SCENE_ASSETS } from "@/lib/scene-assets";

interface AbductionSceneProps {
  onComplete: () => void;
}

const STATUSES = [
  "LOCKING COORDINATES",
  "DISABLING LOCAL SIGNAL",
  "OPENING TRANSPORT BEAM",
  "EXTRACTING HUMAN",
  "ATMOSPHERIC EXIT",
];

export function AbductionScene({ onComplete }: AbductionSceneProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const duration = 6000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / steps) * 100));
      setProgress(pct);
      setStatusIndex(
        Math.min(STATUSES.length - 1, Math.floor((pct / 100) * STATUSES.length)),
      );

      if (pct >= 100) {
        clearInterval(timer);
        setComplete(true);
        setTimeout(() => setFlash(true), 800);
        setTimeout(onComplete, 2000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const barFilled = Math.floor(progress / 10);
  const barEmpty = 10 - barFilled;

  // Phase-driven camera
  const ufoArrive = Math.min(1, progress / 30);
  const beamIntensity = progress > 30 ? Math.min(1, (progress - 30) / 30) : 0;
  const earthDrop = progress > 60 ? ((progress - 60) / 30) * 12 : 0;
  const cameraPush = progress > 90 ? ((progress - 90) / 10) * 8 : 0;
  const cameraScale = 1 + progress * 0.0004 + (progress > 90 ? (progress - 90) * 0.004 : 0);

  return (
    <motion.div
      className="scene-shot bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 1,
        transition: { duration: 0.15 },
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transform: `translateY(-${cameraPush}%) scale(${cameraScale})`,
        }}
      >
        {/* UFO + beam — dominant upper composition */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
          <motion.div
            className="relative w-[min(68vw,900px)] aspect-[5/4] z-20"
            initial={{ opacity: 0, x: "15vw", y: "-8vh", scale: 0.75 }}
            animate={{
              opacity: ufoArrive,
              x: `${(1 - ufoArrive) * 8}vw`,
              y: `${(1 - ufoArrive) * -6}vh`,
              scale: 0.85 + ufoArrive * 0.15,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={SCENE_ASSETS.ufoTransport}
              alt="UFO Transport"
              fill
              className="object-contain object-bottom"
              sizes="68vw"
              priority
              draggable={false}
            />
          </motion.div>

          <motion.div
            className="relative w-[min(36vw,480px)] -mt-[1%] z-10"
            animate={{
              opacity: beamIntensity,
              scaleY: 0.3 + beamIntensity * 0.7 + progress * 0.003,
            }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "top center", minHeight: "min(42vh, 480px)" }}
          >
            <Image
              src={SCENE_ASSETS.abductionBeam}
              alt="Abduction Beam"
              fill
              className="object-contain object-top"
              sizes="36vw"
              priority
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Earth horizon — large bottom arc */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160vw] max-w-[2000px] pointer-events-none"
          style={{ height: "32vh", transform: `translateX(-50%) translateY(${earthDrop}%)` }}
        >
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-full aspect-square rounded-full border-2 border-[var(--zorp-green-dim)]/30" />
          <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[98%] aspect-square rounded-full bg-gradient-to-t from-[#0d1f0d] via-[#060806] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </motion.div>
      </motion.div>

      {/* Pilot — large transmission portrait, cropped right */}
      <div className="absolute top-[12vh] -right-[4vw] z-30 pointer-events-none w-[min(42vw,520px)] h-[min(38vh,480px)]">
        <motion.div
          className="relative w-full h-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="absolute -top-6 left-4 font-mono scene-eyebrow text-[var(--zorp-green)]">
            LIVE TRANSMISSION
          </p>
          <Image
            src="/zorpians/02-ufo-pilot.png"
            alt="UFO Pilot"
            fill
            className="object-contain object-bottom"
            sizes="42vw"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Progress — minimal bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 z-40 px-8 pb-12 pt-24 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            {!complete ? (
              <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="scene-eyebrow font-mono text-[var(--zorp-green)] mb-1">
                  TARGET LOCKED
                </p>
                <p className="scene-label font-mono text-[var(--zorp-white)] mb-4">
                  ABDUCTION IN PROGRESS
                </p>
                <div className="font-mono scene-label tracking-widest text-[var(--zorp-green)] mb-2">
                  {"█".repeat(barFilled)}
                  {"░".repeat(barEmpty)} {progress}%
                </div>
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="scene-eyebrow font-mono text-[var(--zorp-gray)]"
                >
                  {STATUSES[statusIndex]}
                </motion.p>
              </motion.div>
            ) : (
              <motion.p
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="scene-title font-mono text-[var(--zorp-white)]"
              >
                WELCOME ABOARD.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 0] }}
            transition={{ duration: 1 }}
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(255,255,255,1) 0%, rgba(57,255,20,0.9) 45%, transparent 80%)",
            }}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
