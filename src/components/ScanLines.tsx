"use client";

interface ScanLinesProps {
  active?: boolean;
  intensity?: "low" | "medium" | "high";
}

export function ScanLines({ active = true, intensity = "low" }: ScanLinesProps) {
  if (!active) return null;

  const opacity =
    intensity === "high" ? 0.25 : intensity === "medium" ? 0.15 : 0.08;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,255,20,${opacity}) 3px, rgba(57,255,20,${opacity}) 4px)`,
        }}
      />
      <div
        className="absolute left-0 right-0 h-px bg-[var(--zorp-green)] opacity-30"
        style={{ animation: "scanline 4s linear infinite" }}
      />
    </div>
  );
}
