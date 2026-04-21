import { withInstall } from "xiaoye-primitives";
import ImageGallery from "./image-gallery.vue";

export const XyuImageGallery = withInstall(ImageGallery, "XyuImageGallery");

export default XyuImageGallery;
export type { ImageGalleryProps } from "./image-gallery.vue";
