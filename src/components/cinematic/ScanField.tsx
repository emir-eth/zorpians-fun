"use client";

import { motion } from "framer-motion";

interface ScanFieldProps {
  active?: boolean;
  intensity?: "low" | "medium";
}

/** Full-viewport targeting / scan atmosphere */
export function ScanField({ active = true, intensity = "medium" }: ScanFieldProps) {
  if (!active) return null;

  const opacity = intensity === "low" ? 0.35 : 0.55;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Earth coordinate grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: opacity * 0.4,
          backgroundImage: `
            linear-gradient(rgba(57,255,20,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57,255,20,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial scan arc */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--zorp-green)]"
        style={{ width: "min(140vw, 140vh)", height: "min(140vw, 140vh)" }}
        animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--zorp-green-dim)]"
        style={{ width: "min(100vw, 100vh)", height: "min(100vw, 100vh)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Targeting brackets */}
      {[
        "top-8 left-8 border-t border-l",
        "top-8 right-8 border-t border-r",
        "bottom-8 left-8 border-b border-l",
        "bottom-8 right-8 border-b border-r",
      ].map((cls, i) => (
        <motion.div
          key={cls}
          className={`absolute w-16 h-16 md:w-24 md:h-24 ${cls} border-[var(--zorp-green)]`}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Sweeping signal line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-[var(--zorp-green)] shadow-[0_0_20px_rgba(57,255,20,0.8)]"
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        style={{ opacity: opacity * 0.7 }}
      />
    </div>
  );
}

/** Full-width horizontal scan beam for lock-on moments */
export function HorizontalScanBeam({ active = true }: { active?: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden>
      <motion.div
        className="absolute left-0 right-0 h-[3px] bg-[var(--zorp-green)] shadow-[0_0_30px_rgba(57,255,20,0.9)]"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 1.8, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 bg-[var(--zorp-green)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.04, 0] }}
        transition={{ duration: 1.8 }}
      />
    </div>
  );
}
