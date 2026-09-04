export type ZorpianClass =
  | "RECON"
  | "PILOT"
  | "SCIENCE"
  | "EXECUTIVE"
  | "CLASSIFIED"
  | "TECHNICAL"
  | "INTELLIGENCE"
  | "NAVIGATION"
  | "DISRUPTION"
  | "COMMS"
  | "SECURITY"
  | "ENGINEERING"
  | "BIOLOGY"
  | "ARCHIVE"
  | "DIPLOMACY"
  | "RESEARCH"
  | "MEDICAL"
  | "AUTOMATION"
  | "SURVEILLANCE"
  | "ELDER";

export interface Zorpian {
  id: number;
  designation: string;
  image: string;
  signalStrength: number;
  origin: string;
  status: "ACTIVE" | "STANDBY" | "CLASSIFIED";
  class: ZorpianClass;
}

export const ZORPIANS: Zorpian[] = [
  {
    id: 1,
    designation: "SCANNER",
    image: "/zorpians/01-scanner.png",
    signalStrength: 97.2,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "RECON",
  },
  {
    id: 2,
    designation: "UFO PILOT",
    image: "/zorpians/02-ufo-pilot.png",
    signalStrength: 99.1,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "PILOT",
  },
  {
    id: 3,
    designation: "SCIENTIST",
    image: "/zorpians/03-scientist.png",
    signalStrength: 96.8,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "SCIENCE",
  },
  {
    id: 4,
    designation: "CORPORATE",
    image: "/zorpians/04-corporate.png",
    signalStrength: 94.5,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "EXECUTIVE",
  },
  {
    id: 5,
    designation: "CLASSIFIED",
    image: "/zorpians/05-classified.png",
    signalStrength: 100.0,
    origin: "RESTRICTED",
    status: "CLASSIFIED",
    class: "CLASSIFIED",
  },
  {
    id: 6,
    designation: "TECHNICIAN",
    image: "/zorpians/06-technician.png",
    signalStrength: 95.3,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "TECHNICAL",
  },
  {
    id: 7,
    designation: "DATA ANALYST",
    image: "/zorpians/07-data-analyst.png",
    signalStrength: 98.7,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "INTELLIGENCE",
  },
  {
    id: 8,
    designation: "NAVIGATOR",
    image: "/zorpians/08-navigator.png",
    signalStrength: 97.9,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "NAVIGATION",
  },
  {
    id: 9,
    designation: "PRANKSTER",
    image: "/zorpians/09-prankster.png",
    signalStrength: 91.4,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "DISRUPTION",
  },
  {
    id: 10,
    designation: "COMMUNICATOR",
    image: "/zorpians/10-communicator.png",
    signalStrength: 98.2,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "COMMS",
  },
  {
    id: 11,
    designation: "SECURITY",
    image: "/zorpians/11-security.png",
    signalStrength: 99.5,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "SECURITY",
  },
  {
    id: 12,
    designation: "ENGINEER",
    image: "/zorpians/12-engineer.png",
    signalStrength: 96.1,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "ENGINEERING",
  },
  {
    id: 13,
    designation: "BOTANIST",
    image: "/zorpians/13-botanist.png",
    signalStrength: 93.8,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "BIOLOGY",
  },
  {
    id: 14,
    designation: "ARCHIVIST",
    image: "/zorpians/14-archivist.png",
    signalStrength: 97.0,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "ARCHIVE",
  },
  {
    id: 15,
    designation: "DIPLOMAT",
    image: "/zorpians/15-diplomat.png",
    signalStrength: 95.7,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "DIPLOMACY",
  },
  {
    id: 16,
    designation: "RESEARCHER",
    image: "/zorpians/16-researcher.png",
    signalStrength: 98.4,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "RESEARCH",
  },
  {
    id: 17,
    designation: "MEDIC",
    image: "/zorpians/17-medic.png",
    signalStrength: 96.6,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "MEDICAL",
  },
  {
    id: 18,
    designation: "REPAIR DRONE",
    image: "/zorpians/18-repair-drone.png",
    signalStrength: 92.9,
    origin: "UNKNOWN",
    status: "STANDBY",
    class: "AUTOMATION",
  },
  {
    id: 19,
    designation: "MONITOR",
    image: "/zorpians/19-monitor.png",
    signalStrength: 99.8,
    origin: "UNKNOWN",
    status: "ACTIVE",
    class: "SURVEILLANCE",
  },
  {
    id: 20,
    designation: "ELDER",
    image: "/zorpians/20-elder.png",
    signalStrength: 100.0,
    origin: "PRIMORDIAL",
    status: "ACTIVE",
    class: "ELDER",
  },
];

export function getZorpianByIndex(index: number): Zorpian {
  const normalized = ((index % 20) + 20) % 20;
  return ZORPIANS[normalized]!;
}

export function formatSignalNumber(id: number): string {
  return String(id).padStart(2, "0");
}
