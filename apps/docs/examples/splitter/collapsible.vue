<script setup lang="ts">
import { ref } from "vue";

const leftSize = ref(240);
</script>

<template>
  <div class="demo-splitter-collapsible">
    <xy-splitter lazy>
      <xy-splitter-panel v-model:size="leftSize" min="160px" collapsible>
        <section class="demo-splitter-side">
          <xy-text tag="strong">筛选条件</xy-text>
          <xy-text size="sm" type="info">
            当前宽度 {{ Math.round(leftSize) }}px，可直接拖拽，也可以点击分隔条旁的折叠按钮。
          </xy-text>
        </section>
      </xy-splitter-panel>

      <xy-splitter-panel min="320px">
        <section class="demo-splitter-main">
          <xy-text tag="strong">列表结果</xy-text>
          <xy-text size="sm" type="info">开启 `lazy` 后，拖拽时先展示预览位置，松手再真正提交尺寸。</xy-text>
        </section>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.demo-splitter-collapsible {
  height: 280px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  overflow: hidden;
  background: var(--xy-bg-color);
}

.demo-splitter-side,
.demo-splitter-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.demo-splitter-side {
  background: color-mix(in srgb, var(--xy-bg-color-muted) 82%, white);
}

.demo-splitter-main {
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--xy-color-primary) 8%, white),
      transparent 36%
    ),
    var(--xy-bg-color);
}
</style>
