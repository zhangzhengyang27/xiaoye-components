<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PaginationProps, PaginationEmits } from "./pagination";
import Pager from "./pager.vue";

const props = withDefaults(defineProps<PaginationProps>(), {
  modelValue: 1,
  pageSize: 10,
  total: 0,
  pagerCount: 7,
  layout: "prev, pager, next",
  background: true,
  small: false,
  disabled: false
});

const emit = defineEmits<PaginationEmits>();

const ns = "xyu-pagination";
const internalCurrent = ref(props.modelValue);

const pageCount = computed(() => {
  if (props.pageCount !== undefined) return props.pageCount;
  if (!props.total) return 1;
  return Math.ceil(props.total / props.pageSize);
});

const hasPrev = computed(() => internalCurrent.value > 1);
const hasNext = computed(() => internalCurrent.value < pageCount.value);

const pagers = computed(() => {
  const count = pageCount.value;
  const current = internalCurrent.value;
  const total = props.pagerCount;
  if (count <= total) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  const half = Math.floor(total / 2);
  let start = current - half;
  let end = current + half;
  if (start < 1) {
    start = 1;
    end = total;
  }
  if (end > count) {
    end = count;
    start = count - total + 1;
  }
  const pages: (number | "...")[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < count) {
    if (end < count - 1) pages.push("...");
    pages.push(count);
  }
  return pages;
});

const jumpValue = ref(String(internalCurrent.value));
watch(() => internalCurrent.value, (val) => {
  jumpValue.value = String(val);
});

function setCurrent(page: number) {
  if (page < 1 || page > pageCount.value || page === internalCurrent.value || props.disabled) return;
  const prev = internalCurrent.value;
  internalCurrent.value = page;
  emit("update:modelValue", page);
  emit("change", page, prev);
}

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  jumpValue.value = val;
}

function handleJump() {
  const page = parseInt(jumpValue.value, 10);
  if (!isNaN(page)) setCurrent(page);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") handleJump();
}

const layoutParts = computed(() => props.layout.split(",").map((s) => s.trim()));

function getLayoutItems() {
  const parts: { key: string; text?: string }[] = [];
  for (const part of layoutParts.value) {
    if (part === "->") continue;
    if (part === "prev") {
      parts.push({ key: "prev", text: props.prevText });
    } else if (part === "next") {
      parts.push({ key: "next", text: props.nextText });
    } else {
      parts.push({ key: part });
    }
  }
  return parts;
}
</script>

<template>
  <div
    v-if="!props.hideOnSinglePage || pageCount > 1"
    :class="[ns, props.background ? 'is-background' : '', props.small ? 'is-small' : '']"
  >
    <!-- total -->
    <template v-if="layoutParts.includes('total')">
      <span :class="`${ns}__total`">共 {{ total }} 条</span>
    </template>

    <!-- prev -->
    <template v-if="layoutParts.includes('prev')">
      <button
        type="button"
        :class="[`${ns}__btn`, `${ns}__btn--prev`, hasPrev ? '' : 'is-disabled']"
        :disabled="!hasPrev || props.disabled"
        @click="setCurrent(internalCurrent - 1)"
      >
        <slot name="prev">{{ props.prevText || "‹" }}</slot>
      </button>
    </template>

    <!-- pager -->
    <template v-if="layoutParts.includes('pager')">
      <template v-for="(page, idx) in pagers" :key="idx">
        <span v-if="page === '...'" :class="`${ns}__ellipsis`">···</span>
        <Pager
          v-else
          :page="page as number"
          :current="internalCurrent"
          :disabled="props.disabled"
          @click="setCurrent(page as number)"
        />
      </template>
    </template>

    <!-- next -->
    <template v-if="layoutParts.includes('next')">
      <button
        type="button"
        :class="[`${ns}__btn`, `${ns}__btn--next`, hasNext ? '' : 'is-disabled']"
        :disabled="!hasNext || props.disabled"
        @click="setCurrent(internalCurrent + 1)"
      >
        <slot name="next">{{ props.nextText || "›" }}</slot>
      </button>
    </template>

    <!-- jumper -->
    <template v-if="layoutParts.includes('jumper')">
      <span :class="`${ns}__jumper`">
        前往
        <input
          type="text"
          :class="`${ns}__jumper-input`"
          :value="jumpValue"
          :disabled="props.disabled"
          @input="handleInput"
          @keydown="handleKeydown"
          @blur="handleJump"
        />
        页
      </span>
    </template>
  </div>
</template>
