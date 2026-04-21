export type ImageFit = "fill" | "contain" | "cover" | "none" | "scale-down";

export interface ImageProps {
  src?: string;
  alt?: string;
  fit?: ImageFit;
  width?: string | number;
  height?: string | number;
  lazy?: boolean;
  preview?: boolean;
  previewSrcList?: string[];
  zIndex?: number;
}

export type ImageInstance = InstanceType<import("./image.vue").default>;
