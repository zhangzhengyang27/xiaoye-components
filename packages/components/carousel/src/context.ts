import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { CarouselItemProps } from "./carousel-item";

export interface CarouselItemRegistration {
  uid: number;
  props: CarouselItemProps;
  getEl: () => HTMLElement | null;
}

export interface CarouselContext {
  root: Ref<HTMLElement | null>;
  viewport: Ref<HTMLElement | null>;
  viewportSize: Ref<number>;
  items: Ref<CarouselItemRegistration[]>;
  resolvedActiveIndex: Ref<number>;
  previousIndex: Ref<number>;
  activeIndicatorIndex: Ref<number>;
  isCardType: ComputedRef<boolean>;
  isVertical: ComputedRef<boolean>;
  isFadeEffect: ComputedRef<boolean>;
  loop: ComputedRef<boolean>;
  trigger: ComputedRef<"hover" | "click">;
  cardScale: ComputedRef<number>;
  duration: ComputedRef<number>;
  easing: ComputedRef<string>;
  slidesPerView: ComputedRef<number>;
  slidesPerGroup: ComputedRef<number>;
  centered: ComputedRef<boolean>;
  gapPx: ComputedRef<number>;
  peekPx: ComputedRef<number>;
  dragOffset: Ref<number>;
  dragging: Ref<boolean>;
  lazy: ComputedRef<boolean>;
  virtual: ComputedRef<boolean>;
  renderIndices: ComputedRef<Set<number>>;
  registerItem: (item: CarouselItemRegistration) => void;
  unregisterItem: (uid: number) => void;
  setActiveItem: (index: number | string) => void;
}

export const carouselContextKey: InjectionKey<CarouselContext> = Symbol("xiaoye-carousel");
