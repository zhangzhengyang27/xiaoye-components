<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const latestAction = ref("右键任一节点查看回调参数");
const menuRef = ref<HTMLElement | null>(null);
const activeNodeLabel = ref("");
const menuVisible = ref(false);
const menuPosition = ref({
  x: 0,
  y: 0
});

const data = [
  {
    id: 1,
    label: "菜单配置",
    children: [
      { id: 11, label: "工作台" },
      { id: 12, label: "活动管理" }
    ]
  },
  {
    id: 2,
    label: "权限配置",
    children: [
      { id: 21, label: "角色权限" }
    ]
  }
];

const menuItems = [
  { key: "create-child", label: "新增子节点" },
  { key: "rename", label: "重命名" },
  { key: "copy-path", label: "复制路径" },
  { key: "remove", label: "删除节点", danger: true }
];

function closeMenu() {
  menuVisible.value = false;
}

async function handleContextMenu(event: Event, data: { label: string }) {
  const mouseEvent = event as MouseEvent;

  latestAction.value = `最近右键节点：${data.label}`;
  activeNodeLabel.value = data.label;
  menuPosition.value = {
    x: mouseEvent.clientX,
    y: mouseEvent.clientY
  };
  menuVisible.value = true;

  await nextTick();

  const menu = menuRef.value;

  if (!menu) {
    return;
  }

  const menuRect = menu.getBoundingClientRect();
  const maxX = window.innerWidth - menuRect.width - 12;
  const maxY = window.innerHeight - menuRect.height - 12;

  menuPosition.value = {
    x: Math.max(12, Math.min(mouseEvent.clientX, maxX)),
    y: Math.max(12, Math.min(mouseEvent.clientY, maxY))
  };
}

function handleAction(item: { label: string }) {
  latestAction.value = `已对「${activeNodeLabel.value}」执行：${item.label}`;
  closeMenu();
}

function handleGlobalPointer(event: MouseEvent) {
  const target = event.target as Node | null;

  if (menuVisible.value && menuRef.value && target && !menuRef.value.contains(target)) {
    closeMenu();
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeMenu();
  }
}

onMounted(() => {
  window.addEventListener("click", handleGlobalPointer);
  window.addEventListener("resize", closeMenu);
  window.addEventListener("keydown", handleEscape);
  window.addEventListener("scroll", closeMenu, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleGlobalPointer);
  window.removeEventListener("resize", closeMenu);
  window.removeEventListener("keydown", handleEscape);
  window.removeEventListener("scroll", closeMenu, true);
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-text size="sm" type="info">{{ latestAction }}</xy-text>

    <div class="xy-doc-field">
      <xy-tree
        :data="data"
        node-key="id"
        default-expand-all
        @node-contextmenu="handleContextMenu"
      />
    </div>

    <div
      v-if="menuVisible"
      ref="menuRef"
      class="demo-tree-contextmenu"
      :style="{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`
      }"
      role="menu"
      aria-label="节点快捷操作"
    >
      <div class="demo-tree-contextmenu__header">
        <xy-text size="sm" type="info">当前节点</xy-text>
        <strong>{{ activeNodeLabel }}</strong>
      </div>

      <button
        v-for="item in menuItems"
        :key="item.key"
        type="button"
        class="demo-tree-contextmenu__item"
        :class="{ 'is-danger': item.danger }"
        role="menuitem"
        @click="handleAction(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.demo-tree-contextmenu {
  position: fixed;
  z-index: calc(var(--xy-z-dropdown) + 8);
  display: grid;
  min-width: 196px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 96%, white);
  box-shadow: var(--xy-shadow-md);
  backdrop-filter: blur(10px);
  gap: 6px;
}

.demo-tree-contextmenu__header {
  display: grid;
  gap: 2px;
  padding: 4px 6px 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-tree-contextmenu__header strong {
  color: var(--xy-text-color);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

.demo-tree-contextmenu__item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--xy-text-color);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.demo-tree-contextmenu__item:hover {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, var(--xy-bg-color));
  color: var(--xy-color-primary);
}

.demo-tree-contextmenu__item.is-danger:hover {
  background: color-mix(in srgb, var(--xy-color-danger) 10%, var(--xy-bg-color));
  color: var(--xy-color-danger);
}
</style>
