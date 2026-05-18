import Image from "./src/image.vue";
import ImageViewer from "./src/image-viewer.vue";
import type {
  ImageCrossorigin,
  ImageErrorHandler,
  ImageFit,
  ImageInstance,
  ImageLoadHandler,
  ImageLoading,
  ImageProps,
  ImageSwitchHandler,
  ImageViewerAction,
  ImageViewerErrorSlotProps,
  ImageViewerInstance,
  ImageViewerProgressSlotProps,
  ImageViewerToolbarSlotProps
} from "./src/image";
import { withInstall } from "@xiaoye/primitives";

export type {
  ImageCrossorigin,
  ImageErrorHandler,
  ImageFit,
  ImageInstance,
  ImageLoadHandler,
  ImageLoading,
  ImageProps,
  ImageSwitchHandler,
  ImageViewerAction,
  ImageViewerErrorSlotProps,
  ImageViewerInstance,
  ImageViewerProgressSlotProps,
  ImageViewerToolbarSlotProps
};

export const XyImage = withInstall(Image, "xy-image");
export const XyImageViewer = withInstall(ImageViewer, "xy-image-viewer");
export default XyImage;
