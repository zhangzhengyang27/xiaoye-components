<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { BacktopProps, BacktopEmits } from "./backtop";

const props = withDefaults(defineProps<BacktopProps>(), {
  visibilityHeight: 200,
  right: 24,
  bottom: 40,
  duration: 400
});

const emit = defineEmits<BacktopEmits>();

const ns = "xyu-backtop";
const visible = ref(false);
let ticking = false;

function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function scrollToTop() {
  const start = getScrollTop();
  const startTime = performance.now();
  const duration = props.duration;

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, start * (1 - ease));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
  emit("click", new MouseEvent("click"));
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      visible.value = getScrollTop() >= (props.visibilityHeight ?? 200);
      ticking = false;
    });
    ticking = true;
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});

const slots = defineSlots<{ default?: () => unknown }>();
</script>

<template>
  <transition name="xyu-backtop-fade">
    <div
      v-show="visible"
      :class="ns"
      :style="{ right: `${props.right}px`, bottom: `${props.bottom}px` }"
      @click="scrollToTop"
    >
      <slot>
        <div :class="`${ns}__default`">↑</div>
      </slot>
    </div>
  </transition>
</template>
