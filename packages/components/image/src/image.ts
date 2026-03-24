export const imageFits = ["fill", "contain", "cover", "none", "scale-down"] as const;
export const imageLoadingTypes = ["eager", "lazy"] as const;

export type ImageFit = (typeof imageFits)[number];
export type ImageLoading = (typeof imageLoadingTypes)[number];
export type ImageCrossorigin = "anonymous" | "use-credentials" | "";
export type ImageViewerAction =
  | "zoomIn"
  | "zoomOut"
  | "clockwise"
  | "anticlockwise"
  | "toggleMode";

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
  crossorigin?: ImageCrossorigin;
}
