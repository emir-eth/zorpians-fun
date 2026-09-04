"use client";

import { motion } from "framer-motion";
import { Database } from "./Database";

interface CrewArchiveProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  onInspect: () => void;
  onBack: () => void;
}

export function CrewArchive({
  selectedIndex,
  onSelect,
  onInspect,
  onBack,
}: CrewArchiveProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <div className="px-6 py-4 border-b border-[var(--zorp-green-dim)] flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-[var(--zorp-green)]">
            CREW ARCHIVE
          </p>
          <p className="font-mono text-[10px] tracking-wider text-[var(--zorp-gray-dim)] mt-1">
            Secondary access {"//"} 20 signals on record
          </p>
        </div>
        <button
          onClick={onBack}
          className="font-mono text-[10px] tracking-widest text-[var(--zorp-gray)] hover:text-[var(--zorp-green)] cursor-pointer"
        >
          {"< RETURN TO PLANET ZORP"}
        </button>
      </div>

      <Database
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onInspect={onInspect}
      />
    </motion.div>
  );
}
