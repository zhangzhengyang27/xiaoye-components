import type { CSSProperties } from "vue";
import type { WatermarkProps } from "./watermark";

export function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function getStyleStr(style: CSSProperties) {
  return Object.keys(style)
    .map((key) => `${toLowercaseSeparator(key)}: ${style[key as keyof CSSProperties]};`)
    .join(" ");
}

export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

export function reRendering(mutation: MutationRecord, watermarkElement?: HTMLElement) {
  let shouldRerender = false;

  if (mutation.removedNodes.length > 0 && watermarkElement) {
    shouldRerender = Array.from(mutation.removedNodes).includes(watermarkElement);
  }

  if (mutation.type === "attributes" && mutation.target === watermarkElement) {
    shouldRerender = true;
  }

  return shouldRerender;
}

export function normalizeFontStyle(fontStyle?: string) {
  return fontStyle === "none" || !fontStyle ? "normal" : fontStyle;
}

export function normalizeFontSize(fontSize?: number | string, fallback = 16) {
  if (typeof fontSize === "number" && Number.isFinite(fontSize)) {
    return fontSize;
  }

  if (typeof fontSize === "string") {
    const parsed = Number.parseFloat(fontSize);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function hasWatermarkContent(
  image?: string,
  content?: WatermarkProps["content"]
) {
  if (typeof image === "string" && image.trim().length > 0) {
    return true;
  }

  if (Array.isArray(content)) {
    return content.some((item) => String(item ?? "").trim().length > 0);
  }

  return String(content ?? "").trim().length > 0;
}
