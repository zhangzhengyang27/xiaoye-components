import { h } from "vue";
import {
  XyWatermark,
  type WatermarkFont,
  type WatermarkInstance,
  type WatermarkProps
} from "xiaoye-components";
import { ref } from "vue";

const font: WatermarkFont = {
  color: "rgba(15, 23, 42, 0.14)",
  fontSize: 18,
  fontWeight: 600,
  fontStyle: "italic",
  fontFamily: "Georgia, serif",
  fontGap: 8,
  textAlign: "center",
  textBaseline: "middle"
};

const props: WatermarkProps = {
  content: ["小叶组件库", "Xiaoye Components"],
  image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
  width: 132,
  height: 36,
  rotate: -18,
  zIndex: 10,
  font,
  gap: [120, 96],
  offset: [60, 48],
  disabled: false,
  opacity: 0.5,
  repeat: "repeat-y",
  autoObserve: true,
  fullscreen: false,
  target: "#watermark-target"
};

void props;

const vnode = h(
  XyWatermark,
  {
    content: "Xiaoye Components",
    font
  },
  {
    default: () => "watermark content"
  }
);

void vnode;

const watermarkRef = ref<WatermarkInstance | null>(null);
const latestDataUrl = watermarkRef.value?.getDataUrl() ?? null;
const latestTarget = watermarkRef.value?.getTarget() ?? null;
watermarkRef.value?.rerender();

void latestDataUrl;
void latestTarget;

const invalidContent: WatermarkProps = {
  // @ts-expect-error content should be string or string[]
  content: 1
};

void invalidContent;

const invalidGap: WatermarkProps = {
  // @ts-expect-error gap should be a tuple with two numbers
  gap: [100]
};

void invalidGap;

const invalidOffset: WatermarkProps = {
  // @ts-expect-error offset should be numbers
  offset: ["12", 24]
};

void invalidOffset;

const invalidFont: WatermarkFont = {
  // @ts-expect-error invalid textAlign should be rejected
  textAlign: "justify"
};

void invalidFont;

const invalidRepeat: WatermarkProps = {
  // @ts-expect-error repeat should match supported values
  repeat: "tile"
};

void invalidRepeat;

const invalidOpacity: WatermarkProps = {
  // @ts-expect-error opacity should be a number
  opacity: "0.3"
};

void invalidOpacity;
