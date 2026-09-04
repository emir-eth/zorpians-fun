import type { HumanProfile } from "./profile";
import { formatHandleDisplay } from "./identity";
import { SCENE_ASSETS } from "./scene-assets";
import { RECORD_FRAME } from "./abduction-record-layout";

const EXPORT_SIZE = 2160;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
) {
  const aspect = img.width / img.height;
  let drawW = boxW;
  let drawH = boxH;
  if (aspect > boxW / boxH) drawH = boxW / aspect;
  else drawW = boxH * aspect;
  const drawX = boxX + (boxW - drawW) / 2;
  const drawY = boxY + (boxH - drawH);
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function region(
  size: number,
  r: { left: number; top: number; width: number; height: number },
) {
  return {
    x: r.left * size,
    y: r.top * size,
    w: r.width * size,
    h: r.height * size,
  };
}

function drawFieldValue(
  ctx: CanvasRenderingContext2D,
  text: string,
  r: { left: number; top: number; width: number; height: number },
  size: number,
  color: string,
) {
  const box = region(size, r);
  const fontSize = Math.min(34, box.h * 0.72);
  ctx.font = `500 ${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.w, box.h);
  ctx.clip();
  ctx.fillText(text, box.x + 8, box.y + box.h / 2);
  ctx.restore();
}

export async function exportAbductionRecord(
  profile: HumanProfile,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_SIZE;
  canvas.height = EXPORT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const green = "#39ff14";
  const size = EXPORT_SIZE;

  // 1. Background
  ctx.fillStyle = "#040404";
  ctx.fillRect(0, 0, size, size);

  // 2. Character first (behind frame), clipped to portrait aperture
  const character = await loadImage(profile.assignedCharacter.image);
  const portrait = region(size, RECORD_FRAME.portrait);
  ctx.save();
  ctx.beginPath();
  ctx.rect(portrait.x, portrait.y, portrait.w, portrait.h);
  ctx.clip();
  drawContainedImage(ctx, character, portrait.x, portrait.y, portrait.w, portrait.h);
  ctx.restore();

  // 3. Frame on top (transparent portrait hole reveals character)
  const frame = await loadImage(SCENE_ASSETS.abductionRecordFrame);
  ctx.drawImage(frame, 0, 0, size, size);

  // 4. Dynamic values only — do not redraw frame labels / STATUS / SPECIES / footer
  drawFieldValue(ctx, formatHandleDisplay(profile.handle), RECORD_FRAME.human, size, green);

  const barValues = [
    profile.intelligence,
    profile.greed,
    profile.memeResistance,
    profile.cosmicCompatibility,
  ];

  RECORD_FRAME.bars.forEach((bar, i) => {
    const value = barValues[i]!;
    const trackX = bar.trackLeft * size;
    const trackY = bar.y * size;
    const trackW = (bar.trackRight - bar.trackLeft) * size;
    const trackH = bar.h * size;

    ctx.fillStyle = "rgba(0, 20, 8, 0.9)";
    ctx.fillRect(trackX, trackY, trackW, trackH);
    ctx.fillStyle = green;
    ctx.fillRect(trackX, trackY, trackW * (value / 100), trackH);

    ctx.font = `500 ${Math.min(28, trackH * 0.95)}px "Courier New", monospace`;
    ctx.fillStyle = green;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), bar.pctX * size + size * 0.045, trackY + trackH / 2);
  });

  drawFieldValue(ctx, profile.classification, RECORD_FRAME.subjectClass, size, green);
  drawFieldValue(
    ctx,
    `${profile.company.name} (${profile.company.ticker})`,
    RECORD_FRAME.company,
    size,
    green,
  );
  drawFieldValue(ctx, profile.zorpId, RECORD_FRAME.zorpId, size, green);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export record"));
      },
      "image/png",
      1,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildAbductionShareUrl(profile: HumanProfile): string {
  const text = [
    "I was abducted by Planet Zorp.",
    "",
    `Cosmic Compatibility: ${profile.cosmicCompatibility}%`,
    `Classification: ${profile.classification}`,
    `Simulated Company: ${profile.company.name}`,
    "",
    `Zorp ID: ${profile.zorpId}`,
    "",
    "@zorpians",
  ].join("\n");

  return `https://x.com/intent/tweet?${new URLSearchParams({ text }).toString()}`;
}
