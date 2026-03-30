<script setup lang="ts">
import { reactive, ref } from "vue";

interface MemberRow {
  id: number;
  name: string;
  role: string;
  status: "启用" | "停用";
}

const rows = ref<MemberRow[]>([
  { id: 1, name: "小叶", role: "运营负责人", status: "启用" },
  { id: 2, name: "小星", role: "财务协同", status: "停用" }
]);

const drawerOpen = ref(false);
const modalOpen = ref(false);
const editingRow = ref<MemberRow | null>(null);

const drawerModel = reactive({
  name: "",
  role: "",
  status: "启用"
});

const modalModel = reactive({
  owner: "",
  remark: ""
});

function openDrawer(row?: MemberRow) {
  editingRow.value = row ?? null;
  Object.assign(drawerModel, {
    name: row?.name ?? "",
    role: row?.role ?? "",
    status: row?.status ?? "启用"
  });
  drawerOpen.value = true;
}

function openModal(row: MemberRow) {
  editingRow.value = row;
  Object.assign(modalModel, {
    owner: row.name,
    remark: `${row.name} 的附加审批说明`
  });
  modalOpen.value = true;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="收口后的理解方式">
      <p>
        这里不再把“抽屉表单”和“弹窗表单”当作两套独立能力来理解，而是统一理解为覆盖层编辑。
      </p>
      <p>
        体量较大、需要保留列表上下文时走抽屉；字段较少、只想做快速确认时走弹窗。
      </p>
    </xy-card>

    <xy-pro-table
      title="成员台账"
      description="同一个列表里同时存在“完整编辑”和“快速补充说明”两类覆盖层动作。"
      :data="rows"
      :columns="[
        { prop: 'name', label: '成员', minWidth: 140 },
        { prop: 'role', label: '岗位', minWidth: 180 },
        { prop: 'status', label: '状态', slot: 'status', minWidth: 120 },
        { key: 'actions', label: '操作', slot: 'actions', width: 220, align: 'right' }
      ]"
      :pagination="false"
      :toolbar-actions="[{ key: 'create', label: '新建成员', type: 'primary' }]"
      :table-props="{ rowKey: 'id' }"
      @toolbar-action="openDrawer()"
    >
      <template #status="{ row }">
        <xy-tag :status="row.status === '启用' ? 'success' : 'warning'">
          {{ row.status }}
        </xy-tag>
      </template>

      <template #actions="{ row }">
        <xy-space>
          <xy-button text @click="openDrawer(row)">完整编辑</xy-button>
          <xy-button text @click="openModal(row)">快速说明</xy-button>
        </xy-space>
      </template>
    </xy-pro-table>

    <xy-overlay-form
      v-model:open="drawerOpen"
      container="drawer"
      :mode="editingRow ? 'edit' : 'create'"
      title="覆盖层编辑：完整表单"
      :model="drawerModel"
    >
      <xy-form-item label="成员名称" prop="name">
        <xy-input v-model="drawerModel.name" placeholder="请输入成员名称" />
      </xy-form-item>
      <xy-form-item label="岗位说明" prop="role">
        <xy-input v-model="drawerModel.role" placeholder="请输入岗位说明" />
      </xy-form-item>
      <xy-form-item label="状态" prop="status">
        <xy-select
          v-model="drawerModel.status"
          :options="[
            { label: '启用', value: '启用' },
            { label: '停用', value: '停用' }
          ]"
        />
      </xy-form-item>
    </xy-overlay-form>

    <xy-overlay-form
      v-model:open="modalOpen"
      container="modal"
      title="覆盖层编辑：快速补充"
      :model="modalModel"
    >
      <xy-form-item label="责任人" prop="owner">
        <xy-input v-model="modalModel.owner" placeholder="请输入责任人" />
      </xy-form-item>
      <xy-form-item label="补充说明" prop="remark">
        <xy-input v-model="modalModel.remark" type="textarea" placeholder="请输入补充说明" />
      </xy-form-item>
    </xy-overlay-form>
  </div>
</template>
