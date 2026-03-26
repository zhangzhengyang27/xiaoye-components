<script setup lang="ts">
import { ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

type NotificationPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const activePosition = ref<NotificationPosition>("top-right");
const positions: NotificationPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
];

function openAt(position: NotificationPosition) {
  activePosition.value = position;

  XyNotificationService.open({
    title: "批量导出完成",
    message: `当前示例使用 ${position} 作为 position。`,
    position,
    duration: 2400
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button
        v-for="position in positions"
        :key="position"
        :type="position === activePosition ? 'primary' : undefined"
        @click="openAt(position)"
      >
        {{ position }}
      </xy-button>
    </xy-space>

    <xy-tag round status="primary">
      当前最近一次触发位置：{{ activePosition }}
    </xy-tag>
  </div>
</template>
