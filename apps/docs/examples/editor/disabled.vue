<script setup lang="ts">
import { ref } from "vue";

const disabled = ref(false);
const content = ref(
  [
    "# 审批说明",
    "",
    "1. 当前方案已完成图表与播放器接入。",
    "2. 待确认是否需要继续补充宿主级壳层逻辑。",
    "3. 如进入复核阶段，可切到只读模式。"
  ].join("\n")
);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-switch v-model="disabled" />
      <xy-tag :status="disabled ? 'warning' : 'success'">
        {{ disabled ? "当前为只读态" : "当前可编辑" }}
      </xy-tag>
    </xy-space>

    <xy-editor
      v-model="content"
      :disabled="disabled"
      :min-height="300"
      placeholder="请输入审批说明"
      :options="{
        counter: {
          enable: true
        }
      }"
    />
  </div>
</template>
