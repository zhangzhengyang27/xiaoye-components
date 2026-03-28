<script setup lang="ts">
defineOptions({
  name: "XyAnchor"
});

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch
} from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { anchorContextKey } from "./context";
import type { AnchorContainer, AnchorDirection, AnchorProps } from "./anchor";

type ScrollContainer = HTMLElement | Window;

const props = withDefaults(defineProps<AnchorProps>(), {
  container: null,
  offset: 0,
  bound: 15,
  duration: 300,
  marker: true,
  direction: "vertical",
  syncHash: true
});

const emit = defineEmits<{
  change: [href: string];
  click: [event: MouseEvent, href?: string];
}>();

const ns = useNamespace("anchor");
const anchorRef = ref<HTMLElement | null>(null);
const markerRef = ref<HTMLElement | null>(null);
const containerRef = shallowRef<ScrollContainer | null>(
  typeof window !== "undefined" ? window : null
);
const currentAnchor = ref("");
const markerStyle = ref<CSSProperties>({});
const links = new Map<string, HTMLElement>();

let isScrolling = false;
let currentTargetHref = "";
let clearAnimate: (() => void) | null = null;
let removeScrollListener: (() => void) | null = null;
let resizeHandler: (() => void) | null = null;
let scrollTicking = false;

const direction = computed<AnchorDirection>(() => props.direction);
const rootKls = computed(() => [ns.base.value, `${ns.base.value}--${props.direction}`]);

function isWindowContainer(value: AnchorContainer | undefined): value is Window {
  return typeof window !== "undefined" && value === window;
}

function isElementContainer(value: AnchorContainer | undefined): value is HTMLElement {
  return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}

function resolveElement(value?: string | null) {
  if (!value) {
    return null;
  }

  return document.querySelector<HTMLElement>(value);
}

function resolveContainer(value: AnchorContainer | undefined) {
  if (!value) {
    return window;
  }

  if (typeof value === "string") {
    return resolveElement(value) ?? window;
  }

  if (isWindowContainer(value) || isElementContainer(value)) {
    return value;
  }

  return window;
}

function getScrollTop(container: ScrollContainer) {
  if (isElementContainer(container)) {
    return container.scrollTop;
  }

  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function getMaxScrollTop(container: ScrollContainer) {
  if (isElementContainer(container)) {
    return Math.max(container.scrollHeight - container.clientHeight, 0);
  }

  const doc = document.documentElement;
  const body = document.body;

  return Math.max(Math.max(doc.scrollHeight, body.scrollHeight) - window.innerHeight, 0);
}

function setScrollTop(container: ScrollContainer, top: number) {
  if (isElementContainer(container)) {
    if (typeof container.scrollTo === "function") {
      container.scrollTo({
        top
      });
    } else {
      container.scrollTop = top;
    }

    return;
  }

  window.scrollTo({
    top
  });
}

function getElementByHref(href?: string) {
  if (!href) {
    return null;
  }

  try {
    return document.querySelector<HTMLElement>(decodeURIComponent(href));
  } catch {
    return null;
  }
}

function getOffsetTopDistance(target: HTMLElement, container: ScrollContainer) {
  const targetRect = target.getBoundingClientRect();

  if (isElementContainer(container)) {
    const containerRect = container.getBoundingClientRect();
    return targetRect.top - containerRect.top + container.scrollTop;
  }

  return targetRect.top + getScrollTop(window);
}

function replaceHash(href: string) {
  if (!props.syncHash) {
    return;
  }

  const url = new URL(window.location.href);
  url.hash = href.startsWith("#") ? href : `#${href}`;
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;

  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === nextUrl) {
    return;
  }

  window.history.replaceState(window.history.state, "", nextUrl);
}

function updateCurrentAnchor(href: string) {
  if (currentAnchor.value === href) {
    return;
  }

  currentAnchor.value = href;
  emit("change", href);

  if (href) {
    replaceHash(href);
  }
}

function animateScrollTo(
  container: ScrollContainer,
  from: number,
  to: number,
  duration: number,
  onDone?: () => void
) {
  if (clearAnimate) {
    clearAnimate();
  }

  if (duration <= 0 || Math.abs(to - from) < 1) {
    setScrollTop(container, to);
    isScrolling = false;
    currentTargetHref = "";
    clearAnimate = null;
    onDone?.();
    return;
  }

  const startTime = performance.now();
  let frameId = 0;

  const step = (timestamp: number) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const nextValue = from + (to - from) * eased;

    setScrollTop(container, nextValue);

    if (progress < 1) {
      frameId = window.requestAnimationFrame(step);
      return;
    }

    isScrolling = false;
    currentTargetHref = "";
    clearAnimate = null;
    onDone?.();
  };

  frameId = window.requestAnimationFrame(step);

  clearAnimate = () => {
    window.cancelAnimationFrame(frameId);
    isScrolling = false;
    currentTargetHref = "";
    clearAnimate = null;
  };
}

