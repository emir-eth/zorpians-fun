"use client";

import { motion } from "framer-motion";
import { ZORPIANS, formatSignalNumber } from "@/lib/zorpians";
import { ZorpianCarousel } from "./ZorpianViewer";
import { DiagnosticHUD, MobileDiagnosticHUD } from "./DiagnosticHUD";

interface DatabaseProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  onInspect: () => void;
}

export function Database({
  selectedIndex,
  onSelect,
  onInspect,
}: DatabaseProps) {
  const normalizedIndex = ((selectedIndex % 20) + 20) % 20;
  const zorpian = ZORPIANS[normalizedIndex]!;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-6xl mx-auto px-4 py-8"
    >
      <header className="mb-6 text-center md:text-left">
        <h2 className="font-mono text-lg tracking-[0.3em] text-[var(--zorp-white)]">
          ZORPIAN DATABASE
        </h2>
        <p className="mt-1 font-mono text-xs tracking-wider text-[var(--zorp-gray)]">
          20 SIGNALS DETECTED
        </p>
      </header>

      <div className="relative grid md:grid-cols-[180px_1fr_180px] gap-4 items-center">
        <DiagnosticHUD
          signal={`SIGNAL ${formatSignalNumber(zorpian.id)}`}
          designation={zorpian.designation}
          status={zorpian.status}
          origin={zorpian.origin}
          signalStrength={`${zorpian.signalStrength}%`}
          classLabel={zorpian.class}
          side="left"
        />

        <ZorpianCarousel
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onInspect={onInspect}
        />

        <DiagnosticHUD
          signal={`SIGNAL ${formatSignalNumber(zorpian.id)}`}
          designation={zorpian.designation}
          status={zorpian.status}
          origin={zorpian.origin}
          signalStrength={`${zorpian.signalStrength}%`}
          classLabel={zorpian.class}
          side="right"
        />
      </div>

      <MobileDiagnosticHUD
        signal={`SIGNAL ${formatSignalNumber(zorpian.id)}`}
        designation={zorpian.designation}
        status={zorpian.status}
        signalStrength={`${zorpian.signalStrength}%`}
        classLabel={zorpian.class}
      />

      <p className="mt-6 text-center font-mono text-[10px] tracking-wider text-[var(--zorp-gray-dim)]">
        CLICK CENTER SIGNAL TO INSPECT {"//"} SCROLL OR DRAG TO BROWSE
      </p>
    </motion.section>
  );
}
