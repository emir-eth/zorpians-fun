import { getZorpianByIndex, type Zorpian } from "./zorpians";

const HANDLE_KEY = "zorp_handle";

export function fnv1a(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function normalizeHandle(raw: string): string {
  const trimmed = raw.trim().replace(/^@+/, "");
  const sanitized = trimmed.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 32);
  return sanitized.toLowerCase();
}

export function isValidHandle(handle: string): boolean {
  return normalizeHandle(handle).length > 0;
}

export function assignCharacterIndex(handle: string): number {
  const normalized = normalizeHandle(handle);
  return fnv1a(normalized) % 20;
}

export function assignCharacter(handle: string): Zorpian {
  return getZorpianByIndex(assignCharacterIndex(handle));
}

export function generateZorpId(handle: string): string {
  const normalized = normalizeHandle(handle);
  const h1 = fnv1a(normalized);
  const h2 = fnv1a(`${normalized}:zorp-id`);
  const part1 = (h1 & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  const part2 = (h2 & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  return `ZRP-${part1}-${part2}`;
}

export function saveHandle(handle: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(HANDLE_KEY, normalizeHandle(handle));
}

export function loadHandle(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(HANDLE_KEY);
}

export function formatHandleDisplay(handle: string): string {
  const normalized = normalizeHandle(handle);
  return normalized ? `@${normalized}` : "";
}
