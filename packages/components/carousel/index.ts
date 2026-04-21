import Carousel from "./src/carousel.vue";
import CarouselItem from "./src/carousel-item.vue";
import type {
  CarouselActiveIndexChangeHandler,
  CarouselAlignment,
  CarouselArrow,
  CarouselArrowSlotProps,
  CarouselChangeHandler,
  CarouselContainScroll,
  CarouselDirection,
  CarouselEffect,
  CarouselIndicatorSlotProps,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselProgressPlacement,
  CarouselProgressSlotProps,
  CarouselInstance,
  CarouselProps,
  CarouselThumbSlotItem,
  CarouselThumbSlotProps,
  CarouselThumbIndicatorType,
  CarouselThumbPlacement,
  CarouselTrigger,
  CarouselType
} from "./src/carousel";
import type { CarouselItemProps } from "./src/carousel-item";
import { withInstall } from "@xiaoye/primitives";

export type {
  CarouselActiveIndexChangeHandler,
  CarouselAlignment,
  CarouselArrow,
  CarouselArrowSlotProps,
  CarouselChangeHandler,
  CarouselContainScroll,
  CarouselDirection,
  CarouselEffect,
  CarouselIndicatorSlotProps,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselItemProps,
  CarouselProgressPlacement,
  CarouselProgressSlotProps,
  CarouselInstance,
  CarouselProps,
  CarouselThumbSlotItem,
  CarouselThumbSlotProps,
  CarouselThumbIndicatorType,
  CarouselThumbPlacement,
  CarouselTrigger,
  CarouselType
};

export const XyCarousel = withInstall(Carousel, "xy-carousel");
export const XyCarouselItem = withInstall(CarouselItem, "xy-carousel-item");
export default XyCarousel;
