<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const count = ref(0);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开无遮罩抽屉</xy-button>
      <xy-button plain @click="count += 1">背景按钮点击数：{{ count }}</xy-button>
    </xy-space>

    <xy-drawer
      v-model="open"
      title="可穿透辅助面板"
      size="360px"
      :modal="false"
      modal-penetrable
      modal-class="demo-drawer-mask"
    >
      <div class="xy-doc-stack">
        <p>当 `modal=false` 且 `modal-penetrable` 为 `true` 时，背景区域可以继续点击。</p>
        <p>`modal-class` 会作用在遮罩层容器，因此只会在 `modal=true` 时生效。</p>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="count += 1">继续点背景按钮</xy-button>
          <xy-button type="primary" @click="open = false">关闭面板</xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>
