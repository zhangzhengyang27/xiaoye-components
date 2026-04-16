<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import type { TreeInstance } from "xiaoye-components";

const treeRef = ref<TreeInstance | null>(null);
const currentRole = ref("运营管理员");
const savedRole = ref("运营管理员");
const currentPath = ref("点击任一权限节点查看路径");
const checkedKeys = ref<number[]>([]);
const halfCheckedKeys = ref<number[]>([]);
const savedCheckedKeys = ref<number[]>([111, 112, 121, 211]);
const summaryOpen = ref(false);
const saveMessage = ref("当前只演示本地权限回显与保存摘要。");

interface PermissionNode {
  id: number;
  label: string;
  children?: PermissionNode[];
}

const rolePresets = {
  运营管理员: [111, 112, 121, 211],
  财务负责人: [311, 312, 321],
  超级管理员: [111, 112, 121, 122, 211, 212, 311, 312, 321]
} as const;

const data: PermissionNode[] = [
  {
    id: 1,
    label: "用户与权限",
    children: [
      {
        id: 11,
        label: "角色管理",
        children: [
          { id: 111, label: "查看角色" },
          { id: 112, label: "编辑角色" }
        ]
      },
      {
        id: 12,
        label: "成员管理",
        children: [
          { id: 121, label: "查看成员" },
          { id: 122, label: "停用成员" }
        ]
      }
    ]
  },
  {
    id: 2,
    label: "订单与审批",
    children: [
      {
        id: 21,
        label: "订单审核",
        children: [
          { id: 211, label: "发起审核" },
          { id: 212, label: "撤回审核" }
        ]
      }
    ]
  },
  {
    id: 3,
    label: "结算与账单",
    children: [
      {
        id: 31,
        label: "账单管理",
        children: [
          { id: 311, label: "查看账单" },
          { id: 312, label: "导出账单" }
        ]
      },
      {
        id: 32,
        label: "结算管理",
        children: [{ id: 321, label: "发起结算" }]
      }
    ]
  }
];

const defaultExpandedKeys = [1, 2, 3];
const moduleActions = [
  { id: 1, label: "全选用户与权限" },
  { id: 2, label: "全选订单与审批" },
  { id: 3, label: "全选结算与账单" }
] as const;

const permissionLabelMap = new Map<number, string>();

function collectLabels(nodes: PermissionNode[]) {
  nodes.forEach((node) => {
    permissionLabelMap.set(node.id, node.label);
    if (node.children) {
      collectLabels(node.children);
    }
  });
}

collectLabels(data);

function normalizeKeys(keys: Array<string | number>) {
  return keys
    .map((key) => Number(key))
    .filter((key) => Number.isFinite(key));
}

const checkedCount = computed(() => checkedKeys.value.length);
const halfCheckedCount = computed(() => halfCheckedKeys.value.length);
const hasDirtyChanges = computed(() => {
  return JSON.stringify([...checkedKeys.value].sort((a, b) => a - b)) !==
    JSON.stringify([...savedCheckedKeys.value].sort((a, b) => a - b));
});
const addedPermissionLabels = computed(() =>
  checkedKeys.value
    .filter((key) => !savedCheckedKeys.value.includes(key))
    .map((key) => permissionLabelMap.get(key) ?? String(key))
);
const removedPermissionLabels = computed(() =>
  savedCheckedKeys.value
    .filter((key) => !checkedKeys.value.includes(key))
    .map((key) => permissionLabelMap.get(key) ?? String(key))
);
const summaryItems = computed(() => [
  { title: "当前角色", value: currentRole.value },
  { title: "勾选总数", value: `${checkedCount.value} 项` },
  { title: "半选模块", value: `${halfCheckedCount.value} 项` }
]);

function syncSelection() {
  checkedKeys.value = normalizeKeys(treeRef.value?.getCheckedKeys() ?? []);
  halfCheckedKeys.value = normalizeKeys(treeRef.value?.getHalfCheckedKeys() ?? []);
}

