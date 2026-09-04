"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ZORPIANS, formatSignalNumber, type Zorpian } from "@/lib/zorpians";
import { ScanLines } from "./ScanLines";

interface ZorpianViewerProps {
  zorpian: Zorpian;
  isCenter?: boolean;
  isSide?: boolean;
  onClick?: () => void;
  mouseX?: number;
  mouseY?: number;
}

export function ZorpianViewer({
  zorpian,
  isCenter = false,
  isSide = false,
  onClick,
  mouseX = 0,
  mouseY = 0,
}: ZorpianViewerProps) {
  const reticleOffset = isCenter
    ? {
        x: (mouseX - 0.5) * 12,
        y: (mouseY - 0.5) * 12,
      }
    : { x: 0, y: 0 };

  return (
    <motion.div
      className={`relative flex flex-col items-center ${
        isCenter ? "cursor-pointer" : "pointer-events-none"
      }`}
      animate={{
        scale: isCenter ? 1 : isSide ? 0.55 : 0.35,
        opacity: isCenter ? 1 : isSide ? 0.45 : 0.15,
        filter: isCenter ? "brightness(1)" : "brightness(0.6)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={isCenter ? onClick : undefined}
      role={isCenter ? "button" : undefined}
      tabIndex={isCenter ? 0 : undefined}
      onKeyDown={
        isCenter
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={
        isCenter ? `Inspect ${zorpian.designation}` : zorpian.designation
      }
    >
      <div
        className={`relative ${
          isCenter ? "w-[min(320px,70vw)] md:w-[380px]" : "w-[200px]"
        } aspect-square`}
      >
        {isCenter && (
          <>
            <ScanLines active intensity="low" />
            <Reticle offsetX={reticleOffset.x} offsetY={reticleOffset.y} />
          </>
        )}

        <Image
          src={zorpian.image}
          alt={zorpian.designation}
          fill
          className="object-contain"
          sizes={isCenter ? "380px" : "200px"}
          priority={isCenter}
          draggable={false}
        />

        {isCenter && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 48%, rgba(57,255,20,0.1) 50%, transparent 52%)",
                animation: "scanline 3s linear infinite",
              }}
            />
          </motion.div>
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--zorp-gray)]">
          {formatSignalNumber(zorpian.id)}
        </p>
        <p
          className={`font-mono tracking-wider ${
            isCenter
              ? "text-sm text-[var(--zorp-green)]"
              : "text-[10px] text-[var(--zorp-gray)]"
          }`}
        >
          {zorpian.designation}
        </p>
      </div>
    </motion.div>
  );
}

function Reticle({
  offsetX,
  offsetY,
}: {
  offsetX: number;
  offsetY: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10"
      animate={{ x: offsetX, y: offsetY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="absolute top-2 left-2 h-4 w-4 border-t border-l border-[var(--zorp-green)] opacity-50" />
      <div className="absolute top-2 right-2 h-4 w-4 border-t border-r border-[var(--zorp-green)] opacity-50" />
      <div className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-[var(--zorp-green)] opacity-50" />
      <div className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-[var(--zorp-green)] opacity-50" />
      <div className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-[var(--zorp-green)] opacity-60" />
    </motion.div>
  );
}

interface ZorpianCarouselProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  onInspect: () => void;
}

export function ZorpianCarousel({
  selectedIndex,
  onSelect,
  onInspect,
}: ZorpianCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handlePrev = useCallback(() => {
    onSelect(selectedIndex - 1);
  }, [onSelect, selectedIndex]);

  const handleNext = useCallback(() => {
    onSelect(selectedIndex + 1);
  }, [onSelect, selectedIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) handleNext();
      else handlePrev();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleNext, handlePrev]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const normalizedIndex = ((selectedIndex % 20) + 20) % 20;
  const prevIndex = (normalizedIndex - 1 + 20) % 20;
  const nextIndex = (normalizedIndex + 1) % 20;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-4 md:gap-8 py-8 min-h-[400px] select-none touch-pan-y"
      onMouseMove={handleMouseMove}
      onPointerDown={(e) => {
        dragStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        const diff = e.clientX - dragStart.current;
        if (Math.abs(diff) > 50) {
          if (diff > 0) handlePrev();
          else handleNext();
        }
      }}
    >
      <div className="hidden md:block">
        <ZorpianViewer zorpian={ZORPIANS[prevIndex]!} isSide />
      </div>

      <ZorpianViewer
        zorpian={ZORPIANS[normalizedIndex]!}
        isCenter
        onClick={onInspect}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
      />

      <div className="hidden md:block">
        <ZorpianViewer zorpian={ZORPIANS[nextIndex]!} isSide />
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="font-mono text-xs tracking-widest text-[var(--zorp-gray)] hover:text-[var(--zorp-green)] transition-colors px-4 py-2 border border-transparent hover:border-[var(--zorp-green-dim)] cursor-pointer"
          aria-label="Previous signal"
        >
          {"< PREV"}
        </button>
        <span className="font-mono text-[10px] tracking-widest text-[var(--zorp-gray-dim)]">
          {formatSignalNumber(normalizedIndex + 1)} / 20
        </span>
        <button
          onClick={handleNext}
          className="font-mono text-xs tracking-widest text-[var(--zorp-gray)] hover:text-[var(--zorp-green)] transition-colors px-4 py-2 border border-transparent hover:border-[var(--zorp-green-dim)] cursor-pointer"
          aria-label="Next signal"
        >
          {"NEXT >"}
        </button>
      </div>
    </div>
  );
}
