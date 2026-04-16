<script setup lang="ts">
import { computed, ref } from "vue";
import type { TreeInstance } from "xiaoye-components";

interface OrgNode {
  id: number;
  label: string;
  isLeaf?: boolean;
  disabled?: boolean;
}

const treeRef = ref<TreeInstance | null>(null);
const currentText = ref("点击部门节点查看当前定位");
const loadFeedback = ref("点击可展开部门以加载组织单元");
const activeNode = ref<OrgNode | null>(null);
const detailOpen = ref(false);
const assignOpen = ref(false);
const assignDraft = ref<string[]>([]);
const assignmentMap = ref<Record<number, string[]>>({
  11: ["Luna"],
  21: ["Aiden", "Mia"],
  211: ["Ethan"]
});
const failedNodeIds = new Set<number>();
const disabledReasons = new Map<number, string>([
  [3, "组织已封存，不再参与人员归属分配。"],
  [12, "法务与合规处于冻结期，本轮不开放归属调整。"],
  [22, "华南区当前正在做组织拆分，暂不允许选中。"],
  [112, "出纳组处于交接流程中，暂时只读。"]
]);

const data: OrgNode[] = [
  { id: 1, label: "总部组织" },
  { id: 2, label: "区域组织" },
  { id: 3, label: "已封存组织", disabled: true, isLeaf: true }
];

function load(
  node: { level: number; data?: OrgNode },
  resolve: (data: OrgNode[]) => void,
  reject: () => void
) {
  window.setTimeout(() => {
    if (node.level === 2 && node.data?.id === 21 && !failedNodeIds.has(21)) {
      failedNodeIds.add(21);
      loadFeedback.value = "华东区首次加载失败，点击节点再次展开即可重试。";
      reject();
      return;
    }

    if (node.level === 1 && node.data?.id === 1) {
      resolve([
        { id: 11, label: "财务中心" },
        { id: 12, label: "法务与合规", disabled: true, isLeaf: true }
      ]);
      loadFeedback.value = "总部组织已同步完成。";
      return;
    }

    if (node.level === 1 && node.data?.id === 2) {
      resolve([
        { id: 21, label: "华东区" },
        { id: 22, label: "华南区", disabled: true, isLeaf: true }
      ]);
      loadFeedback.value = "区域组织已同步完成。";
      return;
    }

    if (node.level === 2 && node.data?.id === 11) {
      resolve([
        { id: 111, label: "结算组", isLeaf: true },
        { id: 112, label: "出纳组", isLeaf: true, disabled: true }
      ]);
      loadFeedback.value = "财务中心下级组织已加载。";
      return;
    }

    if (node.level === 2 && node.data?.id === 21) {
      resolve([
        { id: 211, label: "上海办公室", isLeaf: true },
        { id: 212, label: "杭州办公室", isLeaf: true }
      ]);
      loadFeedback.value = "华东区重试成功。";
      return;
    }

    loadFeedback.value = "当前节点没有更多下级组织。";
    resolve([]);
  }, 280);
}

const currentPath = computed(() => {
  if (!activeNode.value) {
    return "未定位节点";
  }

  const path = treeRef.value?.getNodePath(activeNode.value.id) ?? [];
  return path.map((item) => item.label).join(" / ");
});

const disabledReason = computed(() => {
  if (!activeNode.value?.id) {
    return "";
  }

  return disabledReasons.get(activeNode.value.id) ?? "";
});
const activeMembers = computed(() => {
  if (!activeNode.value?.id) {
    return [];
  }

  return assignmentMap.value[activeNode.value.id] ?? [];
});
const memberOptions = [
  { label: "Luna（财务BP）", value: "Luna", description: "负责结算规则同步" },
  { label: "Aiden（区域HR）", value: "Aiden", description: "负责组织编制调整" },
  { label: "Mia（法务）", value: "Mia", description: "负责封存与冻结审批" },
  { label: "Ethan（办公室行政）", value: "Ethan", description: "负责办公点维护" }
];

function handleCurrentChange(data: OrgNode | null) {
  activeNode.value = data;
  currentText.value = data ? `当前定位：${data.label}` : "未定位节点";
}

function openDetailDrawer() {
  if (!activeNode.value) {
    return;
  }

  detailOpen.value = true;
}

function openAssignDialog() {
  if (!activeNode.value || activeNode.value.disabled) {
    return;
  }

  assignDraft.value = [...activeMembers.value];
  assignOpen.value = true;
}

