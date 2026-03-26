<script setup lang="ts">
import { XyLoadingService } from "xiaoye-components";

function openLocalBodyLoading() {
  const loading = XyLoadingService({
    target: "#loading-target-panel",
    body: true,
    text: "正在定位面板区域..."
  });

  window.setTimeout(() => {
    loading.close();
  }, 1200);
}

function openTargetLoading() {
  const loading = XyLoadingService({
    target: "#loading-target-panel",
    text: "正在重绘局部图表..."
  });

  window.setTimeout(() => {
    loading.close();
  }, 1200);
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openTargetLoading">挂到目标容器</xy-button>
      <xy-button plain @click="openLocalBodyLoading">挂到 body 并对齐目标区域</xy-button>
    </xy-space>

    <xy-card id="loading-target-panel" class="loading-demo-card">
      <div class="xy-doc-stack">
        <strong>图表面板</strong>
        <p>一个适合演示 target 与 body 差异的局部区域。</p>
      </div>
    </xy-card>
  </div>
</template>
