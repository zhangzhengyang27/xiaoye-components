<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const items = [
  {
    key: "overview",
    label: "打开实验线总览",
    description: "先看单组件和当前判断标准",
    group: "Pages",
    shortcut: "G O",
    icon: "mdi:view-grid-outline"
  },
  {
    key: "showcase",
    label: "查看前台页面样板",
    description: "直接验证整页气质和节奏",
    group: "Pages",
    shortcut: "G S",
    icon: "mdi:palette-outline"
  },
  {
    key: "notes",
    label: "记录评审结论",
    description: "把当前阶段判断收口成文档",
    group: "Actions",
    shortcut: "A N",
    icon: "mdi:note-edit-outline"
  }
];
</script>

<template>
  <div class="frontline-demo-stack">
    <xy-front-button leading-icon="mdi:magnify" @click="open = true">打开 Command</xy-front-button>
    <xy-front-command
      v-model="open"
      title="Frontline Command"
      description="这一版先验证搜索与命令入口的最小结构；也可以直接按 `Cmd/Ctrl + K` 打开。"
      :items="items"
    >
      <template #empty="{ query }">
        <div class="frontline-command-empty">
          <strong class="frontline-command-empty__title">没有找到 “{{ query || '当前关键词' }}” 的命令</strong>
          <p class="frontline-command-empty__description">
            这说明当前命令入口仍然偏轻量，更适合页面跳转和资源入口，而不是完整操作面板。
          </p>
        </div>
      </template>
    </xy-front-command>
  </div>
</template>

<style scoped>
.frontline-command-empty {
  display: grid;
  gap: 6px;
}

.frontline-command-empty__title {
  color: var(--xy-frontline-neutral-1);
}

.frontline-command-empty__description {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.6;
}
</style>
