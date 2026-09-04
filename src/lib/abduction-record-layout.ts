/**
 * Layout regions for abduction-record-frame.png (square asset).
 * Values are fractions of the frame's width/height (0–1).
 * Preview and export MUST use the same regions.
 */
export const RECORD_FRAME = {
  /** Left portrait aperture (inner opening) */
  portrait: {
    left: 0.078,
    top: 0.262,
    width: 0.305,
    height: 0.395,
  },
  /** HUMAN value field (label already on frame) */
  human: {
    left: 0.6,
    top: 0.228,
    width: 0.255,
    height: 0.034,
  },
  /** Progress bar tracks + % value slots (labels/icons/% already on frame) */
  bars: [
    { key: "intelligence" as const, y: 0.388, h: 0.02, trackLeft: 0.642, trackRight: 0.845, pctX: 0.868 },
    { key: "greed" as const, y: 0.421, h: 0.02, trackLeft: 0.642, trackRight: 0.845, pctX: 0.868 },
    { key: "memeResistance" as const, y: 0.454, h: 0.02, trackLeft: 0.642, trackRight: 0.845, pctX: 0.868 },
    { key: "cosmicCompatibility" as const, y: 0.487, h: 0.02, trackLeft: 0.642, trackRight: 0.845, pctX: 0.868 },
  ],
  /** Empty value boxes (labels already on frame) */
  subjectClass: {
    left: 0.6,
    top: 0.533,
    width: 0.255,
    height: 0.03,
  },
  company: {
    left: 0.6,
    top: 0.573,
    width: 0.255,
    height: 0.03,
  },
  zorpId: {
    left: 0.6,
    top: 0.658,
    width: 0.255,
    height: 0.032,
  },
} as const;

export type RecordBarKey = (typeof RECORD_FRAME.bars)[number]["key"];
