<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const placement = ref<"left" | "right">("right");
const size = ref("480px");
const destroyOnClose = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开抽屉</xy-button>
      <xy-button plain @click="placement = 'left'">左侧布局</xy-button>
      <xy-button plain @click="placement = 'right'">右侧布局</xy-button>
      <xy-button plain @click="size = '360px'">紧凑宽度</xy-button>
      <xy-button plain @click="size = '560px'">宽面板</xy-button>
      <xy-switch v-model="destroyOnClose" />
    </xy-space>

    <xy-space wrap>
      <xy-tag status="primary">placement={{ placement }}</xy-tag>
      <xy-tag status="neutral">size={{ size }}</xy-tag>
      <xy-tag :status="destroyOnClose ? 'warning' : 'success'">
        {{ destroyOnClose ? "关闭后销毁内容" : "关闭后保留内容" }}
      </xy-tag>
    </xy-space>

    <xy-drawer
      v-model="open"
      title="筛选与详情联动面板"
      :placement="placement"
      :size="size"
      :destroy-on-close="destroyOnClose"
    >
      <div class="xy-doc-stack">
        <p>这个示例把抽屉当作受控的详情面板，外部工具栏统一决定打开方向和宽度。</p>
        <xy-space wrap>
          <xy-tag status="primary">当前方向：{{ placement }}</xy-tag>
          <xy-tag status="neutral">当前宽度：{{ size }}</xy-tag>
        </xy-space>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">关闭面板</xy-button>
          <xy-button type="primary" @click="open = false">保存布局</xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>
