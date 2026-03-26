<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

function toggleLoading() {
  loading.value = !loading.value;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="toggleLoading">
        {{ loading ? "关闭加载" : "开启加载" }}
      </xy-button>
      <xy-tag :status="loading ? 'warning' : 'success'">
        {{ loading ? "容器加载中" : "容器空闲" }}
      </xy-tag>
    </xy-space>

    <xy-card v-loading="loading" xy-loading-text="正在拉取报表数据..." class="loading-demo-card">
      <div class="xy-doc-stack">
        <strong>运营日报</strong>
        <p>这个示例展示最常见的容器内遮罩用法，适合表格、卡片和分区面板。</p>
      </div>
    </xy-card>
  </div>
</template>
