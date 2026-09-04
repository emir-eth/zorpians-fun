"use client";

import { motion } from "framer-motion";

interface DiagnosticHUDProps {
  signal: string;
  designation: string;
  status: string;
  origin: string;
  signalStrength: string;
  classLabel: string;
  side?: "left" | "right";
}

function HudBlock({
  label,
  value,
  align,
}: {
  label: string;
  value: string;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="text-[10px] tracking-[0.2em] text-[var(--zorp-gray)] uppercase">
        {label}
      </p>
      <p className="text-xs tracking-wider text-[var(--zorp-green)]">{value}</p>
    </div>
  );
}

export function DiagnosticHUD({
  signal,
  designation,
  status,
  origin,
  signalStrength,
  classLabel,
  side = "left",
}: DiagnosticHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`hidden md:flex flex-col gap-4 ${
        side === "left" ? "items-start" : "items-end"
      }`}
    >
      <HudBlock label="Signal" value={signal} align={side} />
      <HudBlock label="Designation" value={designation} align={side} />
      <HudBlock label="Status" value={status} align={side} />
      <HudBlock label="Origin" value={origin} align={side} />
      <HudBlock label="Signal Strength" value={signalStrength} align={side} />
      <HudBlock label="Class" value={classLabel} align={side} />
    </motion.div>
  );
}

export function MobileDiagnosticHUD({
  signal,
  designation,
  status,
  signalStrength,
  classLabel,
}: Omit<DiagnosticHUDProps, "side" | "origin">) {
  return (
    <div className="md:hidden grid grid-cols-2 gap-3 px-4 py-3 border border-[var(--zorp-green-dim)] bg-[var(--zorp-graphite)]">
      <HudBlock label="Signal" value={signal} align="left" />
      <HudBlock label="Class" value={classLabel} align="right" />
      <HudBlock label="Designation" value={designation} align="left" />
      <HudBlock label="Status" value={status} align="right" />
      <div className="col-span-2">
        <HudBlock label="Signal Strength" value={signalStrength} align="left" />
      </div>
    </div>
  );
}
