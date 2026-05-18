export type ImageCrossorigin = "anonymous" | "use-credentials" | "";

export interface ImageViewerProps {
  modelValue?: boolean;
  urlList?: string[];
  initialIndex?: number;
  infinite?: boolean;
  hideOnClickModal?: boolean;
  teleported?: boolean;
  closeOnPressEscape?: boolean;
  zIndex?: number;
  zoomRate?: number;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  showProgress?: boolean;
  crossorigin?: ImageCrossorigin;
}