function collectLeafKeys(moduleId: number) {
  const rootNode = treeRef.value?.getNode(moduleId) as
    | {
        childNodes?: Array<{ key: number; isLeaf?: boolean; childNodes?: any[] }>;
      }
    | null;

  if (!rootNode?.childNodes) {
    return [];
  }

  const result: number[] = [];
  const queue = [...rootNode.childNodes];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (current.isLeaf || !current.childNodes?.length) {
      result.push(Number(current.key));
      continue;
    }

    queue.unshift(...current.childNodes);
  }

  return result;
}

function applyRole(role: keyof typeof rolePresets) {
  currentRole.value = role;
  treeRef.value?.setCheckedKeys([...rolePresets[role]]);
  syncSelection();
}

function savePermissions() {
  if (!hasDirtyChanges.value) {
    saveMessage.value = "当前没有待保存的权限差异。";
    return;
  }

  summaryOpen.value = true;
}

function confirmSavePermissions() {
  savedRole.value = currentRole.value;
  savedCheckedKeys.value = [...checkedKeys.value];
  saveMessage.value = `已保存「${currentRole.value}」权限版本，共 ${checkedCount.value} 项。`;
  summaryOpen.value = false;
}

function restoreSaved() {
  treeRef.value?.setCheckedKeys([...savedCheckedKeys.value]);
  currentRole.value = savedRole.value;
  syncSelection();
}

function clearChecked() {
  treeRef.value?.setCheckedKeys([]);
  syncSelection();
}

function selectModule(moduleId: number) {
  const nextKeys = Array.from(new Set([...checkedKeys.value, ...collectLeafKeys(moduleId)]));
  treeRef.value?.setCheckedKeys(nextKeys);
  syncSelection();
}

function clearModule(moduleId: number) {
  const moduleKeySet = new Set(collectLeafKeys(moduleId));
  treeRef.value?.setCheckedKeys(checkedKeys.value.filter((key) => !moduleKeySet.has(key)));
  syncSelection();
}

function handleCurrentChange(data: { id: number } | null) {
  if (!data) {
    currentPath.value = "未定位节点";
    return;
  }

  const path = treeRef.value?.getNodePath(data.id) ?? [];
  currentPath.value = path.map((item) => item.label).join(" / ");
}

