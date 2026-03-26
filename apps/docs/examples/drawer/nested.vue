<script setup lang="ts">
import { ref } from "vue";

const outerOpen = ref(false);
const innerOpen = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="outerOpen = true">打开嵌套抽屉</xy-button>

    <xy-drawer v-model="outerOpen" title="外层审批面板" size="48%">
      <div class="xy-doc-stack">
        <p>外层抽屉保留主列表上下文，内部可以继续拉起一个细节配置抽屉。</p>
        <xy-button plain @click="innerOpen = true">打开内层抽屉</xy-button>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="outerOpen = false">关闭外层</xy-button>
          <xy-button type="primary" @click="innerOpen = true">继续配置</xy-button>
        </xy-space>
      </template>

      <xy-drawer v-model="innerOpen" title="内层字段设置" size="360px">
        <div class="xy-doc-stack">
          <xy-input placeholder="字段名称" />
          <xy-switch />
          <p>默认 `append-to-body` 为 `true`，所以嵌套抽屉会自动进入更高层级。</p>
        </div>
      </xy-drawer>
    </xy-drawer>
  </div>
</template>