function saveAssignment() {
  if (!activeNode.value) {
    return;
  }

  assignmentMap.value = {
    ...assignmentMap.value,
    [activeNode.value.id]: [...assignDraft.value]
  };
  loadFeedback.value = `已更新「${activeNode.value.label}」成员分配：${assignDraft.value.join("、") || "无"}`;
  assignOpen.value = false;
}
</script>

<template>
  <div class="xy-doc-stack">
    <div class="demo-tree-org-grid">
      <section class="demo-tree-org-panel">
        <xy-text size="sm" type="info">{{ currentText }}</xy-text>
        <strong class="demo-tree-org-panel__title">{{ currentPath }}</strong>
        <xy-text size="sm" type="info">{{ loadFeedback }}</xy-text>
        <xy-text size="sm" type="info">
          灰态节点表示封存部门或不可分配单元，懒加载展开后仍会参与路径与高亮，但不会进入键盘焦点流。
        </xy-text>
        <xy-text
          v-if="disabledReason"
          size="sm"
          type="warning"
        >
          禁用原因：{{ disabledReason }}
        </xy-text>

        <xy-space wrap>
          <xy-button type="primary" :disabled="!activeNode" @click="openDetailDrawer">
            查看部门详情
          </xy-button>
          <xy-button plain :disabled="!activeNode || Boolean(activeNode?.disabled)" @click="openAssignDialog">
            分配成员
          </xy-button>
        </xy-space>
      </section>

      <section class="demo-tree-org-panel">
        <xy-text size="sm" type="info">说明</xy-text>
        <div class="demo-tree-org-badges">
          <xy-tooltip
            v-for="[id, reason] in disabledReasons.entries()"
            :key="id"
            :content="reason"
            placement="top-start"
          >
            <xy-tag status="warning" round>禁用节点 {{ id }}</xy-tag>
          </xy-tooltip>
        </div>

        <xy-text size="sm" type="info">当前已分配成员</xy-text>
        <div class="demo-tree-org-badges">
          <xy-tag
            v-for="member in activeMembers"
            :key="member"
            status="primary"
            round
          >
            {{ member }}
          </xy-tag>
          <xy-text v-if="activeMembers.length === 0" size="sm" type="info">未分配</xy-text>
        </div>
      </section>
    </div>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        lazy
        highlight-current
        :props="{ label: 'label', isLeaf: 'isLeaf', disabled: 'disabled' }"
        :load="load"
        @current-change="handleCurrentChange"
      />
    </div>

    <xy-drawer
      v-model="detailOpen"
      title="组织单元详情"
      placement="right"
      size="420px"
    >
      <div class="xy-doc-stack">
        <xy-tag :status="activeNode?.disabled ? 'warning' : 'success'" round>
          {{ activeNode?.disabled ? "禁用节点" : "可分配节点" }}
        </xy-tag>
        <xy-text size="sm" type="info">当前节点</xy-text>
        <strong>{{ activeNode?.label ?? "未选择" }}</strong>
        <xy-text size="sm" type="info">路径</xy-text>
        <xy-text>{{ currentPath }}</xy-text>
        <xy-text size="sm" type="info">成员归属</xy-text>
        <div class="demo-tree-org-badges">
          <xy-tag
            v-for="member in activeMembers"
            :key="`drawer-${member}`"
            status="primary"
            round
          >
            {{ member }}
          </xy-tag>
          <xy-text v-if="activeMembers.length === 0" size="sm" type="info">未分配</xy-text>
        </div>
        <xy-text v-if="disabledReason" size="sm" type="warning">
          禁用原因：{{ disabledReason }}
        </xy-text>
      </div>
    </xy-drawer>

    <xy-dialog v-model="assignOpen" title="分配组织成员">
      <div class="xy-doc-stack">
        <xy-text size="sm" type="info">
          当前组织：{{ activeNode?.label ?? "未选择" }}
        </xy-text>
        <xy-checkbox-group
          v-model="assignDraft"
          direction="vertical"
          :options="memberOptions"
        />
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="assignOpen = false">取消</xy-button>
          <xy-button type="primary" @click="saveAssignment">确认分配</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

<style scoped>
.demo-tree-org-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.demo-tree-org-panel {
  display: grid;
  gap: 8px;
  min-height: 100%;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 94%, white);
}

.demo-tree-org-panel__title {
  color: var(--xy-text-color);
  font-size: 15px;
  line-height: 1.6;
}

.demo-tree-org-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 720px) {
  .demo-tree-org-grid {
    grid-template-columns: 1fr;
  }
}
</style>
