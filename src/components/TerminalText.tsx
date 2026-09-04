"use client";

import { motion } from "framer-motion";

interface TerminalTextProps {
  lines: string[];
  delay?: number;
  lineDelay?: number;
  className?: string;
  onComplete?: () => void;
}

export function TerminalText({
  lines,
  delay = 0,
  lineDelay = 0.4,
  className = "",
  onComplete,
}: TerminalTextProps) {
  return (
    <div className={`font-mono text-sm text-[var(--zorp-green)] ${className}`}>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * lineDelay, duration: 0.15 }}
          onAnimationComplete={
            i === lines.length - 1 ? onComplete : undefined
          }
          className="leading-relaxed tracking-wider"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingText({
  text,
  speed = 40,
  className = "",
  onComplete,
}: TypingTextProps) {
  const chars = text.split("");

  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * (1 / speed), duration: 0.05 }}
          onAnimationComplete={
            i === chars.length - 1 ? onComplete : undefined
          }
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
