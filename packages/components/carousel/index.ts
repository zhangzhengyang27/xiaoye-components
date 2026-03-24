import Carousel from "./src/carousel.vue";
import CarouselItem from "./src/carousel-item.vue";
import type {
  CarouselAlignment,
  CarouselArrow,
  CarouselContainScroll,
  CarouselDirection,
  CarouselEffect,
  CarouselIndicatorPosition,
  CarouselIndicatorType,
  CarouselProgressPlacement,
  CarouselProps,
  CarouselThumbIndicatorType,
  CarouselThumbPlacement,
  CarouselTrigger,
  CarouselType
} from "./src/carousel";
import type { CarouselItemProps } from "./src/carousel-item";
import { withInstall } from "@xiaoye/utils";

export type {
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
};

export const XyCarousel = withInstall(Carousel, "xy-carousel");
export const XyCarouselItem = withInstall(CarouselItem, "xy-carousel-item");
export default XyCarousel;
