<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import type { TreeInstance } from "xiaoye-components"

interface MenuNode {
  id: number
  label: string
  icon?: string
  path?: string
  visible?: boolean
  children?: MenuNode[]
}

interface MenuEditorDraft {
  label: string
  icon: string
  path: string
  visible: boolean
}

const treeRef = ref<TreeInstance | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const activeNode = ref<MenuNode | null>(null)
const menuVisible = ref(false)
const message = ref("右键节点可打开菜单，拖动节点可调整菜单顺序。")
const editOpen = ref(false)
const removeOpen = ref(false)
const menuPosition = ref({
  x: 0,
  y: 0
})
let nextId = 100

const initialMenus: MenuNode[] = [
  {
    id: 1,
    label: "工作台",
    icon: "mdi:view-dashboard-outline",
    path: "/dashboard",
    visible: true,
    children: [
      { id: 11, label: "概览看板", icon: "mdi:chart-box-outline", path: "/dashboard/overview", visible: true },
      { id: 12, label: "待办中心", icon: "mdi:clipboard-text-outline", path: "/dashboard/tasks", visible: true }
    ]
  },
  {
    id: 2,
    label: "活动管理",
    icon: "mdi:bullhorn-outline",
    path: "/campaigns",
    visible: true,
    children: [
      { id: 21, label: "活动列表", icon: "mdi:format-list-bulleted", path: "/campaigns/list", visible: true },
      { id: 22, label: "投放计划", icon: "mdi:calendar-outline", path: "/campaigns/schedule", visible: true }
    ]
  },
  {
    id: 3,
    label: "系统设置",
    icon: "mdi:cog-outline",
    path: "/settings",
    visible: false
  }
]
const data = ref<MenuNode[]>(structuredClone(initialMenus))
const savedSnapshot = ref<string[]>(serializeMenus(data.value))
const draft = ref<MenuEditorDraft>({
  label: "",
  icon: "",
  path: "",
  visible: true
})

const menuItems = [
  { key: "append", label: "新增子菜单" },
  { key: "rename", label: "重命名" },
  { key: "copy-path", label: "复制路径" },
  { key: "remove", label: "删除菜单", danger: true }
]

function closeMenu() {
  menuVisible.value = false
}

function serializeMenus(nodes: MenuNode[], prefix = ""): string[] {
  return nodes.flatMap((node) => {
    const currentPath = prefix ? `${prefix} / ${node.label}` : node.label
    const meta = `${node.path ?? "未配置路径"} | ${node.visible === false ? "hidden" : "visible"}`
    return [`${currentPath} [${meta}]`, ...(node.children ? serializeMenus(node.children, currentPath) : [])]
  })
}

const currentSnapshot = computed(() => serializeMenus(data.value))
const hasDirtyChanges = computed(
  () => JSON.stringify(currentSnapshot.value) !== JSON.stringify(savedSnapshot.value)
)

async function handleContextMenu(event: Event, data: MenuNode) {
  const mouseEvent = event as MouseEvent

  activeNode.value = data
  menuVisible.value = true
  menuPosition.value = {
    x: mouseEvent.clientX,
    y: mouseEvent.clientY
  }

  await nextTick()

  const menu = menuRef.value

  if (!menu) {
    return
  }

  const menuRect = menu.getBoundingClientRect()
  const maxX = window.innerWidth - menuRect.width - 12
  const maxY = window.innerHeight - menuRect.height - 12

  menuPosition.value = {
    x: Math.max(12, Math.min(mouseEvent.clientX, maxX)),
    y: Math.max(12, Math.min(mouseEvent.clientY, maxY))
  }
}

function handleGlobalPointer(event: MouseEvent) {
  const target = event.target as Node | null

  if (menuVisible.value && menuRef.value && target && !menuRef.value.contains(target)) {
    closeMenu()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener("click", handleGlobalPointer)
  window.addEventListener("resize", closeMenu)
  window.addEventListener("keydown", handleEscape)
  window.addEventListener("scroll", closeMenu, true)
})

