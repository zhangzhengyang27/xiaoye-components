import { h } from "vue";
import { XyImage, type ImageFit, type ImageProps, type ImageViewerAction } from "xiaoye-components";

const fit: ImageFit = "cover";

const imageProps: ImageProps = {
  src: "https://example.com/cover.png",
  alt: "cover",
  fit,
  loading: "lazy",
  lazy: true,
  scrollContainer: "#image-scroll",
  previewSrcList: ["https://example.com/1.png", "https://example.com/2.png"],
  previewTeleported: true,
  zIndex: 3200,
  initialIndex: 1,
  infinite: false,
  hideOnClickModal: true,
  closeOnPressEscape: true,
  zoomRate: 1.4,
  scale: 1.1,
  minScale: 0.5,
  maxScale: 4,
  showProgress: true,
  crossorigin: "anonymous"
};

void imageProps;

const action: ImageViewerAction = "zoomIn";
void action;

const vnode = h(
  XyImage,
  {
    src: "https://example.com/demo.png"
  },
  {
    placeholder: () => "loading",
    error: () => "error",
    progress: ({ activeIndex, total }: { activeIndex: number; total: number }) =>
      `${activeIndex}/${total}`,
    "viewer-error": ({ src, retry }: { src: string; retry: () => void }) => {
      retry();
      return src;
    },
    toolbar: ({ actions }: { actions: (value: ImageViewerAction) => void }) => {
      actions("toggleMode");
      return "toolbar";
    }
  }
);

void vnode;

const invalidFit: ImageProps = {
  // @ts-expect-error invalid fit should be rejected
  fit: "crop"
};

void invalidFit;

const invalidPreviewList: ImageProps = {
  // @ts-expect-error previewSrcList should be string[]
  previewSrcList: [1, 2]
};

void invalidPreviewList;

const invalidZoomRate: ImageProps = {
  // @ts-expect-error zoomRate should be a number
  zoomRate: "1.2"
};

void invalidZoomRate;