onMounted(() => {
  nextTick(() => {
    syncSelection();
  });
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-tag status="primary">当前角色：{{ currentRole }}</xy-tag>
      <xy-tag status="neutral">已保存版本：{{ savedRole }}</xy-tag>
      <xy-tag status="neutral">已勾选 {{ checkedCount }} 项</xy-tag>
      <xy-tag status="warning">半选 {{ halfCheckedCount }} 项</xy-tag>
      <xy-tag :status="hasDirtyChanges ? 'warning' : 'success'">
        {{ hasDirtyChanges ? "存在未保存变更" : "已和保存版本一致" }}
      </xy-tag>
    </xy-space>

    <xy-space wrap>
      <xy-button plain @click="applyRole('运营管理员')">回显运营管理员</xy-button>
      <xy-button plain @click="applyRole('财务负责人')">回显财务负责人</xy-button>
      <xy-button plain @click="applyRole('超级管理员')">回显超级管理员</xy-button>
      <xy-button type="primary" @click="savePermissions">保存权限版本</xy-button>
      <xy-button plain @click="restoreSaved">恢复已保存版本</xy-button>
      <xy-button plain @click="clearChecked">清空勾选</xy-button>
    </xy-space>

    <xy-space wrap>
      <xy-button
        v-for="item in moduleActions"
        :key="`select-${item.id}`"
        plain
        @click="selectModule(item.id)"
      >
        {{ item.label }}
      </xy-button>
      <xy-button plain @click="clearModule(1)">清空用户与权限</xy-button>
      <xy-button plain @click="clearModule(2)">清空订单与审批</xy-button>
      <xy-button plain @click="clearModule(3)">清空结算与账单</xy-button>
    </xy-space>

    <xy-text size="sm" type="info">{{ saveMessage }}</xy-text>

    <div class="demo-tree-permission-grid">
      <section class="demo-tree-permission-panel">
        <xy-text size="sm" type="info">当前定位路径</xy-text>
        <strong class="demo-tree-permission-panel__title">{{ currentPath }}</strong>
        <xy-text size="sm" type="info">已勾选 keys：{{ checkedKeys.join(", ") || "无" }}</xy-text>
        <xy-text size="sm" type="info">半选 keys：{{ halfCheckedKeys.join(", ") || "无" }}</xy-text>
      </section>

      <section class="demo-tree-permission-panel">
        <xy-text size="sm" type="info">本次新增权限</xy-text>
        <div class="demo-tree-permission-tags">
          <xy-tag
            v-for="label in addedPermissionLabels"
            :key="`add-${label}`"
            status="success"
            round
          >
            {{ label }}
          </xy-tag>
          <xy-text v-if="addedPermissionLabels.length === 0" size="sm" type="info">无</xy-text>
        </div>

        <xy-text size="sm" type="info">本次移除权限</xy-text>
        <div class="demo-tree-permission-tags">
          <xy-tag
            v-for="label in removedPermissionLabels"
            :key="`remove-${label}`"
            status="warning"
            round
          >
            {{ label }}
          </xy-tag>
          <xy-text v-if="removedPermissionLabels.length === 0" size="sm" type="info">无</xy-text>
        </div>
      </section>
    </div>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        show-checkbox
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="[111, 112, 121, 211]"
        @check="syncSelection"
        @current-change="handleCurrentChange"
      />
    </div>

    <xy-dialog v-model="summaryOpen" title="保存前权限差异摘要">
      <div class="xy-doc-stack">
        <div class="demo-tree-permission-summary">
          <div
            v-for="item in summaryItems"
            :key="item.title"
            class="demo-tree-permission-summary__item"
          >
            <xy-text size="sm" type="info">{{ item.title }}</xy-text>
            <strong class="demo-tree-permission-summary__value">{{ item.value }}</strong>
          </div>
        </div>

        <div class="demo-tree-permission-modal-grid">
          <section class="demo-tree-permission-panel">
            <xy-text size="sm" type="info">即将新增</xy-text>
            <div class="demo-tree-permission-tags">
              <xy-tag
                v-for="label in addedPermissionLabels"
                :key="`modal-add-${label}`"
                status="success"
                round
              >
                {{ label }}
              </xy-tag>
              <xy-text v-if="addedPermissionLabels.length === 0" size="sm" type="info">无</xy-text>
            </div>
          </section>

          <section class="demo-tree-permission-panel">
            <xy-text size="sm" type="info">即将移除</xy-text>
            <div class="demo-tree-permission-tags">
              <xy-tag
                v-for="label in removedPermissionLabels"
                :key="`modal-remove-${label}`"
                status="warning"
                round
              >
                {{ label }}
              </xy-tag>
              <xy-text v-if="removedPermissionLabels.length === 0" size="sm" type="info">无</xy-text>
            </div>
          </section>
        </div>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="summaryOpen = false">取消</xy-button>
          <xy-button type="primary" @click="confirmSavePermissions">确认保存</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

<style scoped>
.demo-tree-permission-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.demo-tree-permission-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.demo-tree-permission-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.demo-tree-permission-summary__item {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 96%, white);
}

.demo-tree-permission-summary__value {
  color: var(--xy-text-color);
  font-size: 15px;
  line-height: 1.5;
}

.demo-tree-permission-panel {
  display: grid;
  gap: 8px;
  min-height: 100%;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 94%, white);
}

.demo-tree-permission-panel__title {
  color: var(--xy-text-color);
  font-size: 15px;
  line-height: 1.6;
}

.demo-tree-permission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 720px) {
  .demo-tree-permission-grid {
    grid-template-columns: 1fr;
  }

  .demo-tree-permission-modal-grid,
  .demo-tree-permission-summary {
    grid-template-columns: 1fr;
  }
}
</style>
