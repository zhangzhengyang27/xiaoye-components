<template>
  <transition :name="`${ns.base.value}`" v-on="hooks">
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { useNamespace } from "@xiaoye/composables";
import type { RendererElement } from "vue";

defineOptions({
  name: "XyCollapseTransition"
});

const ns = useNamespace("collapse-transition");

function reset(el: RendererElement & { dataset: DOMStringMap }) {
  el.style.maxHeight = "";
  el.style.overflow = el.dataset.oldOverflow ?? "";
}

const hooks = {
  beforeEnter(el: RendererElement & { dataset: DOMStringMap }) {
    el.dataset.oldOverflow = el.style.overflow;
    if (el.style.maxHeight) {
      el.dataset.oldMaxHeight = el.style.maxHeight;
    }

    el.style.maxHeight = "0px";
    el.style.overflow = "hidden";
  },

  enter(el: RendererElement & { dataset: DOMStringMap }) {
    requestAnimationFrame(() => {
      if (el.dataset.oldMaxHeight) {
        el.style.maxHeight = el.dataset.oldMaxHeight;
      } else if (el.scrollHeight > 0) {
        el.style.maxHeight = `${el.scrollHeight}px`;
      } else {
        el.style.maxHeight = "0px";
      }
    });
  },

  afterEnter(el: RendererElement & { dataset: DOMStringMap }) {
    reset(el);
  },

  enterCancelled(el: RendererElement & { dataset: DOMStringMap }) {
    reset(el);
  },

  beforeLeave(el: RendererElement & { dataset: DOMStringMap }) {
    el.dataset.oldOverflow = el.style.overflow;
    el.style.maxHeight = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  },

  leave(el: RendererElement & { dataset: DOMStringMap }) {
    requestAnimationFrame(() => {
      el.style.maxHeight = "0px";
    });
  },

  afterLeave(el: RendererElement & { dataset: DOMStringMap }) {
    reset(el);
  },

  leaveCancelled(el: RendererElement & { dataset: DOMStringMap }) {
    reset(el);
  }
};
</script>
