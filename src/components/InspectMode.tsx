"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Zorpian } from "@/lib/zorpians";
import { formatSignalNumber } from "@/lib/zorpians";
import { ScanLines } from "./ScanLines";

interface InspectModeProps {
  zorpian: Zorpian;
  onSync: () => void;
  onClose: () => void;
}

export function InspectMode({ zorpian, onSync, onClose }: InspectModeProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 max-w-lg w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-[var(--zorp-green)]">
          INSPECT MODE
        </p>

        <div className="relative w-[min(360px,80vw)] aspect-square">
          <ScanLines active intensity="medium" />
          <DiagnosticLines />

          <Image
            src={zorpian.image}
            alt={zorpian.designation}
            fill
            className="object-contain"
            sizes="360px"
            priority
            draggable={false}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-sm">
          <MetaField label="DESIGNATION" value={zorpian.designation} />
          <MetaField label="CLASS" value={zorpian.class} />
          <MetaField label="SIGNAL" value={formatSignalNumber(zorpian.id)} />
          <MetaField label="STATUS" value={zorpian.status} />
        </div>

        <button
          onClick={onSync}
          className="mt-8 w-full max-w-sm border border-[var(--zorp-green)] py-4 font-mono text-sm tracking-[0.2em] text-[var(--zorp-green)] transition-all hover:bg-[rgba(57,255,20,0.08)] cursor-pointer"
        >
          SYNC WITH SIGNAL
        </button>

        <button
          onClick={onClose}
          className="mt-4 font-mono text-[10px] tracking-widest text-[var(--zorp-gray)] hover:text-[var(--zorp-white)] transition-colors cursor-pointer"
        >
          RETURN TO DATABASE
        </button>
      </motion.div>
    </motion.div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.2em] text-[var(--zorp-gray)]">
        {label}
      </p>
      <p className="text-xs tracking-wider text-[var(--zorp-green)]">{value}</p>
    </div>
  );
}

function DiagnosticLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-[var(--zorp-green)] opacity-20"
          style={{ top: `${20 + i * 20}%`, left: 0, right: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.3, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
