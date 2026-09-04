"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SCENE_ASSETS } from "@/lib/scene-assets";

interface PlanetZorpArrivalProps {
  onOpenArchive: () => void;
}

export function PlanetZorpArrival({ onOpenArchive }: PlanetZorpArrivalProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3200),
      setTimeout(() => setStage(4), 4800),
      setTimeout(() => setStage(5), 6400),
      setTimeout(() => setStage(6), 8200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const showViewport = stage >= 2;
  const planetRevealed = stage >= 3;
  const showArrivalText = stage >= 4;
  const showClearedText = stage >= 5;
  const showButtons = stage >= 6;

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden bg-black z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      {/* Planet Zorp — full world background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          scale: planetRevealed ? 1.08 : 1,
          x: planetRevealed ? [0, -8, 0] : 0,
        }}
        transition={{
          scale: { duration: 6, ease: "easeOut" },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src={SCENE_ASSETS.planetZorp}
          alt="Planet Zorp"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          draggable={false}
        />
      </motion.div>

      {/* Atmosphere parallax layer */}
      {planetRevealed && (
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 70%, rgba(57,255,20,0.12) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Darkening before reveal */}
      <motion.div
        className="absolute inset-0 bg-black z-[2]"
        animate={{ opacity: stage < 3 ? (stage >= 2 ? 0.7 : 0.95) : 0 }}
        transition={{ duration: 1.2 }}
      />

      {/* Ship viewport — frames entire browser */}
      <AnimatePresence>
        {showViewport && (
          <motion.div
            className="absolute inset-0 z-[10]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={SCENE_ASSETS.shipViewport}
              alt="Ship Viewport"
              fill
              className="object-cover md:object-contain"
              sizes="100vw"
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewport shutters */}
      {showViewport && !planetRevealed && (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-black z-[15]"
            animate={{ x: stage >= 3 ? "-100%" : 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-black z-[15]"
            animate={{ x: stage >= 3 ? "100%" : 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </>
      )}

      {/* Navigator — large first beat */}
      <AnimatePresence>
        {stage < 2 && (
          <motion.div
            className="absolute inset-0 z-[20] flex flex-col items-center justify-center bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="scene-label font-mono text-[var(--zorp-green)] mb-8 tracking-[0.3em]">
              FINAL APPROACH
            </p>
            <div className="relative w-[min(50vw,560px)] h-[min(52vh,620px)]">
              <Image
                src="/zorpians/08-navigator.png"
                alt="Navigator"
                fill
                className="object-contain"
                sizes="50vw"
                draggable={false}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 scene-label font-mono text-[var(--zorp-green)]"
            >
              YOUR TRANSPORT HAS ARRIVED.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrival copy + CTAs — single bottom stack (no overlapping absolute layers) */}
      {showArrivalText && (
        <div className="absolute inset-x-0 bottom-0 z-[30] flex flex-col items-center px-6 pb-8 pt-20 text-gradient-scrim pointer-events-none">
          <div className="relative flex flex-col items-center text-center pointer-events-auto w-full max-w-xl">
            <AnimatePresence>
              {showArrivalText && (
                <motion.div
                  key="arrival"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="scene-title font-mono text-[var(--zorp-white)]">
                    PLANET ZORP
                  </p>
                  <p className="scene-label font-mono text-[var(--zorp-green)] mt-3 tracking-[0.3em]">
                    ARRIVAL CONFIRMED
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showClearedText && (
                <motion.div
                  key="cleared"
                  className="flex flex-col items-center mt-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <p className="scene-label font-mono text-[var(--zorp-white)] max-w-md">
                    YOU HAVE BEEN CLEARED FOR ZORP.
                  </p>
                  <p className="scene-eyebrow font-mono text-[var(--zorp-gray)] mt-2 max-w-sm">
                    Your real assignment begins at mint.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showButtons && (
                <motion.div
                  key="ctas"
                  className="flex flex-col items-center gap-4 mt-8 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <a
                    href="https://zorpians.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-[var(--zorp-green)] px-10 py-4 font-mono scene-label tracking-[0.12em] text-[var(--zorp-green)] hover:bg-[rgba(57,255,20,0.08)] transition-colors"
                  >
                    ENTER THE COSMIC CIVILIZATION
                  </a>
                  <a
                    href="https://x.com/zorpians"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono scene-eyebrow text-[var(--zorp-gray)] hover:text-[var(--zorp-green)] transition-colors"
                  >
                    OFFICIAL ZORPIANS
                  </a>
                  <button
                    onClick={onOpenArchive}
                    className="font-mono scene-eyebrow tracking-[0.2em] text-[var(--zorp-green-dim)] hover:text-[var(--zorp-green)] transition-colors cursor-pointer"
                  >
                    ACCESS CREW ARCHIVE
                  </button>

                  <div className="relative w-16 h-16 mt-2 opacity-50">
                    <Image
                      src="/zorpians/20-elder.png"
                      alt="Elder"
                      fill
                      className="object-contain"
                      sizes="64px"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

    </motion.div>
  );
}
