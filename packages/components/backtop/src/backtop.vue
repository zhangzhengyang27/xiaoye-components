<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { BacktopProps } from "./backtop";

type ScrollContainer = HTMLElement | Window;

defineOptions({
  name: "XyBacktop"
});

const props = withDefaults(defineProps<BacktopProps>(), {
  visibilityHeight: 200,
  target: "",
  right: 40,
  bottom: 40
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const ns = useNamespace("backtop");
const visible = ref(false);
const targetRef = shallowRef<HTMLElement | null>(null);
const listenerTarget = shallowRef<ScrollContainer | null>(null);

let removeScrollListener: (() => void) | null = null;

const backtopStyle = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`
}));

function isElementContainer(value: ScrollContainer | null): value is HTMLElement {
  return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}

function getScrollTop(container: ScrollContainer | null) {
  if (!container) {
    return 0;
  }

  if (isElementContainer(container)) {
    return container.scrollTop;
  }

  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function updateVisible() {
  visible.value = getScrollTop(targetRef.value ?? listenerTarget.value) >= props.visibilityHeight;
}

function disconnectScrollListener() {
  removeScrollListener?.();
  removeScrollListener = null;
}

function resolveTarget() {
  if (props.target) {
    const element = document.querySelector<HTMLElement>(props.target);

    if (!element) {
      throw new Error(`[XyBacktop] target does not exist: ${props.target}`);
    }

    targetRef.value = element;
    listenerTarget.value = element;
    return;
  }

  targetRef.value = document.documentElement;
  listenerTarget.value = window;
}

function reconnectScrollListener() {
  disconnectScrollListener();

  if (!listenerTarget.value) {
    return;
  }

  const target = listenerTarget.value;
  const handler = () => {
    updateVisible();
  };

  target.addEventListener("scroll", handler, {
    passive: true
  });

  removeScrollListener = () => {
    target.removeEventListener("scroll", handler);
  };
}

function scrollToTop() {
  if (listenerTarget.value === window) {
    if (typeof window.scrollTo === "function") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    document.documentElement.scrollTop = 0;
    return;
  }

  if (isElementContainer(targetRef.value)) {
    if (typeof targetRef.value.scrollTo === "function") {
      targetRef.value.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    targetRef.value.scrollTop = 0;
    return;
  }
}

function handleClick(event: MouseEvent) {
  scrollToTop();
  emit("click", event);
}

watch(
  () => props.target,
  () => {
    if (typeof window === "undefined") {
      return;
    }

    resolveTarget();
    reconnectScrollListener();
    updateVisible();
  }
);

watch(
  () => props.visibilityHeight,
  () => {
    updateVisible();
  }
);

onMounted(() => {
  resolveTarget();
  reconnectScrollListener();
  updateVisible();
});

onBeforeUnmount(() => {
  disconnectScrollListener();
});
</script>

<template>
  <transition name="xy-fade">
    <button
      v-if="visible"
      type="button"
      :class="ns.base.value"
      :style="backtopStyle"
      aria-label="回到顶部"
      @click.stop="handleClick"
    >
      <slot>
        <span :class="`${ns.base.value}__icon`">
          <XyIcon icon="mdi:chevron-up" :size="20" />
        </span>
      </slot>
    </button>
  </transition>
</template>
