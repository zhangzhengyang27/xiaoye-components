<script setup lang="ts">
import { ref } from "vue";

const popoverOpen = ref(false);
const dialogOpen = ref(false);

function escalateToDialog() {
  popoverOpen.value = false;
  dialogOpen.value = true;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-popover v-model="popoverOpen" title="发布前确认" width="360px">
      <template #trigger>
        <xy-button type="primary">查看发布风险</xy-button>
      </template>

      <div class="xy-doc-stack">
        <p>当前变更会影响 3 个菜单入口，建议先通知运营并确认发布时间窗。</p>
        <xy-space>
          <xy-button plain @click="popoverOpen = false">先关闭</xy-button>
          <xy-button type="warning" @click="escalateToDialog">升级到对话框确认</xy-button>
        </xy-space>
      </div>
    </xy-popover>

    <xy-dialog v-model="dialogOpen" title="发布风险确认">
      <p>这里适合承载更完整的阻断式确认，例如责任人、影响范围和回滚方案。</p>

      <template #footer>
        <xy-space>
          <xy-button plain @click="dialogOpen = false">取消</xy-button>
          <xy-button type="primary" @click="dialogOpen = false">确认发布</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>
