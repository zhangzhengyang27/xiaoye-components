<script setup lang="ts">
import { ref } from "vue";

const starred = ref(false);
const archived = ref(true);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-checkbox v-model="starred" aria-label="星标项目" border>
        <xy-icon icon="mdi:star-outline" :size="16" />
      </xy-checkbox>

      <xy-checkbox
        v-model="archived"
        aria-label="归档项目"
        aria-controls="archive-tip"
        border
      >
        <xy-icon icon="mdi:archive-outline" :size="16" />
      </xy-checkbox>
    </xy-space>

    <div id="archive-tip" class="xy-doc-stack">
      <xy-text size="sm">
        无可见文案时，建议补 `aria-label`；如果组件会影响某个区域，也可以补 `aria-controls`。
      </xy-text>
      <xy-text size="sm">
        当前状态：星标 {{ starred ? "开启" : "关闭" }}，归档 {{ archived ? "开启" : "关闭" }}
      </xy-text>
    </div>
  </div>
</template>
