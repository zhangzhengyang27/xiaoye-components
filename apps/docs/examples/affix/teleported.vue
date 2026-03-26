<script setup lang="ts">
import { nextTick, ref } from "vue";

type AffixExpose = {
  updateRoot: () => Promise<void> | void;
};

const affixRef = ref<AffixExpose | null>(null);
const compact = ref(false);

async function toggleCardWidth() {
  compact.value = !compact.value;
  await nextTick();
  await affixRef.value?.updateRoot();
}
</script>

<template>
  <section class="demo-affix-teleported">
    <xy-space wrap>
      <xy-button plain @click="toggleCardWidth">
        {{ compact ? "恢复卡片宽度" : "收窄卡片并刷新" }}
      </xy-button>
      <div class="demo-affix-teleported__portal">Teleport 挂载点</div>
    </xy-space>

    <xy-affix
      ref="affixRef"
      teleported
      append-to=".demo-affix-teleported__portal"
      :offset="112"
    >
      <xy-card
        class="demo-affix-teleported__card"
        :class="{ 'is-compact': compact }"
        shadow="always"
      >
        <strong>已开启 Teleport</strong>
        <p>固定态节点会被挂到指定容器，内容宽度变化后调用 `updateRoot()` 可同步占位尺寸。</p>
      </xy-card>
    </xy-affix>

    <div class="demo-affix-teleported__list">
      <div v-for="item in 4" :key="item" class="demo-affix-teleported__row">
        第 {{ item }} 条说明：适合把局部操作卡片挂到更外层节点，避开复杂层级或裁切上下文。
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-affix-teleported {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-affix-teleported__portal {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px dashed color-mix(in srgb, var(--xy-color-primary) 28%, white);
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-affix-teleported__card {
  width: 320px;
  transition: width 0.2s ease;
}

.demo-affix-teleported__card.is-compact {
  width: 220px;
}

.demo-affix-teleported__card strong {
  display: block;
  margin-bottom: 8px;
}

.demo-affix-teleported__card p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-affix-teleported__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-affix-teleported__row {
  padding: 14px 16px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 74%, white);
  color: var(--xy-text-color-secondary);
}
</style>
