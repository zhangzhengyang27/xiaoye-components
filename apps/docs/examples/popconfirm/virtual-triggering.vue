<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const anchorRef = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
}
</script>

<template>
  <div class="demo-popconfirm-virtual">
    <span ref="anchorRef" class="demo-popconfirm-virtual__anchor">
      <xy-button type="primary" @click="toggle">
        {{ open ? "关闭确认框" : "打开确认框" }}
      </xy-button>
    </span>

    <xy-popconfirm
      v-model="open"
      title="确认将当前方案发布到正式环境吗？"
      :virtual-ref="anchorRef"
      virtual-triggering
      confirm-button-text="发布"
    />
  </div>
</template>

<style scoped>
.demo-popconfirm-virtual {
  display: inline-flex;
}

.demo-popconfirm-virtual__anchor {
  display: inline-flex;
}
</style>
