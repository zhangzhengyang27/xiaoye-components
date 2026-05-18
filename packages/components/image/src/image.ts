import type Image from "./image.vue";

export const imageFits = ["fill", "contain", "cover", "none", "scale-down"] as const;
export const imageLoadingTypes = ["eager", "lazy"] as const;

export type ImageFit = (typeof imageFits)[number];
export type ImageLoading = (typeof imageLoadingTypes)[number];
export type ImageViewerAction =
  | "zoomIn"
  | "zoomOut"
  | "clockwise"
  | "anticlockwise"
  | "toggleMode";
export type ImageLoadHandler = (event: Event) => void;
export type ImageErrorHandler = (event: Event) => void;
export type ImageSwitchHandler = (index: number) => void;

export interface ImageViewerErrorSlotProps {
  activeIndex: number;
  src: string;
  retry: () => void;
}

export interface ImageViewerProgressSlotProps {
  activeIndex: number;
  total: number;
}

export interface ImageViewerToolbarSlotProps {
  actions: (action: ImageViewerAction) => void;
  prev: () => void;
  next: () => void;
  reset: () => void;
  activeIndex: number;
  setActiveItem: (index: number) => void;
}

export interface ImageProps {
  src?: string;
  alt?: string;
  fit?: ImageFit;
  loading?: ImageLoading;
  lazy?: boolean;
  scrollContainer?: string | HTMLElement;
  previewSrcList?: string[];
  previewTeleported?: boolean;
  zIndex?: number;
  initialIndex?: number;
  infinite?: boolean;
  hideOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  zoomRate?: number;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  showProgress?: boolean;
  crossorigin?: "anonymous" | "use-credentials" | "";
}

export type ImageInstance = InstanceType<typeof Image>;

export type ImageViewerInstance = InstanceType<typeof import("./image-viewer.vue").default>;

export type { ImageViewerProps } from "./image-viewer-types";
export type { ImageCrossorigin } from "./image-viewer-types";
