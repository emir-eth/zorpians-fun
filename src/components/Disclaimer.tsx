export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`text-center font-mono tracking-wider text-[var(--zorp-gray-dim)] px-4 ${
        compact ? "text-[8px] leading-relaxed" : "text-[9px]"
      }`}
    >
      A community-made interactive experiment inspired by Zorpians. Not
      affiliated with or endorsed by Zorpians.
      {!compact && (
        <>
          {" "}
          Company assignments shown here are simulations only. Final company
          assignment occurs through the official Zorpians mint mechanics.
        </>
      )}
    </p>
  );
}
