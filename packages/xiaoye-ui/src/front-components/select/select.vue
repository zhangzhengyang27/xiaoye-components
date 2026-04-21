<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import type { SelectProps, SelectOption } from "./select";
import XyuIcon from "../icon/icon.vue";

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: null,
  options: () => [],
  placeholder: "请选择",
  size: "md",
  disabled: false,
  clearable: false,
  multiple: false,
  collapseTags: false,
  maxTagCount: undefined,
  noDataText: "暂无选项"
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
  change: [value: unknown];
}>();

const slots = defineSlots<{
  options?: () => unknown;
  tag?: (props: { label: string; value: unknown; index: number }) => unknown;
}>();

const ns = "xyu-select";
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const visible = ref(false);
const query = ref("");
const focusedIndex = ref(-1);

const selectedLabels = computed(() => {
  if (props.multiple) {
    const values = props.modelValue as (string | number)[];
    return (values || [])
      .map((v) => {
        const opt = props.options.find((o) => o.value === v);
        return opt ? opt.label : String(v);
      })
      .slice(0, props.maxTagCount ?? undefined);
  }
  const val = props.modelValue as string | number | null;
  if (val == null) return "";
  const opt = props.options.find((o) => o.value === val);
  return opt ? opt.label : String(val);
});

const selectedCount = computed(() => {
  if (!props.multiple) return 0;
  return ((props.modelValue as (string | number)[]) || []).length;
});

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    (props.multiple
      ? ((props.modelValue as unknown[]) || []).length > 0
      : props.modelValue != null)
);

const filteredOptions = computed(() => {
  if (!query.value) return props.options;
  const q = query.value.toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

const dropdownStyle = computed(() => {
  if (!triggerRef.value) return {};
  const rect = triggerRef.value.getBoundingClientRect();
  return {
    minWidth: `${rect.width}px`,
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`
  };
});

function isSelected(value: string | number): boolean {
  if (props.multiple) {
    return ((props.modelValue as (string | number)[]) || []).includes(value);
  }
  return props.modelValue === value;
}

function toggleOption(opt: SelectOption) {
  if (opt.disabled) return;

  if (props.multiple) {
    const values = [...((props.modelValue as (string | number)[]) || [])];
    const idx = values.indexOf(opt.value);
    if (idx > -1) {
      values.splice(idx, 1);
    } else {
      values.push(opt.value);
    }
    emit("update:modelValue", values);
    emit("change", values);
  } else {
    emit("update:modelValue", opt.value);
    emit("change", opt.value);
    closeDropdown();
  }
}

function clearSelected(e: Event) {
  e.stopPropagation();
  emit("update:modelValue", props.multiple ? [] : null);
  emit("change", props.multiple ? [] : null);
}

function openDropdown() {
  if (props.disabled) return;
  visible.value = true;
  query.value = "";
  focusedIndex.value = -1;
  nextTick(() => searchInputRef.value?.focus());
}

function closeDropdown() {
  visible.value = false;
  query.value = "";
}

function toggleDropdown() {
  if (visible.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (
    visible.value &&
    triggerRef.value &&
    dropdownRef.value &&
    !triggerRef.value.contains(target) &&
    !dropdownRef.value.contains(target)
  ) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside, true);
});

function handleKeydown(e: KeyboardEvent) {
  if (!visible.value) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openDropdown();
    }
    return;
  }

  if (e.key === "Escape") {
    closeDropdown();
    triggerRef.value?.focus();
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    focusedIndex.value = Math.min(focusedIndex.value + 1, filteredOptions.value.length - 1);
    scrollToFocused();
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
    scrollToFocused();
    return;
  }

  if (e.key === "Enter" && focusedIndex.value >= 0) {
    e.preventDefault();
    const opt = filteredOptions.value[focusedIndex.value];
    if (opt) toggleOption(opt);
    return;
  }
}

function scrollToFocused() {
  nextTick(() => {
    const el = dropdownRef.value?.querySelector(".is-focused") as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  });
}
</script>

<template>
  <div :class="[ns, props.disabled ? 'is-disabled' : '']">
    <!-- Trigger -->
    <div
      :ref="(el) => { triggerRef = el as HTMLElement; }"
      :class="[`${ns}__trigger`, `${ns}__trigger--${props.size}`]"
      role="combobox"
      :aria-expanded="visible"
      :aria-disabled="props.disabled"
      tabindex="0"
      @click="toggleDropdown"
      @keydown="handleKeydown"
    >
      <!-- Tags for multiple -->
      <template v-if="props.multiple && selectedCount > 0">
        <span
          v-for="(label, idx) in (selectedLabels as string[])"
          :key="idx"
          :class="`${ns}__tag`"
        >
          <slot name="tag" :label="label" :index="idx">
            {{ label }}
          </slot>
        </span>
        <span v-if="selectedCount > (props.maxTagCount ?? Infinity)" :class="`${ns}__tag ${ns}__tag--more`">
          +{{ selectedCount - (props.maxTagCount ?? 0) }}
        </span>
      </template>
      <span v-else-if="selectedLabels" :class="`${ns}__value`">
        {{ selectedLabels }}
      </span>
      <span v-else :class="`${ns}__placeholder`">{{ props.placeholder }}</span>

      <!-- Suffix -->
      <span :class="`${ns}__suffix`">
        <button
          v-if="showClear"
          :class="`${ns}__clear`"
          tabindex="-1"
          type="button"
          @click="clearSelected"
          aria-label="清除"
        >
          <XyuIcon icon="mdi:close" :size="12" />
        </button>
        <XyuIcon
          v-else
          :icon="visible ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          :class="[`${ns}__arrow`, visible ? 'is-open' : '']"
          :size="14"
        />
      </span>
    </div>

    <!-- Dropdown -->
    <teleport to="body">
      <transition name="xyu-fade-in">
        <div
          v-if="visible"
          :ref="(el) => { dropdownRef = el as HTMLElement; }"
          :class="`${ns}__dropdown`"
          :style="dropdownStyle"
          role="listbox"
        >
          <!-- Search -->
          <div v-if="filteredOptions.length > 5" :class="`${ns}__search`">
            <input
              :ref="(el) => { searchInputRef = el as HTMLInputElement; }"
              v-model="query"
              :class="`${ns}__search-input`"
              placeholder="搜索..."
              @keydown="handleKeydown"
            />
          </div>

          <!-- Options -->
          <div :class="`${ns}__options`">
            <slot name="options">
              <template v-if="filteredOptions.length > 0">
                <div
                  v-for="(opt, idx) in filteredOptions"
                  :key="opt.value"
                  :class="[
                    `${ns}__option`,
                    isSelected(opt.value) ? 'is-selected' : '',
                    idx === focusedIndex ? 'is-focused' : '',
                    opt.disabled ? 'is-disabled' : ''
                  ]"
                  role="option"
                  :aria-selected="isSelected(opt.value)"
                  @click="toggleOption(opt)"
                >
                  <span :class="`${ns}__option-label`">{{ opt.label }}</span>
                  <XyuIcon
                    v-if="isSelected(opt.value)"
                    icon="mdi:check"
                    :size="14"
                  />
                </div>
              </template>
              <div v-else :class="`${ns}__empty`">
                {{ props.noDataText }}
              </div>
            </slot>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
