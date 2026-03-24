<script setup lang="ts">
import { computed, ref } from "vue";
import { useDismissibleLayer, useFocusTrap, useNamespace } from "@xiaoye/composables";
import { useDialog } from "./use-dialog";

export interface ModalProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  closeOnOverlay?: boolean;
  closeOnClickModal?: boolean;
  closeOnEsc?: boolean;
  closeOnPressEscape?: boolean;
  destroyOnClose?: boolean;
  showClose?: boolean;
  lockScroll?: boolean;
  withHeader?: boolean;
  beforeClose?: (done: (cancel?: boolean) => void) => void | Promise<void>;
  appendToBody?: boolean;
  appendTo?: string | HTMLElement;
  modal?: boolean;
  modalClass?: string;
  modalPenetrable?: boolean;
  openDelay?: number;
  closeDelay?: number;
}

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "",
  width: 560,
  closeOnOverlay: true,
  closeOnEsc: true,
  destroyOnClose: false,
  showClose: true,
  lockScroll: true,
  withHeader: true,
  appendToBody: true,
  appendTo: "body",
  modal: true,
  modalClass: "",
  modalPenetrable: false,
  openDelay: 0,
  closeDelay: 0
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  opened: [];
  close: [];
  closed: [];
}>();

const ns = useNamespace("modal");
const dialogRef = ref<HTMLElement | null>(null);
const titleId = `xy-modal-title-${Math.random().toString(36).slice(2, 10)}`;
const bodyId = `xy-modal-body-${Math.random().toString(36).slice(2, 10)}`;
let isClosing = false;
const allowOverlayClose = computed(() => props.closeOnClickModal ?? props.closeOnOverlay);
const allowEscClose = computed(() => props.closeOnPressEscape ?? props.closeOnEsc);
const modalRootStyle = computed(() => ({
  zIndex: `${zIndex.value}`
}));

const dialogStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width
}));

const {
  appendTo,
  handleAfterEnter,
  handleAfterLeave,
  isPenetrable,
  isTopMost,
  rendered,
  showModal,
  teleportDisabled,
  visible,
  zIndex
} = useDialog(props, {
  onOpen: () => {
    emit("open");
  },
  onClose: () => {
    emit("close");
  },
  onOpened: () => {
    emit("opened");
  },
  onClosed: () => {
    emit("closed");
  }
});

function emitClose() {
  emit("update:modelValue", false);
}

function requestClose() {
  if (isClosing) {
    return;
  }

  if (!props.beforeClose) {
    emitClose();
    return;
  }

  isClosing = true;
  let doneCalled = false;
  const done = (cancel?: boolean) => {
    if (doneCalled) {
      return;
    }

    doneCalled = true;
    isClosing = false;

    if (cancel) {
      return;
    }

    emitClose();
  };

  try {
    const result = props.beforeClose(done);
    if (result && typeof (result as Promise<void>).catch === "function") {
      void (result as Promise<void>).catch(() => {
        isClosing = false;
      });
    }
  } catch {
    isClosing = false;
  }
}

const focusTrap = useFocusTrap(dialogRef, {
  active: () => visible.value,
  autoFocus: "first",
  restoreFocus: true
});

useDismissibleLayer({
  enabled: () => visible.value,
  refs: [dialogRef],
  closeOnEscape: allowEscClose.value,
  closeOnOutside: allowOverlayClose.value,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    requestClose();
  }
});
</script>

<template>
  <teleport :to="appendTo" :disabled="teleportDisabled">
    <transition name="xy-fade" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
      <div
        v-if="rendered"
        v-show="visible"
        :class="[
          ns.base.value,
          props.modalClass,
          !showModal ? 'is-without-mask' : '',
          isPenetrable ? 'is-penetrable' : ''
        ]"
        :style="modalRootStyle"
      >
        <div v-if="showModal" class="xy-modal__overlay" />
        <section
          ref="dialogRef"
          :class="`${ns.base.value}__panel`"
          :style="dialogStyle"
          role="dialog"
          :aria-modal="showModal ? 'true' : 'false'"
          :aria-labelledby="props.withHeader && props.title ? titleId : undefined"
          :aria-label="!props.withHeader && props.title ? props.title : undefined"
          :aria-describedby="bodyId"
          tabindex="-1"
          @keydown.capture="focusTrap.handleKeydown"
        >
          <header v-if="props.withHeader" class="xy-modal__header">
            <slot name="header">
              <h3 :id="titleId" class="xy-modal__title">{{ props.title }}</h3>
            </slot>
            <button
              v-if="props.showClose"
              type="button"
              class="xy-modal__close"
              aria-label="close"
              @click="requestClose"
            >
              ×
            </button>
          </header>
          <div :id="bodyId" :class="['xy-modal__body', props.withHeader ? '' : 'is-without-header']">
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
