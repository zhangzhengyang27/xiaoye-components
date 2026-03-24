<script setup lang="ts">
import { ref } from "vue";

const topOpen = ref(false);
const bottomOpen = ref(false);
const guardEnabled = ref(true);

function beforeClose(done: (cancel?: boolean) => void) {
  if (guardEnabled.value) {
    done(true);
    return;
  }

  done();
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="topOpen = true">顶部抽屉</xy-button>
      <xy-button type="primary" @click="bottomOpen = true">底部抽屉</xy-button>
      <xy-switch v-model="guardEnabled" />
      <xy-tag :status="guardEnabled ? 'warning' : 'success'">
        {{ guardEnabled ? "关闭拦截中" : "允许关闭" }}
      </xy-tag>
    </xy-space>

    <xy-drawer v-model="topOpen" title="顶部筛选层" direction="ttb" size="280px">
      <p>通过 `direction=&quot;ttb&quot;` 可以使用更接近 Element Plus 的方向配置。</p>
    </xy-drawer>

    <xy-drawer
      v-model="bottomOpen"
      title="底部批处理面板"
      placement="bottom"
      size="320px"
      :before-close="beforeClose"
      :show-close="false"
      :with-header="false"
    >
      <div class="xy-doc-stack">
        <strong>这里隐藏了默认头部和关闭按钮。</strong>
        <span>解除拦截后，再通过底部按钮关闭抽屉。</span>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="guardEnabled = false">解除拦截</xy-button>
          <xy-button type="primary" @click="bottomOpen = false">关闭抽屉</xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>
