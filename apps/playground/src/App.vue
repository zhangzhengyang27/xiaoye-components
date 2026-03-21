<script setup lang="ts">
import { computed, reactive, ref } from "vue"

interface MemberRow {
  id: number
  name: string
  owner: string
  role: string
  status: string
  updatedAt: string
}

interface FormInstance {
  validate: () => Promise<boolean>
  resetFields: (props?: string | string[]) => void
}

const open = ref(false)
const activeTab = ref("members")
const formRef = ref<FormInstance | null>(null)
const saveFeedback = ref("待提交")
const activeRow = ref<MemberRow | null>(null)

const filters = reactive({
  keyword: "",
  role: null as string | null
})

const memberForm = reactive({
  name: "",
  role: null as string | null
})

const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
}

const rows = ref<MemberRow[]>([
  {
    id: 1,
    name: "Billing Console",
    owner: "Xiaoye",
    role: "admin",
    status: "开发中",
    updatedAt: "2026-03-21"
  },
  {
    id: 2,
    name: "Sales Admin",
    owner: "Alice",
    role: "member",
    status: "已上线",
    updatedAt: "2026-03-20"
  },
  {
    id: 3,
    name: "Support Hub",
    owner: "Bob",
    role: "guest",
    status: "设计中",
    updatedAt: "2026-03-19"
  }
])

const roleOptions = [
  { label: "管理员", value: "admin" },
  { label: "成员", value: "member" },
  { label: "访客", value: "guest" }
]

const filteredRows = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase()

  return rows.value.filter((row) => {
    const matchedKeyword =
      !keyword ||
      row.name.toLowerCase().includes(keyword) ||
      row.owner.toLowerCase().includes(keyword)
    const matchedRole = !filters.role || row.role === filters.role

    return matchedKeyword && matchedRole
  })
})

function handleOpenCreate() {
  open.value = true
  saveFeedback.value = "请填写成员信息"
}

function handleRowClick(row: MemberRow) {
  activeRow.value = row
}

function rowClassName(row: MemberRow) {
  return activeRow.value?.id === row.id ? "playground-row-active" : ""
}

function resetFilters() {
  filters.keyword = ""
  filters.role = null
  activeRow.value = null
}

async function handleSave() {
  const valid = await formRef.value?.validate()

  if (!valid) {
    saveFeedback.value = "校验未通过，请检查必填项"
    return
  }

  const nextRow: MemberRow = {
    id: Date.now(),
    name: memberForm.name,
    owner: "Xiaoye",
    role: memberForm.role ?? "member",
    status: "待启用",
    updatedAt: "2026-03-21"
  }

  rows.value = [nextRow, ...rows.value]
  activeRow.value = nextRow
  saveFeedback.value = `已创建成员：${memberForm.name}`
  open.value = false
  formRef.value?.resetFields()
}
</script>

<template>
  <xy-config-provider>
    <main class="page-shell">
      <section class="panel hero-panel">
        <div>
          <xy-tag status="primary">MVP Playground</xy-tag>
          <h1>把中后台高频交互收敛成一个稳定的 Vue 3 组件库基线</h1>
          <p>
            这里不只展示组件长什么样，还用真实页面把 `Tabs / Select / Table / Modal / Form / Tooltip`
            串成回归样板。
          </p>
        </div>
        <xy-space wrap>
          <xy-tooltip content="打开弹窗后，焦点会自动进入弹窗；按 Escape 可关闭并返回触发按钮。">
            <xy-button @click="handleOpenCreate">新建成员</xy-button>
          </xy-tooltip>
          <xy-button variant="outline">导出数据</xy-button>
        </xy-space>
      </section>

      <section class="panel">
        <div class="status-strip">
          <xy-tag status="success">当前页签：{{ activeTab }}</xy-tag>
          <xy-tag :status="activeRow ? 'primary' : 'neutral'">
            当前行：{{ activeRow ? activeRow.name : '未选择' }}
          </xy-tag>
          <xy-tag :status="saveFeedback.includes('已创建') ? 'success' : 'warning'">
            {{ saveFeedback }}
          </xy-tag>
        </div>

        <xy-tabs
          v-model="activeTab"
          :items="[
            { key: 'members', label: '成员' },
            { key: 'projects', label: '项目' },
            { key: 'settings', label: '设置' }
          ]"
        >
          <template #default>
            <div class="stack">
              <xy-space wrap>
                <xy-input
                  v-model="filters.keyword"
                  placeholder="搜索成员 / 项目"
                  clearable
                />
                <xy-select
                  v-model="filters.role"
                  searchable
                  clearable
                  placeholder="角色筛选"
                  no-match-text="没有符合条件的角色"
                  :options="roleOptions"
                />
                <xy-button variant="outline" @click="resetFilters">重置筛选</xy-button>
              </xy-space>

              <xy-table
                :columns="[
                  { key: 'name', title: '项目名称', dataIndex: 'name' },
                  { key: 'owner', title: '负责人', dataIndex: 'owner' },
                  { key: 'role', title: '角色', dataIndex: 'role' },
                  { key: 'status', title: '状态', dataIndex: 'status' }
                ]"
                :data="filteredRows"
                row-key="id"
                :row-class-name="rowClassName"
                striped
                @row-click="handleRowClick"
              >
                <template #empty>
                  <xy-empty title="没有匹配成员" description="换个关键字或重置筛选试试">
                    <xy-button variant="outline" @click="resetFilters">恢复默认数据</xy-button>
                  </xy-empty>
                </template>
              </xy-table>

              <xy-pagination :total="filteredRows.length * 10" />
            </div>
          </template>
        </xy-tabs>
      </section>

      <xy-modal v-model="open" title="新建成员">
        <xy-form ref="formRef" :model="memberForm" :rules="rules">
          <xy-form-item
            label="成员名称"
            prop="name"
            help="失焦时会触发名称校验"
          >
            <xy-input v-model="memberForm.name" placeholder="请输入成员名称" />
          </xy-form-item>
          <xy-form-item label="角色" prop="role">
            <xy-select
              v-model="memberForm.role"
              searchable
              no-match-text="没有符合条件的角色"
              :options="roleOptions"
            />
          </xy-form-item>
        </xy-form>

        <template #footer>
          <xy-space>
            <xy-button variant="outline" @click="open = false">取消</xy-button>
            <xy-button @click="handleSave">保存</xy-button>
          </xy-space>
        </template>
      </xy-modal>
    </main>
  </xy-config-provider>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fafc, #eef2ff);
}

.panel {
  max-width: 1080px;
  margin: 0 auto 24px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 28px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.hero-panel h1 {
  margin: 16px 0 8px;
  font-size: 36px;
  line-height: 1.1;
}

.hero-panel p {
  margin: 0;
  color: #64748b;
}

.status-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.playground-row-active td) {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}

@media (max-width: 900px) {
  .page-shell {
    padding: 16px;
  }

  .hero-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