onBeforeUnmount(() => {
  window.removeEventListener("click", handleGlobalPointer)
  window.removeEventListener("resize", closeMenu)
  window.removeEventListener("keydown", handleEscape)
  window.removeEventListener("scroll", closeMenu, true)
})

function handleAction(item: { key: string; label: string }) {
  if (!activeNode.value) {
    return
  }

  if (item.key === "append") {
    treeRef.value?.append(
      {
        id: nextId++,
        label: `新菜单 ${nextId}`,
        icon: "mdi:file-tree-outline",
        path: `/new-menu/${nextId}`,
        visible: true
      },
      activeNode.value.id
    )
    message.value = `已在「${activeNode.value.label}」下新增子菜单`
  } else if (item.key === "remove") {
    removeOpen.value = true
  } else if (item.key === "copy-path") {
    const path = treeRef.value?.getNodePath(activeNode.value.id) ?? []
    message.value = `路径：${path.map((node) => node.label).join(" / ")}`
  } else if (item.key === "rename") {
    draft.value = {
      label: activeNode.value.label,
      icon: activeNode.value.icon ?? "mdi:file-tree-outline",
      path: activeNode.value.path ?? "",
      visible: activeNode.value.visible !== false
    }
    editOpen.value = true
  } else {
    message.value = `已触发操作：${item.label}（示例中不真正修改名称）`
  }

  closeMenu()
}

function saveMenuConfig() {
  if (!activeNode.value || !draft.value.label.trim()) {
    return
  }

  activeNode.value.label = draft.value.label.trim()
  activeNode.value.icon = draft.value.icon.trim() || "mdi:file-tree-outline"
  activeNode.value.path = draft.value.path.trim() || "/"
  activeNode.value.visible = draft.value.visible
  message.value = `已更新菜单：${activeNode.value.label}（${activeNode.value.path}）`
  editOpen.value = false
}

function confirmRemove() {
  if (!activeNode.value) {
    return
  }

  treeRef.value?.remove(activeNode.value)
  message.value = `已删除菜单：${activeNode.value.label}`
  removeOpen.value = false
}

function saveOrder() {
  savedSnapshot.value = [...currentSnapshot.value]
  message.value = "已保存当前菜单排序快照。"
}

function restoreInitialMenus() {
  data.value = structuredClone(initialMenus)
  savedSnapshot.value = serializeMenus(data.value)
  message.value = "已恢复初始菜单结构。"
}

function handleDrop(
  draggingNode: { label: string },
  dropNode: { label: string },
  dropType: "before" | "after" | "inner",
  _event: DragEvent,
  detail: { oldIndex: number; newIndex: number }
) {
  message.value = `${draggingNode.label} -> ${dropNode.label} (${dropType})，${detail.oldIndex} → ${detail.newIndex}`
}

