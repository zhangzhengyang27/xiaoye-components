<script setup lang="ts">
const items = [
  {
    key: "overview",
    label: "打开实验线总览",
    description: "先看单组件试点和当前判断标准",
    group: "Pages",
    shortcut: "G O",
    icon: "mdi:view-grid-outline"
  },
  {
    key: "showcase",
    label: "查看页面样板",
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

const emptyItems: typeof items = [];
</script>

<template>
  <div class="frontline-menu-demo">
    <xy-front-menu :items="items" active-key="showcase">
      <template #group="{ group }">
        <div v-if="group" class="frontline-menu-group">{{ group }}</div>
      </template>
      <template #shortcut="{ item }">
        <span v-if="item.shortcut" class="frontline-menu-shortcut">{{ item.shortcut }}</span>
      </template>
    </xy-front-menu>

    <xy-front-menu :items="emptyItems">
      <template #empty="{ emptyText }">
        <div class="frontline-menu-empty">
          <strong class="frontline-menu-empty__title">{{ emptyText }}</strong>
          <p class="frontline-menu-empty__description">当前这层先只承接结果空态，不去混入搜索框或命令入口本身。</p>
        </div>
      </template>
    </xy-front-menu>
  </div>
</template>

<style scoped>
.frontline-menu-demo {
  display: grid;
  gap: 18px;
}

.frontline-menu-group {
  padding: 0 6px;
  color: var(--xy-frontline-brand-1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.frontline-menu-shortcut {
  padding: 4px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-frontline-brand-1) 8%, white);
  color: var(--xy-frontline-brand-1);
  font-size: 12px;
  font-weight: 700;
}

.frontline-menu-empty {
  display: grid;
  gap: 6px;
}

.frontline-menu-empty__title {
  color: var(--xy-frontline-neutral-1);
}

.frontline-menu-empty__description {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.6;
}
</style>
