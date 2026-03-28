import { normalizeFontSize, normalizeFontStyle } from "./utils";
import type { WatermarkProps } from "./watermark";

const TEXT_ALIGN_RATIO_MAP = {
  left: [0, 0.5],
  start: [0, 0.5],
  center: [0.5, 0],
  right: [1, -0.5],
  end: [1, -0.5]
} as const;

function prepareCanvas(
  width: number,
  height: number,
  ratio = 1
): [
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  realWidth: number,
  realHeight: number
] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const realWidth = width * ratio;
  const realHeight = height * ratio;

  canvas.width = Math.ceil(realWidth);
  canvas.height = Math.ceil(realHeight);
  ctx.save();

  return [ctx, canvas, realWidth, realHeight];
}

function isImageLike(value: unknown): value is HTMLImageElement {
  if (typeof HTMLImageElement !== "undefined" && value instanceof HTMLImageElement) {
    return true;
  }

  return (
    typeof value === "object" &&
    value !== null &&
    "src" in value &&
    typeof (value as { src?: unknown }).src === "string"
  );
}

export default function useClips() {
  function getClips(
    content: NonNullable<WatermarkProps["content"]> | HTMLImageElement,
    rotate: number,
    ratio: number,
    width: number,
    height: number,
    font: Required<NonNullable<WatermarkProps["font"]>>,
    gapX: number,
    gapY: number,
    space: number
  ): [dataURL: string, finalWidth: number, finalHeight: number] {
    const [ctx, canvas, contentWidth, contentHeight] = prepareCanvas(width, height, ratio);
    let baselineOffset = 0;

    if (isImageLike(content)) {
      ctx.drawImage(content, 0, 0, contentWidth, contentHeight);
    } else {
      const {
        color,
        fontSize,
        fontStyle,
        fontWeight,
        fontFamily,
        textAlign,
        textBaseline
      } = font;
      const mergedFontSize = normalizeFontSize(fontSize, 16) * ratio;

      ctx.font = `${normalizeFontStyle(fontStyle)} normal ${fontWeight} ${mergedFontSize}px/${height}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;

      const contents = Array.isArray(content) ? content : [content];

      if (textBaseline !== "top" && contents[0]) {
        const argumentMetrics = ctx.measureText(contents[0]);
        ctx.textBaseline = "top";
        const topMetrics = ctx.measureText(contents[0]);

        baselineOffset =
          argumentMetrics.actualBoundingBoxAscent - topMetrics.actualBoundingBoxAscent;
      }

      contents.forEach((item, index) => {
        const [alignRatio, spaceRatio] = TEXT_ALIGN_RATIO_MAP[textAlign];

        ctx.fillText(
          item ?? "",
          contentWidth * alignRatio + space * spaceRatio,
          index * (mergedFontSize + font.fontGap * ratio)
        );
      });
    }

    const angle = (Math.PI / 180) * Number(rotate);
    const maxSize = Math.max(width, height);
    const [rotatedCtx, rotatedCanvas, realMaxSize] = prepareCanvas(maxSize, maxSize, ratio);

    rotatedCtx.translate(realMaxSize / 2, realMaxSize / 2);
    rotatedCtx.rotate(angle);

    if (contentWidth > 0 && contentHeight > 0) {
      rotatedCtx.drawImage(canvas, -contentWidth / 2, -contentHeight / 2);
    }

    function getRotatePos(x: number, y: number) {
      const targetX = x * Math.cos(angle) - y * Math.sin(angle);
      const targetY = x * Math.sin(angle) + y * Math.cos(angle);

      return [targetX, targetY];
    }

    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;

    const halfWidth = contentWidth / 2;
    const halfHeight = contentHeight / 2;
    const points = [
      [0 - halfWidth, 0 - halfHeight],
      [0 + halfWidth, 0 - halfHeight],
      [0 + halfWidth, 0 + halfHeight],
      [0 - halfWidth, 0 + halfHeight]
    ] as const;

    points.forEach(([x, y]) => {
      const [targetX, targetY] = getRotatePos(x, y);

      left = Math.min(left, targetX);
      right = Math.max(right, targetX);
      top = Math.min(top, targetY);
      bottom = Math.max(bottom, targetY);
    });

    const cutLeft = left + realMaxSize / 2;
    const cutTop = top + realMaxSize / 2;
    const cutWidth = right - left;
    const cutHeight = bottom - top;

    const realGapX = gapX * ratio;
    const realGapY = gapY * ratio;
    const filledWidth = (cutWidth + realGapX) * 2;
    const filledHeight = cutHeight + realGapY;
    const [filledCtx, filledCanvas] = prepareCanvas(filledWidth, filledHeight);

    function drawImg(targetX = 0, targetY = 0) {
      filledCtx.drawImage(
        rotatedCanvas,
        cutLeft,
        cutTop,
        cutWidth,
        cutHeight,
        targetX,
        targetY + baselineOffset,
        cutWidth,
        cutHeight
      );
    }

    drawImg();
    drawImg(cutWidth + realGapX, -cutHeight / 2 - realGapY / 2);
    drawImg(cutWidth + realGapX, cutHeight / 2 + realGapY / 2);

    return [filledCanvas.toDataURL(), filledWidth / ratio, filledHeight / ratio];
  }

  return getClips;
}
