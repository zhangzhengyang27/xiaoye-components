import type {
  CarouselAlignment,
  CarouselArrow,
  CarouselContainScroll,
  CarouselDirection,
  CarouselEffect,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselItemProps,
  CarouselProgressPlacement,
  CarouselProps,
  CarouselThumbIndicatorType,
  CarouselThumbPlacement,
  CarouselTrigger,
  CarouselType
} from "xiaoye-components";

const trigger: CarouselTrigger = "hover";
const indicatorPosition: CarouselIndicatorPosition = "outside";
const arrow: CarouselArrow = "always";
const direction: CarouselDirection = "horizontal";
const type: CarouselType = "card";
const effect: CarouselEffect = "slide";
const fadeEffect: CarouselEffect = "fade";
const indicatorType: CarouselIndicatorType = "dot";
const thumbsPlacement: CarouselThumbPlacement = "bottom";
const thumbsPlacementSide: CarouselThumbPlacement = "left";
const thumbsIndicatorType: CarouselThumbIndicatorType = "thumbnail";
const thumbsIndicatorTypeLine: CarouselThumbIndicatorType = "line";
const thumbsIndicatorTypeDot: CarouselThumbIndicatorType = "dot";
const progressPlacement: CarouselProgressPlacement = "indicator";
const progressPlacementTop: CarouselProgressPlacement = "top";
const align: CarouselAlignment = "center";
const alignEnd: CarouselAlignment = "end";
const containScroll: CarouselContainScroll = "trim";
const containScrollKeep: CarouselContainScroll = "keep";

const carouselProps: CarouselProps = {
  activeIndex: 1,
  initialIndex: 1,
  height: "240px",
  trigger,
  autoplay: true,
  interval: 3000,
  indicatorPosition,
  arrow,
  type,
  cardScale: 0.83,
  loop: true,
  direction,
  pauseOnHover: true,
  draggable: true,
  effect,
  duration: 420,
  easing: "ease",
  slidesPerView: 1.2,
  slidesPerGroup: 1,
  gap: 16,
  centered: true,
  indicatorType,
  thumbs: true,
  thumbsPlacement,
  thumbsPerView: 5,
  thumbsGap: 8,
  thumbsIndicatorType,
  showProgress: true,
  progressPlacement,
  progressColor: "#2563eb",
  align,
  containScroll,
  peek: 24,
  lazy: true,
  lazyRange: 1,
  virtual: true,
  virtualBuffer: 1,
  ariaLabel: "主轮播",
  keyboard: true
};

void carouselProps;

void fadeEffect;
void thumbsPlacementSide;
void thumbsIndicatorTypeLine;
void thumbsIndicatorTypeDot;
void progressPlacementTop;
void alignEnd;
void containScrollKeep;

const carouselVariantProps: CarouselProps = {
  effect: fadeEffect,
  gap: "1rem",
  thumbsPlacement: thumbsPlacementSide,
  thumbsGap: "12px",
  thumbsIndicatorType: thumbsIndicatorTypeDot,
  progressPlacement: progressPlacementTop,
  align: alignEnd,
  containScroll: containScrollKeep,
  peek: "24px"
};

void carouselVariantProps;

const itemProps: CarouselItemProps = {
  name: "hero",
  label: "首页",
  duration: 5000,
  autoplayDisabled: false
};

void itemProps;

const autoplayDisabledItemProps: CarouselItemProps = {
  autoplayDisabled: true
};

void autoplayDisabledItemProps;

const invalidTrigger: CarouselProps = {
  // @ts-expect-error invalid trigger should be rejected
  trigger: "focus"
};

void invalidTrigger;

const invalidDirection: CarouselProps = {
  // @ts-expect-error invalid direction should be rejected
  direction: "diagonal"
};

void invalidDirection;

const invalidEffect: CarouselProps = {
  // @ts-expect-error invalid effect should be rejected
  effect: "zoom"
};

void invalidEffect;

const invalidIndicatorType: CarouselProps = {
  // @ts-expect-error invalid indicatorType should be rejected
  indicatorType: "label"
};

void invalidIndicatorType;

const invalidThumbsPlacement: CarouselProps = {
  // @ts-expect-error invalid thumbsPlacement should be rejected
  thumbsPlacement: "center"
};

void invalidThumbsPlacement;

const invalidThumbsIndicatorType: CarouselProps = {
  // @ts-expect-error invalid thumbsIndicatorType should be rejected
  thumbsIndicatorType: "pill"
};

void invalidThumbsIndicatorType;

const invalidProgressPlacement: CarouselProps = {
  // @ts-expect-error invalid progressPlacement should be rejected
  progressPlacement: "left"
};

void invalidProgressPlacement;

const invalidAlign: CarouselProps = {
  // @ts-expect-error invalid align should be rejected
  align: "between"
};

void invalidAlign;

const invalidContainScroll: CarouselProps = {
  // @ts-expect-error invalid containScroll should be rejected
  containScroll: "snap"
};

void invalidContainScroll;
