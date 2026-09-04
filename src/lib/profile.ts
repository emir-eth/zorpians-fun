import {
  fnv1a,
  normalizeHandle,
  generateZorpId,
  assignCharacter,
} from "./identity";
import type { Zorpian } from "./zorpians";

export type Classification =
  | "NORMAL ABDUCTION"
  | "COSMIC ANOMALY"
  | "REPTILIAN SUSPECT"
  | "CLASSIFIED SUBJECT";

export interface CompanyAssignment {
  name: string;
  ticker: string;
}

export interface HumanProfile {
  handle: string;
  intelligence: number;
  greed: number;
  memeResistance: number;
  cosmicCompatibility: number;
  classification: Classification;
  company: CompanyAssignment;
  greyClass: string;
  zorpId: string;
  assignedCharacter: Zorpian;
  scanVerdict: "HUMAN ACCEPTABLE." | "HUMAN BARELY ACCEPTABLE.";
}

export const COMPANIES: CompanyAssignment[] = [
  { name: "SPACEX", ticker: "SPCX" },
  { name: "NVIDIA", ticker: "NVDA" },
  { name: "TESLA", ticker: "TSLA" },
  { name: "PALANTIR", ticker: "PLTR" },
  { name: "COINBASE", ticker: "COIN" },
  { name: "APPLE", ticker: "AAPL" },
  { name: "AMAZON", ticker: "AMZN" },
  { name: "GOOGLE", ticker: "GOOGL" },
  { name: "MICROSOFT", ticker: "MSFT" },
  { name: "INTEL", ticker: "INTC" },
  { name: "AMD", ticker: "AMD" },
  { name: "META", ticker: "META" },
];

function derivePercent(normalized: string, salt: string): number {
  return fnv1a(`${normalized}:${salt}`) % 101;
}

function deriveClassification(normalized: string): Classification {
  const roll = fnv1a(`${normalized}:classification`) % 100;
  if (roll < 70) return "NORMAL ABDUCTION";
  if (roll < 90) return "COSMIC ANOMALY";
  if (roll < 98) return "REPTILIAN SUSPECT";
  return "CLASSIFIED SUBJECT";
}

function deriveGreyClass(normalized: string): string {
  const num = (fnv1a(`${normalized}:grey-class`) % 99) + 1;
  return `GREY-${String(num).padStart(2, "0")}`;
}

function deriveCompany(normalized: string): CompanyAssignment {
  const index = fnv1a(`${normalized}:company`) % COMPANIES.length;
  return COMPANIES[index]!;
}

export function generateHumanProfile(rawHandle: string): HumanProfile {
  const handle = normalizeHandle(rawHandle);
  const cosmicCompatibility = derivePercent(handle, "cosmic");
  const scanVerdict =
    cosmicCompatibility < 15
      ? "HUMAN BARELY ACCEPTABLE."
      : "HUMAN ACCEPTABLE.";

  return {
    handle,
    intelligence: derivePercent(handle, "intelligence"),
    greed: derivePercent(handle, "greed"),
    memeResistance: derivePercent(handle, "meme-resistance"),
    cosmicCompatibility,
    classification: deriveClassification(handle),
    company: deriveCompany(handle),
    greyClass: deriveGreyClass(handle),
    zorpId: generateZorpId(handle),
    assignedCharacter: assignCharacter(handle),
    scanVerdict,
  };
}

export function classificationColor(
  classification: Classification,
): { text: string; border: string; glow: string } {
  switch (classification) {
    case "NORMAL ABDUCTION":
      return {
        text: "var(--zorp-green)",
        border: "var(--zorp-green-dim)",
        glow: "rgba(57, 255, 20, 0.15)",
      };
    case "COSMIC ANOMALY":
      return {
        text: "#00e5cc",
        border: "#0a6b60",
        glow: "rgba(0, 229, 204, 0.15)",
      };
    case "REPTILIAN SUSPECT":
      return {
        text: "#ffb020",
        border: "#6b4a0a",
        glow: "rgba(255, 176, 32, 0.15)",
      };
    case "CLASSIFIED SUBJECT":
      return {
        text: "#b366ff",
        border: "#4a1a6b",
        glow: "rgba(179, 102, 255, 0.2)",
      };
  }
}
