<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { CascaderProps, CascaderEmits, CascaderOption } from "./cascader";
import XyuIcon from "../icon/icon.vue";

defineOptions({ name: "XyuCascader" });

const props = withDefaults(defineProps<CascaderProps>(), {
  modelValue: () => [],
  options: () => [],
  placeholder: "请选择",
  disabled: false,
  clearable: false,
  showAllLevels: true,
  separator: " / ",
  filterable: false,
  collapseTags: false,
  props: () => ({
    expandTrigger: "click",
    multiple: false,
    checkStrictly: false
  })
});

const emit = defineEmits<CascaderEmits>();

const ns = "xyu-cascader";
const visible = ref(false);
const selectedPath = ref<CascaderOption[]>([]);
const activePath = ref<CascaderOption[]>([]);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownTop = ref(0);
const dropdownLeft = ref(0);

function getOption(value: string | number, options: CascaderOption[]): CascaderOption | null {
  for (const opt of options) {
    if (opt.value === value) return opt;
    if (opt.children) {
      const found = getOption(value, opt.children);
      if (found) return found;
    }
  }
  return null;
}

function findPath(target: CascaderOption[], value: string | number, path: CascaderOption[]): boolean {
  for (const opt of target) {
    path.push(opt);
    if (opt.value === value) return true;
    if (opt.children && findPath(opt.children, value, path)) return true;
    path.pop();
  }
  return false;
}

function updatePath(values: (string | number)[]) {
  selectedPath.value = [];
  const path: CascaderOption[] = [];
  for (const val of values) {
    if (findPath(props.options, val, path)) {
      selectedPath.value = [...path];
    }
  }
}

watch(() => props.modelValue, (val) => {
  if (val) updatePath(val);
}, { immediate: true });

const displayText = computed(() => {
  if (!selectedPath.value.length) return "";
  if (props.showAllLevels) {
    return selectedPath.value.map((o) => o.label).join(props.separator);
  }
  return selectedPath.value[selectedPath.value.length - 1]?.label ?? "";
});

const currentOptions = computed(() => {
  if (activePath.value.length === 0) return props.options;
  const last = activePath.value[activePath.value.length - 1];
  return last.children ?? [];
});

const dropdownStyle = computed(() => ({
  top: `${dropdownTop.value}px`,
  left: `${dropdownLeft.value}px`
}));

function updateDropdownPosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  dropdownTop.value = rect.bottom + 4;
  dropdownLeft.value = rect.left;
}

function handleTriggerClick() {
  if (props.disabled) return;
  visible.value = !visible.value;
  if (visible.value) {
    updateDropdownPosition();
  }
}

function handleClick(opt: CascaderOption) {
  if (opt.disabled) return;
  activePath.value.push(opt);
}

function handleBack() {
  activePath.value.pop();
}

function navigateToBreadcrumb(idx: number) {
  activePath.value = activePath.value.slice(0, idx + 1);
}

function handleSelect(opt: CascaderOption) {
  if (opt.disabled) return;
  if (opt.children && opt.children.length > 0) {
    handleClick(opt);
  } else {
    selectedPath.value = [...activePath.value];
    emit("update:modelValue", selectedPath.value.map((o) => o.value));
    emit("change", selectedPath.value.map((o) => o.value));
    visible.value = false;
  }
}

function handleClear(e: Event) {
  e.stopPropagation();
  selectedPath.value = [];
  activePath.value = [];
  emit("update:modelValue", []);
  emit("change", []);
  visible.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (!visible.value) return;
  const target = e.target as Node;
  const el = triggerRef.value;
  if (el && !el.contains(target)) {
    visible.value = false;
    activePath.value = [];
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
});
</script>

<template>
  <div :id="ns" :class="[ns, props.disabled ? 'is-disabled' : '']">
    <div
      ref="triggerRef"
      :class="[`${ns}__control`, visible ? 'is-focus' : '']"
      @click.stop="handleTriggerClick"
    >
      <span :class="`${ns}__input`">
        <span v-if="!displayText" :class="`${ns}__placeholder`">{{ props.placeholder }}</span>
        <span v-else :class="`${ns}__value`">{{ displayText }}</span>
      </span>
      <span v-if="props.clearable && selectedPath.length" :class="`${ns}__clear`" @click.stop="handleClear">
      <XyuIcon icon="mdi:close" :size="12" />
      </span>
      <span v-else :class="`${ns}__arrow`">
      <XyuIcon
        :icon="visible ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        :size="10"
      />
      </span>
    </div>

    <teleport to="body">
      <transition name="xyu-zoom-in-top">
        <div
          v-if="visible"
          :class="[`${ns}__dropdown`, `${ns}__dropdown--${activePath.length || 1}`]"
          :style="dropdownStyle"
        >
          <!-- 面包屑 -->
          <div v-if="activePath.length > 0" :class="`${ns}__breadcrumb`">
            <span
              v-for="(opt, idx) in activePath"
              :key="idx"
              :class="`${ns}__breadcrumb-item`"
              @click="navigateToBreadcrumb(idx)"
            >
              {{ opt.label }}
              <span v-if="idx < activePath.length - 1"> / </span>
            </span>
            <span :class="`${ns}__breadcrumb-item`" @click="handleBack">返回</span>
          </div>

          <!-- 选项列表 -->
          <div :class="`${ns}__options`">
            <div
              v-for="opt in currentOptions"
              :key="String(opt.value)"
              :class="[
                `${ns}__option`,
                opt.disabled ? 'is-disabled' : '',
                selectedPath.some(o => o.value === opt.value) ? 'is-selected' : '',
                opt.children?.length ? 'has-children' : ''
              ]"
              @click="handleSelect(opt)"
            >
              <span>{{ opt.label }}</span>
              <span v-if="opt.children?.length" :class="`${ns}__option-arrow`">
                <XyuIcon icon="mdi:chevron-right" :size="8" />
              </span>
            </div>
            <div v-if="currentOptions.length === 0" :class="`${ns}__empty`">无可选项</div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