function updateMarkerStyle() {
  void nextTick(() => {
    if (!props.marker || !anchorRef.value || !markerRef.value || !currentAnchor.value) {
      markerStyle.value = {};
      return;
    }

    const activeLink = links.get(currentAnchor.value);

    if (!activeLink) {
      markerStyle.value = {};
      return;
    }

    const anchorRect = anchorRef.value.getBoundingClientRect();
    const markerRect = markerRef.value.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (props.direction === "horizontal") {
      markerStyle.value = {
        left: `${linkRect.left - anchorRect.left}px`,
        width: `${linkRect.width}px`,
        opacity: 1
      };

      return;
    }

    markerStyle.value = {
      top: `${linkRect.top - anchorRect.top + (linkRect.height - markerRect.height) / 2}px`,
      opacity: 1
    };
  });
}

function getCurrentHref() {
  const container = containerRef.value ?? window;
  const scrollTop = getScrollTop(container);
  const anchors: Array<{ top: number; href: string }> = [];

  for (const href of links.keys()) {
    const target = getElementByHref(href);

    if (!target) {
      continue;
    }

    anchors.push({
      href,
      top: getOffsetTopDistance(target, container) - props.offset - props.bound
    });
  }

  anchors.sort((left, right) => left.top - right.top);

  if (!anchors.length) {
    return "";
  }

  if (scrollTop <= 0) {
    return anchors[0]?.href ?? "";
  }

  for (let index = 0; index < anchors.length; index += 1) {
    const current = anchors[index];
    const next = anchors[index + 1];

    if (current && current.top <= scrollTop && (!next || next.top > scrollTop)) {
      return current.href;
    }
  }

  return anchors.at(-1)?.href ?? "";
}

function handleScroll() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;

  window.requestAnimationFrame(() => {
    scrollTicking = false;

    if (isScrolling) {
      return;
    }

    const nextHref = getCurrentHref();

    if (nextHref) {
      updateCurrentAnchor(nextHref);
    }
  });
}

function connectScrollListener() {
  removeScrollListener?.();
  removeScrollListener = null;

  const target = isElementContainer(containerRef.value) ? containerRef.value : window;
  const listener = () => {
    handleScroll();
  };

  target.addEventListener("scroll", listener, {
    passive: true
  });
  removeScrollListener = () => {
    target.removeEventListener("scroll", listener);
  };
}

function syncContainer() {
  containerRef.value = resolveContainer(props.container);
  connectScrollListener();
}

function scrollTo(href?: string) {
  if (!href) {
    return;
  }

  updateCurrentAnchor(href);

  const target = getElementByHref(href);

  if (!target) {
    return;
  }

  if (clearAnimate && currentTargetHref === href) {
    return;
  }

  const container = containerRef.value ?? window;
  const from = getScrollTop(container);
  const distance = getOffsetTopDistance(target, container);
  const unclampedTop = Math.max(distance - props.offset, 0);
  const maxScrollTop = getMaxScrollTop(container);
  const to = maxScrollTop > 0 ? Math.min(unclampedTop, maxScrollTop) : unclampedTop;

  currentTargetHref = href;
  isScrolling = true;
  animateScrollTo(container, from, to, props.duration, () => {
    handleScroll();
    updateMarkerStyle();
  });
}

function addLink(state: { href: string; el: HTMLElement }) {
  links.set(state.href, state.el);

  if (!currentAnchor.value) {
    const nextHref = getCurrentHref() || state.href;

    if (nextHref) {
      updateCurrentAnchor(nextHref);
    }
  }

  handleScroll();
  updateMarkerStyle();
}

function removeLink(href: string) {
  links.delete(href);

  if (currentAnchor.value === href) {
    const nextHref = getCurrentHref();
    currentAnchor.value = nextHref;
  }

  updateMarkerStyle();
}

function handleClick(event: MouseEvent, href?: string) {
  emit("click", event, href);

  if (!href) {
    return;
  }

  event.preventDefault();
  scrollTo(href);
}

provide(anchorContextKey, {
  direction,
  currentAnchor,
  addLink,
  removeLink,
  handleClick
});

watch(
  () => props.container,
  () => {
    syncContainer();
    handleScroll();
  }
);

watch(
  () => props.direction,
  () => {
    updateMarkerStyle();
  }
);

watch(currentAnchor, () => {
  updateMarkerStyle();
});

watch(
  () => props.syncHash,
  (value) => {
    if (value && currentAnchor.value) {
      replaceHash(currentAnchor.value);
    }
  }
);

onMounted(() => {
  syncContainer();

  const onResize = () => {
    updateMarkerStyle();
  };

  resizeHandler = onResize;
  window.addEventListener("resize", onResize);

  void nextTick(() => {
    if (props.syncHash) {
      const hash = decodeURIComponent(window.location.hash);
      const target = getElementByHref(hash);

      if (hash && target) {
        scrollTo(hash);
        return;
      }
    }

    handleScroll();
  });
});

onBeforeUnmount(() => {
  clearAnimate?.();
  removeScrollListener?.();

  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
});

defineExpose({
  scrollTo
});
</script>

<template>
  <nav ref="anchorRef" :class="rootKls" aria-label="anchor">
    <div
      v-if="props.marker"
      ref="markerRef"
      :class="`${ns.base.value}__marker`"
      :style="markerStyle"
    />

    <div :class="`${ns.base.value}__list`">
      <slot />
    </div>
  </nav>
</template>