function allowDrop(
  draggingNode: { key: number },
  dropNode: { key: number },
  type: "prev" | "inner" | "next"
) {
  if (draggingNode.key === 3) {
    return type !== "inner"
  }

  if (dropNode.key === 3) {
    return type === "next"
  }

  return true
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-tag :status="hasDirtyChanges ? 'warning' : 'success'">
        {{ hasDirtyChanges ? "存在未保存变更" : "菜单排序已保存" }}
      </xy-tag>
      <xy-button type="primary" @click="saveOrder">保存排序</xy-button>
      <xy-button plain @click="restoreInitialMenus">恢复初始结构</xy-button>
    </xy-space>

    <xy-text size="sm" type="info">{{ message }}</xy-text>

    <div class="demo-tree-menu-editor__grid">
      <section class="demo-tree-menu-editor__panel">
        <xy-text size="sm" type="info">当前菜单结构</xy-text>
        <pre>{{ currentSnapshot.join("\n") }}</pre>
      </section>

      <section class="demo-tree-menu-editor__panel">
        <xy-text size="sm" type="info">已保存排序快照</xy-text>
        <pre>{{ savedSnapshot.join("\n") }}</pre>
      </section>
    </div>

    <div class="xy-doc-field">
      <xy-tree ref="treeRef" :data="data" node-key="id" draggable default-expand-all :allow-drop="allowDrop"
        @node-contextmenu="handleContextMenu" @node-drop="handleDrop">
        <template #default="{ data: node }">
          <div class="demo-tree-menu-editor__node">
            <xy-space>
              <xy-icon :icon="node.icon ?? 'mdi:file-tree-outline'" :size="16" />
              <span>{{ node.label }}</span>
            </xy-space>
            <xy-space>
              <xy-tag v-if="node.visible === false" status="warning" round>隐藏</xy-tag>
              <xy-text size="sm" type="info">{{ node.path ?? "/" }}</xy-text>
            </xy-space>
          </div>
        </template>
      </xy-tree>
    </div>

    <div v-if="menuVisible" ref="menuRef" class="demo-tree-menu-editor__menu" :style="{
      left: `${menuPosition.x}px`,
      top: `${menuPosition.y}px`
    }" role="menu" aria-label="菜单节点快捷操作">
      <div class="demo-tree-menu-editor__header">
        <xy-text size="sm" type="info">当前菜单</xy-text>
        <strong>{{ activeNode?.label }}</strong>
      </div>

      <button v-for="item in menuItems" :key="item.key" type="button" class="demo-tree-menu-editor__item"
        :class="{ 'is-danger': item.danger }" role="menuitem" @click="handleAction(item)">
        {{ item.label }}
      </button>
    </div>

    <xy-drawer v-model="editOpen" title="菜单配置" placement="right" size="420px">
      <div class="xy-doc-stack">
        <xy-form :model="draft" label-position="top">
          <xy-form-item label="菜单名称">
            <xy-input v-model="draft.label" placeholder="请输入菜单名称" />
          </xy-form-item>
          <xy-form-item label="图标">
            <xy-input v-model="draft.icon" placeholder="例如 mdi:cog-outline" />
          </xy-form-item>
          <xy-form-item label="路由路径">
            <xy-input v-model="draft.path" placeholder="/settings/profile" />
          </xy-form-item>
          <xy-form-item label="可见状态">
            <xy-switch v-model="draft.visible" active-text="前台可见" inactive-text="仅配置可见" />
          </xy-form-item>
        </xy-form>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="editOpen = false">取消</xy-button>
          <xy-button type="primary" @click="saveMenuConfig">保存菜单配置</xy-button>
        </xy-space>
      </template>
    </xy-drawer>

    <xy-dialog v-model="removeOpen" title="删除菜单确认">
      <div class="xy-doc-stack">
        <xy-text size="sm" type="warning">
          即将删除菜单：{{ activeNode?.label }}。示例中会直接从树里移除该节点。
        </xy-text>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="removeOpen = false">取消</xy-button>
          <xy-button type="danger" @click="confirmRemove">确认删除</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

<style scoped>
.demo-tree-menu-editor__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.demo-tree-menu-editor__node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.demo-tree-menu-editor__panel {
  display: grid;
  gap: 8px;
  min-height: 100%;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 94%, white);
}

.demo-tree-menu-editor__panel pre {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.demo-tree-menu-editor__menu {
  position: fixed;
  z-index: calc(var(--xy-z-dropdown) + 8);
  display: grid;
  min-width: 208px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 96%, white);
  box-shadow: var(--xy-shadow-md);
  backdrop-filter: blur(10px);
  gap: 6px;
}

.demo-tree-menu-editor__header {
  display: grid;
  gap: 2px;
  padding: 4px 6px 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-tree-menu-editor__header strong {
  color: var(--xy-text-color);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

.demo-tree-menu-editor__item {
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

.demo-tree-menu-editor__item:hover {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, var(--xy-bg-color));
  color: var(--xy-color-primary);
}

.demo-tree-menu-editor__item.is-danger:hover {
  background: color-mix(in srgb, var(--xy-color-danger) 10%, var(--xy-bg-color));
  color: var(--xy-color-danger);
}

@media (max-width: 720px) {
  .demo-tree-menu-editor__grid {
    grid-template-columns: 1fr;
  }
}
</style>