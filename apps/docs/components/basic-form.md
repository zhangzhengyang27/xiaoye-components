<script setup lang="ts">
import { reactive, ref } from "vue";

const selectValue = ref<string | null>("active");
const formModel = reactive({
  name: "",
  role: null as string | null
});

const formRules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
};

const formRef = ref<{
  validateField: (props?: string | string[]) => Promise<boolean>;
  clearValidate: (props?: string | string[]) => void;
  resetFields: (props?: string | string[]) => void;
} | null>(null);
const formFeedback = ref("尚未触发字段级操作");

async function validateNameField() {
  const valid = await formRef.value?.validateField("name");
  formFeedback.value = valid ? "名称字段校验通过" : "名称字段校验未通过";
}

function clearNameValidate() {
  formRef.value?.clearValidate("name");
  formFeedback.value = "已清空名称字段的校验信息";
}

function resetRoleField() {
  formRef.value?.resetFields("role");
  formFeedback.value = "已重置角色字段";
}
</script>

# 基础与表单

## Button

<xy-space>
  <xy-button>默认动作</xy-button>
  <xy-button status="success">通过</xy-button>
  <xy-button status="danger">删除</xy-button>
  <xy-button variant="outline">次要按钮</xy-button>
</xy-space>

```vue
<xy-button status="success">通过</xy-button>
```

## Input

<xy-input placeholder="请输入关键字" clearable />

```vue
<xy-input v-model="keyword" clearable placeholder="请输入关键字" />
```

## Select

<div class="xy-doc-stack">
  <xy-select
    v-model="selectValue"
    :options="[
      { label: '全部状态', value: 'all' },
      { label: '已启用', value: 'active' },
      { label: '已停用', value: 'inactive' }
    ]"
    placeholder="请选择状态"
    searchable
    clearable
    noMatchText="没有符合条件的状态"
  />
  <xy-tag status="primary">当前状态：{{ selectValue ?? '未选择' }}</xy-tag>
</div>

支持的高频交互：

- `ArrowDown / ArrowUp` 在下拉项间移动
- `Enter / Space` 选择当前高亮项
- `Escape` 关闭下拉并返回触发器
- `clearable + noMatchText` 适合中后台筛选栏

```vue
<xy-select
  v-model="status"
  searchable
  clearable
  noMatchText="没有符合条件的状态"
  :options="statusOptions"
/>
```

## Form 字段级控制

<div class="xy-doc-stack">
  <xy-form ref="formRef" :model="formModel" :rules="formRules">
    <xy-form-item label="成员名称" prop="name" help="失焦时会触发名称校验">
      <xy-input v-model="formModel.name" placeholder="请输入成员名称" />
    </xy-form-item>
    <xy-form-item label="角色" prop="role">
      <xy-select
        v-model="formModel.role"
        :options="[
          { label: '管理员', value: 'admin' },
          { label: '成员', value: 'member' },
          { label: '访客', value: 'guest' }
        ]"
        placeholder="请选择角色"
      />
    </xy-form-item>
  </xy-form>

  <xy-space wrap>
    <xy-button variant="outline" @click="validateNameField">只校验名称字段</xy-button>
    <xy-button variant="outline" @click="clearNameValidate">清空名称校验</xy-button>
    <xy-button variant="outline" @click="resetRoleField">重置角色字段</xy-button>
  </xy-space>

  <xy-tag :status="formFeedback.includes('通过') ? 'success' : 'warning'">
    {{ formFeedback }}
  </xy-tag>
</div>

这组接口比“整表单一次性提交”更适合中后台页面里的局部交互：

- `validateField("name")` 适合局部保存或向导式步骤
- `clearValidate("name")` 适合切换数据源后清掉旧错误态
- `resetFields("role")` 适合筛选项或表单分区回滚

```vue
const valid = await formRef.value?.validateField("name");
formRef.value?.clearValidate("name");
formRef.value?.resetFields("role");
```
