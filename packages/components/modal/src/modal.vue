<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "@xiaoye/utils";
import { useNamespace, useZIndex } from "@xiaoye/composables";

export interface ModalProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  destroyOnClose?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "",
  width: 560,
  closeOnOverlay: true,
  closeOnEsc: true,
  destroyOnClose: false
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
}>();

const ns = useNamespace("modal");
const { next } = useZIndex();
const dialogRef = ref<HTMLElement | null>(null);
const rendered = ref(props.modelValue);
const zIndex = ref(next());
const titleId = `xy-modal-title-${Math.random().toString(36).slice(2, 10)}`;
const bodyId = `xy-modal-body-${Math.random().toString(36).slice(2, 10)}`;
let lastFocusedElement: HTMLElement | null = null;
const isClient = typeof document !== "undefined";

const dialogStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  zIndex: zIndex.value
}));

function close() {
  emit("update:modelValue", false);
  emit("close");
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close();
  }
}

function getFocusableElements() {
  if (!dialogRef.value) {
    return [];
  }

  return [...dialogRef.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.hasAttribute("disabled"));
}

function focusFirstElement() {
  const [first] = getFocusableElements();

  if (first) {
    first.focus();
    return;
  }

  dialogRef.value?.focus();
}

function restoreFocus() {
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.modelValue) {
    return;
  }

  if (event.key === "Escape" && props.closeOnEsc) {
    event.preventDefault();
    close();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements();

  if (!focusableElements.length) {
    event.preventDefault();
    dialogRef.value?.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const active = isClient ? (document.activeElement as HTMLElement | null) : null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      rendered.value = true;
      zIndex.value = next();
      lastFocusedElement =
        isClient && document.activeElement instanceof HTMLElement ? document.activeElement : null;
      lockBodyScroll();
      if (isClient) {
        document.addEventListener("keydown", handleKeydown);
      }
      emit("open");
      await nextTick();
      focusFirstElement();
      return;
    }

    unlockBodyScroll();
    if (isClient) {
      document.removeEventListener("keydown", handleKeydown);
    }
    await nextTick();
    restoreFocus();

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
  if (isClient) {
    document.removeEventListener("keydown", handleKeydown);
  }
});
</script>

<template>
  <teleport to="body">
    <transition name="xy-fade">
      <div v-if="rendered && props.modelValue" :class="ns.base.value">
        <div class="xy-modal__overlay" @click="handleOverlayClick" />
        <section
          ref="dialogRef"
          :class="`${ns.base.value}__panel`"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="props.title ? titleId : undefined"
          :aria-describedby="bodyId"
          tabindex="-1"
        >
          <header class="xy-modal__header">
            <slot name="header">
              <h3 :id="titleId" class="xy-modal__title">{{ props.title }}</h3>
            </slot>
            <button type="button" class="xy-modal__close" aria-label="close" @click="close">
              ×
            </button>
          </header>
          <div :id="bodyId" class="xy-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="xy-modal__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </transition>
  </teleport>
</template>
