<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-space>
      <xy-button @click="loading = !loading">
        {{ loading ? "关闭加载态" : "打开加载态" }}
      </xy-button>
    </xy-space>

    <xy-page-container :loading="loading" body-class="demo-pro-page-container-custom__body">
      <template #header>
        <xy-card>
          <xy-space direction="vertical" size="xs" fill>
            <xy-text tag="strong">自定义 header 完全接管头部</xy-text>
            <xy-text type="secondary">
              这里可以放运营摘要、筛选说明或任意自定义布局，而不是默认的 PageHeader 结构。
            </xy-text>
          </xy-space>
        </xy-card>
      </template>

      <xy-card header="主体区域">
        <p>loading 开启时，主体区会切换到组件库统一的加载表现。</p>
      </xy-card>
    </xy-page-container>
  </div>
</template>
