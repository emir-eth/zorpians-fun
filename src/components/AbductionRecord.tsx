"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { HumanProfile } from "@/lib/profile";
import { formatHandleDisplay } from "@/lib/identity";
import { SCENE_ASSETS } from "@/lib/scene-assets";
import { RECORD_FRAME } from "@/lib/abduction-record-layout";
import {
  exportAbductionRecord,
  downloadBlob,
  buildAbductionShareUrl,
} from "@/lib/export-card";

interface AbductionRecordProps {
  profile: HumanProfile;
  onContinue: () => void;
}

type RevealStep =
  | "generating"
  | "frame"
  | "character"
  | "data"
  | "idLock"
  | "sealed";

function regionStyle(r: { left: number; top: number; width: number; height: number }) {
  return {
    left: `${r.left * 100}%`,
    top: `${r.top * 100}%`,
    width: `${r.width * 100}%`,
    height: `${r.height * 100}%`,
  } as const;
}

export function AbductionRecord({ profile, onContinue }: AbductionRecordProps) {
  const [phase, setPhase] = useState<"prompt" | "card">("prompt");
  const [revealStep, setRevealStep] = useState<RevealStep>("generating");
  const [visibleRows, setVisibleRows] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleGenerate = useCallback(() => {
    setPhase("card");
  }, []);

  useEffect(() => {
    if (phase !== "card") return;

    const steps: { step: RevealStep; at: number; rows?: number }[] = [
      { step: "generating", at: 0 },
      { step: "frame", at: 600 },
      { step: "character", at: 1100 },
      { step: "data", at: 1600, rows: 1 },
      { step: "idLock", at: 2400, rows: 8 },
      { step: "sealed", at: 3000 },
    ];

    const timers = steps.map(({ step, at, rows }) =>
      setTimeout(() => {
        setRevealStep(step);
        if (rows !== undefined) setVisibleRows(rows);
        if (step === "data") {
          let r = 1;
          const dataTimer = setInterval(() => {
            r++;
            setVisibleRows(r);
            if (r >= 7) clearInterval(dataTimer);
          }, 80);
        }
      }, at),
    );

    timers.push(setTimeout(() => setShowActions(true), 3600));

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const handleSave = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await exportAbductionRecord(profile);
      downloadBlob(blob, `zorp-abduction-${profile.handle}.png`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [profile]);

  const handleShare = useCallback(() => {
    window.open(buildAbductionShareUrl(profile), "_blank", "noopener,noreferrer");
  }, [profile]);

  if (phase === "prompt") {
    return (
      <motion.div
        className="scene-shot flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        <p className="scene-label font-mono text-[var(--zorp-green)] mb-10 tracking-[0.25em]">
          ABDUCTION COMPLETE
        </p>
        <button
          onClick={handleGenerate}
          className="border-2 border-[var(--zorp-green)] px-12 py-5 font-mono scene-label tracking-[0.2em] text-[var(--zorp-green)] hover:bg-[rgba(57,255,20,0.08)] transition-colors cursor-pointer"
        >
          GENERATE ABDUCTION RECORD
        </button>
      </motion.div>
    );
  }

  const showFrame = revealStep !== "generating";
  const showCharacter = ["character", "data", "idLock", "sealed"].includes(revealStep);
  const showData = ["data", "idLock", "sealed"].includes(revealStep);
  const idLocked = ["idLock", "sealed"].includes(revealStep);

  const barValues = [
    profile.intelligence,
    profile.greed,
    profile.memeResistance,
    profile.cosmicCompatibility,
  ];

  return (
    <motion.div
      className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-black flex flex-col items-center px-4 pt-[4vh] pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "brightness(0.3)", transition: { duration: 0.6 } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)] pointer-events-none z-[1]" />

      <AnimatePresence mode="wait">
        {revealStep === "generating" && (
          <motion.p
            key="gen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="scene-label font-mono text-[var(--zorp-green)] z-10 mb-6"
          >
            GENERATING RECORD...
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10"
        style={{
          height: "min(82vh, 900px)",
          width: "auto",
          aspectRatio: "1 / 1",
          maxWidth: "min(92vw, 900px)",
        }}
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{
          opacity: showFrame ? 1 : 0,
          scale: showFrame ? 1 : 0.82,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {showFrame && (
          <Image
            src={SCENE_ASSETS.abductionRecordFrame}
            alt="Abduction Record"
            fill
            className="object-contain"
            sizes="900px"
            draggable={false}
            priority
          />
        )}

        {/* Character — clipped to left portrait opening only */}
        {showCharacter && (
          <motion.div
            className="absolute overflow-hidden z-[5]"
            style={regionStyle(RECORD_FRAME.portrait)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={profile.assignedCharacter.image}
              alt={profile.assignedCharacter.designation}
              fill
              className="object-contain object-bottom"
              sizes="300px"
              draggable={false}
            />
          </motion.div>
        )}

        {/* Dynamic values only — labels already exist on the frame */}
        {showData && (
          <div className="absolute inset-0 z-[6] pointer-events-none font-mono">
            {visibleRows >= 1 && (
              <div
                className="absolute flex items-center px-2"
                style={regionStyle(RECORD_FRAME.human)}
              >
                <span className="text-[clamp(10px,1.6vw,18px)] text-[var(--zorp-green)] truncate w-full">
                  {formatHandleDisplay(profile.handle)}
                </span>
              </div>
            )}

            {RECORD_FRAME.bars.map((bar, i) => {
              const value = barValues[i]!;
              const show = visibleRows >= i + 2;
              if (!show) return null;
              const trackW = bar.trackRight - bar.trackLeft;
              return (
                <div key={bar.key}>
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      left: `${bar.trackLeft * 100}%`,
                      top: `${bar.y * 100}%`,
                      width: `${trackW * 100}%`,
                      height: `${bar.h * 100}%`,
                      background: "rgba(0, 20, 8, 0.85)",
                    }}
                  >
                    <motion.div
                      className="h-full bg-[var(--zorp-green)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                  <div
                    className="absolute flex items-center justify-end"
                    style={{
                      left: `${bar.pctX * 100}%`,
                      top: `${bar.y * 100}%`,
                      width: "6%",
                      height: `${bar.h * 100}%`,
                    }}
                  >
                    <span className="text-[clamp(9px,1.2vw,14px)] text-[var(--zorp-green)]">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}

            {visibleRows >= 6 && (
              <div
                className="absolute flex items-center px-2"
                style={regionStyle(RECORD_FRAME.subjectClass)}
              >
                <span className="text-[clamp(9px,1.3vw,15px)] text-[var(--zorp-green)] truncate w-full">
                  {profile.classification}
                </span>
              </div>
            )}

            {visibleRows >= 6 && (
              <div
                className="absolute flex items-center px-2"
                style={regionStyle(RECORD_FRAME.company)}
              >
                <span className="text-[clamp(9px,1.3vw,15px)] text-[var(--zorp-green)] truncate w-full">
                  {profile.company.name} ({profile.company.ticker})
                </span>
              </div>
            )}

            {visibleRows >= 7 && (
              <div
                className="absolute flex items-center px-2"
                style={regionStyle(RECORD_FRAME.zorpId)}
              >
                <span
                  className={`text-[clamp(9px,1.3vw,15px)] truncate w-full ${
                    idLocked ? "text-[var(--zorp-green)]" : "text-[var(--zorp-green-dim)]"
                  }`}
                >
                  {profile.zorpId}
                </span>
              </div>
            )}
          </div>
        )}

        {revealStep !== "sealed" && showFrame && (
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none z-[8]"
            aria-hidden
          >
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-[var(--zorp-green)]"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 1.2, ease: "linear" }}
            />
          </motion.div>
        )}

        {revealStep === "sealed" && (
          <motion.div
            className="absolute inset-0 bg-[var(--zorp-green)] pointer-events-none z-[8]"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {revealStep === "sealed" && !showActions && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 scene-label font-mono text-[var(--zorp-white)] tracking-[0.3em] z-10"
          >
            RECORD SEALED
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-lg space-y-5 z-10 shrink-0"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                disabled={exporting}
                className="flex-1 border-2 border-[var(--zorp-green)] py-4 font-mono scene-label tracking-[0.12em] text-[var(--zorp-green)] hover:bg-[rgba(57,255,20,0.08)] disabled:opacity-50 cursor-pointer"
              >
                {exporting ? "EXPORTING..." : "SAVE ABDUCTION RECORD"}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 border-2 border-[var(--zorp-green-dim)] py-4 font-mono scene-label tracking-[0.12em] text-[var(--zorp-white)] hover:border-[var(--zorp-green)] cursor-pointer"
              >
                SHARE ON X
              </button>
            </div>
            <button
              onClick={onContinue}
              className="block mx-auto border border-[var(--zorp-green-dim)] px-10 py-3 font-mono scene-eyebrow tracking-[0.2em] text-[var(--zorp-green)] hover:border-[var(--zorp-green)] cursor-pointer"
            >
              CONTINUE TO PLANET ZORP
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
