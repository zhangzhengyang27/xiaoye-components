<script setup lang="ts">
import { ref, watch } from "vue";
import type { PopconfirmProps, PopconfirmEmits } from "./popconfirm";

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: "",
  content: "确认执行此操作吗？",
  confirmText: "确定",
  cancelText: "取消",
  icon: "",
  iconType: "warning",
  placement: "top",
  trigger: "click",
  disabled: false,
  confirmButtonType: "primary",
  cancelButtonType: "default",
  persistent: false
});

const emit = defineEmits<PopconfirmEmits>();

const ns = "xyu-popconfirm";
const visible = ref(false);

watch(() => props.disabled, (val) => {
  if (val) visible.value = false;
});

function onConfirm() {
  visible.value = false;
  emit("confirm");
  emit("update:visible", false);
}

function onCancel() {
  visible.value = false;
  emit("cancel");
  emit("update:visible", false);
}

const slots = defineSlots<{
  default?: () => unknown;
  icon?: () => unknown;
}>();
</script>

<template>
  <div :class="ns" @click.stop>
    <div
      :class="`${ns}__trigger`"
      @click="!props.disabled && (visible = !visible)"
    >
      <slot />
    </div>

    <teleport to="body">
      <transition name="xyu-popover">
        <div
          v-if="visible"
          :class="[`xyu-popper`, `${ns}__popper`, `xyu-popper--${props.placement}`]"
          :style="{}"
        >
          <div :class="`${ns}__content`">
            <div :class="`${ns}__text`">
              <div v-if="props.title" :class="`${ns}__title`">
                <span v-if="slots.icon || props.icon" :class="`${ns}__icon`">
                  <slot name="icon">{{ props.icon || "⚠" }}</slot>
                </span>
                {{ props.title }}
              </div>
              <p v-if="props.content" :class="`${ns}__message`">{{ props.content }}</p>
            </div>
            <div :class="`${ns}__actions`">
              <button
                type="button"
                :class="[`${ns}__btn`, `${ns}__btn--cancel`, `xyu-btn--${props.cancelButtonType}`]"
                @click="onCancel"
              >
                {{ props.cancelText }}
              </button>
              <button
                type="button"
                :class="[`${ns}__btn`, `${ns}__btn--confirm`, `xyu-btn--${props.confirmButtonType}`]"
                @click="onConfirm"
              >
                {{ props.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
