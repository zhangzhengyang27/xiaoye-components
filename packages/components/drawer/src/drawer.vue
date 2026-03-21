<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "@xiaoye/utils";
import { useDismissibleLayer, useFocusTrap, useOverlayStack, useNamespace } from "@xiaoye/composables";

export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  size?: string | number;
  placement?: "left" | "right";
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  destroyOnClose?: boolean;
}

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: "",
  size: 420,
  placement: "right",
  closeOnOverlay: true,
  closeOnEsc: true,
  destroyOnClose: false
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
}>();

const ns = useNamespace("drawer");
const rendered = ref(props.modelValue);
const panelRef = ref<HTMLElement | null>(null);
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const panelStyle = computed(() => ({
  width: typeof props.size === "number" ? `${props.size}px` : props.size,
  zIndex: `${zIndex.value}`
}));

function closeDrawer() {
  emit("update:modelValue", false);
  emit("close");
}

useFocusTrap(panelRef, {
  active: () => props.modelValue,
  autoFocus: "first",
  restoreFocus: true
});

useDismissibleLayer({
  enabled: () => props.modelValue,
  refs: [panelRef],
  closeOnEscape: props.closeOnEsc,
  closeOnOutside: false,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    closeDrawer();
  }
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      rendered.value = true;
      lockBodyScroll();
      openLayer();
      emit("open");
      return;
    }

    unlockBodyScroll();
    closeLayer();

    if (props.destroyOnClose) {
      rendered.value = false;
    }
  },
  {
    immediate: true
  }
);

onBeforeUnmount(() => {
  unlockBodyScroll();
  closeLayer();
});
</script>

<template>
  <teleport to="body">
    <transition name="xy-fade">
      <div v-if="rendered && props.modelValue" :class="[ns.base.value, `${ns.base.value}--${props.placement}`]">
        <div
          class="xy-drawer__overlay"
          @click="props.closeOnOverlay ? closeDrawer() : undefined"
        />
        <aside
          ref="panelRef"
          :class="`${ns.base.value}__panel`"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <header class="xy-drawer__header">
            <slot name="header">
              <h3 class="xy-drawer__title">{{ props.title }}</h3>
            </slot>
            <button type="button" class="xy-drawer__close" aria-label="close" @click="closeDrawer">
              ×
            </button>
          </header>
          <div class="xy-drawer__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="xy-drawer__footer">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </transition>
  </teleport>
</template>
