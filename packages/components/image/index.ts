import Image from "./src/image.vue";
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
  ImageViewerProgressSlotProps,
  ImageViewerToolbarSlotProps
} from "./src/image";
import { withInstall } from "@xiaoye/utils";

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
  ImageViewerProgressSlotProps,
  ImageViewerToolbarSlotProps
};

export const XyImage = withInstall(Image, "xy-image");
export default XyImage;
