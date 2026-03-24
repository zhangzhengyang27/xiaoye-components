<script setup lang="ts">
import { ref } from "vue";

const allowAdvanced = ref(false);

async function beforeCollapse(name: string | number) {
  if (name !== "advanced") {
    return true;
  }

  return allowAdvanced.value;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-switch v-model="allowAdvanced" />
      <xy-tag :status="allowAdvanced ? 'success' : 'warning'">
        {{ allowAdvanced ? "允许展开高级面板" : "高级面板已被守卫拦截" }}
      </xy-tag>
    </xy-space>

    <xy-collapse :before-collapse="beforeCollapse">
      <xy-collapse-item title="公开说明" name="public">
        这部分内容始终允许展开。
      </xy-collapse-item>

      <xy-collapse-item title="高级配置" name="advanced">
        只有开关打开后，才允许展开这部分内容。
      </xy-collapse-item>

      <xy-collapse-item title="暂未开放" name="disabled" disabled>
        这项被禁用了，不会响应点击和键盘切换。
      </xy-collapse-item>
    </xy-collapse>
  </div>
</template>
