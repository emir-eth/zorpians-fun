"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type HumanProfile, classificationColor } from "@/lib/profile";

interface SubjectClassificationSceneProps {
  profile: HumanProfile;
  onComplete: () => void;
}

function splitClassification(text: string): [string, string] {
  const parts = text.split(" ");
  if (parts.length <= 1) return [text, ""];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

export function SubjectClassificationScene({
  profile,
  onComplete,
}: SubjectClassificationSceneProps) {
  const [revealed, setRevealed] = useState(false);
  const colors = classificationColor(profile.classification);
  const isClassified = profile.classification === "CLASSIFIED SUBJECT";
  const isReptilian = profile.classification === "REPTILIAN SUSPECT";
  const [line1, line2] = splitClassification(profile.classification);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 150);
    const t2 = setTimeout(onComplete, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="scene-shot flex flex-col items-center justify-center bg-black px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        scaleY: [1, 0.02],
        opacity: [1, 0],
        transition: { duration: 0.35, ease: "easeIn" },
      }}
    >
      {isReptilian && revealed && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 0.8, repeat: 2 }}
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,176,32,0.08) 30px, rgba(255,176,32,0.08) 31px)",
          }}
        />
      )}

      {isClassified && revealed && (
        <motion.div
          className="absolute inset-0 bg-red-950/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-eyebrow font-mono text-[var(--zorp-gray)] mb-8 relative z-10"
      >
        SUBJECT CLASSIFICATION
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={revealed ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.25 }}
        className="relative z-10 text-center"
        style={{ color: colors.text }}
      >
        <p className="scene-reveal font-mono font-bold">{line1}</p>
        {line2 && (
          <p className="scene-reveal font-mono font-bold mt-1 md:mt-2">{line2}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
