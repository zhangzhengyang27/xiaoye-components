<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";

export interface PaginationProps {
  currentPage?: number;
  pageSize?: number;
  total: number;
  pageSizes?: number[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50],
  disabled: false
});

const emit = defineEmits<{
  "update:currentPage": [value: number];
  "update:pageSize": [value: number];
  change: [page: number, pageSize: number];
}>();

const ns = useNamespace("pagination");
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const pages = computed(() => {
  const result = new Set<number>([1, pageCount.value, props.currentPage]);

  result.add(Math.max(1, props.currentPage - 1));
  result.add(Math.min(pageCount.value, props.currentPage + 1));

  return [...result].sort((a, b) => a - b);
});

function updatePage(page: number) {
  const next = Math.min(pageCount.value, Math.max(1, page));
  emit("update:currentPage", next);
  emit("change", next, props.pageSize);
}

function updatePageSize(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value);
  emit("update:pageSize", value);
  emit("update:currentPage", 1);
  emit("change", 1, value);
}
</script>

<template>
  <div :class="ns.base.value">
    <div class="xy-pagination__summary">共 {{ props.total }} 条</div>
    <div class="xy-pagination__pager">
      <button
        type="button"
        :disabled="props.disabled || props.currentPage <= 1"
        @click="updatePage(props.currentPage - 1)"
      >
        上一页
      </button>
      <button
        v-for="page in pages"
        :key="page"
        type="button"
        :class="page === props.currentPage ? 'is-active' : ''"
        :disabled="props.disabled"
        @click="updatePage(page)"
      >
        {{ page }}
      </button>
      <button
        type="button"
        :disabled="props.disabled || props.currentPage >= pageCount"
        @click="updatePage(props.currentPage + 1)"
      >
        下一页
      </button>
    </div>
    <label class="xy-pagination__size">
      <span>每页</span>
      <select :value="props.pageSize" :disabled="props.disabled" @change="updatePageSize">
        <option v-for="size in props.pageSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </label>
  </div>
</template>

