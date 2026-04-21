<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import type { DropdownProps, DropdownMenuItem } from "./dropdown";

const props = withDefaults(defineProps<DropdownProps>(), {
  items: () => [],
  trigger: "hover",
  placement: "bottom",
  disabled: false
});

const emit = defineEmits<{
  select: [key: string];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  menu?: () => unknown;
}>();

const ns = "xyu-dropdown";
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const visible = ref(false);
let hoverTimer: ReturnType<typeof setTimeout> | null = null;

const showMenu = computed(() => visible.value && !props.disabled);

const menuStyle = computed(() => {
  if (!triggerRef.value) return {};
  const rect = triggerRef.value.getBoundingClientRect();
  const placement = props.placement ?? "bottom";
  if (placement === "bottom") {
    return { top: `${rect.bottom + 4}px`, left: `${rect.left}px` };
  }
  if (placement === "top") {
    return { bottom: `${window.innerHeight - rect.top + 4}px`, left: `${rect.left}px` };
  }
  return { top: `${rect.top}px`, left: `${rect.right + 4}px` };
});

function show() {
  if (props.disabled) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  visible.value = true;
}

function hide() {
  if (props.trigger === "hover") {
    hoverTimer = setTimeout(() => {
      visible.value = false;
    }, 150);
  } else {
    visible.value = false;
  }
}

function toggle() {
  visible.value = !visible.value;
}

function selectItem(item: DropdownMenuItem) {
  if (item.disabled) return;
  visible.value = false;
  emit("select", item.key);
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (
    visible.value &&
    triggerRef.value &&
    menuRef.value &&
    !triggerRef.value.contains(target) &&
    !menuRef.value.contains(target)
  ) {
    visible.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside, true);
  if (hoverTimer) clearTimeout(hoverTimer);
});
</script>

<template>
  <div :class="ns" @mouseleave="props.trigger === 'hover' ? hide() : undefined">
    <div
      :ref="(el) => { triggerRef = el as HTMLElement; }"
      :class="`${ns}__trigger`"
      @mouseenter="props.trigger === 'hover' ? show() : undefined"
      @click="props.trigger === 'click' ? toggle() : undefined"
      @contextmenu.prevent="props.trigger === 'contextmenu' ? show() : undefined"
    >
      <slot />
    </div>

    <teleport to="body">
      <transition name="xyu-dropdown">
        <div
          v-if="showMenu"
          :ref="(el) => { menuRef = el as HTMLElement; }"
          :class="`${ns}__menu`"
          :style="menuStyle"
          @mouseenter="show"
          @mouseleave="props.trigger === 'hover' ? hide() : undefined"
        >
          <slot name="menu">
            <div
              v-for="item in props.items"
              :key="item.key"
              :class="[
                `${ns}__item`,
                item.disabled ? 'is-disabled' : '',
                item.divided ? 'is-divided' : ''
              ]"
              @click="selectItem(item)"
            >
              {{ item.label }}
            </div>
          </slot>
        </div>
      </transition>
    </teleport>
  </div>
</template>
