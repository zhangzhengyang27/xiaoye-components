<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button plain @click="open = true">自定义头部与遮罩策略</xy-button>

    <xy-modal
      v-model="open"
      width="640px"
      :close-on-overlay="false"
      title="高级配置"
    >
      <template #header>
        <xy-space>
          <xy-tag status="warning">需确认</xy-tag>
          <h3>高级配置确认</h3>
        </xy-space>
      </template>

      <p>当前示例禁用了遮罩关闭，更适合需要用户明确操作的强提示场景。</p>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">取消</xy-button>
          <xy-button type="danger" @click="open = false">确认执行</xy-button>
        </xy-space>
      </template>
    </xy-modal>
  </div>
</template>
