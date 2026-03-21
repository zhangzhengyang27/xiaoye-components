---
title: 基础与表单组件
description: Button、Input、Select、Form 在后台页面中的常见用法。
outline: deep
---

<script setup lang="ts">
import { reactive, ref } from "vue";

const keyword = ref("");
const selectValue = ref<string | null>("active");
const drawerVisible = ref(false);
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

# 基础与表单组件

这组组件负责页面里的主操作、数据录入和字段校验。建议先看 Button / Input / Select 的基础交互，再看 Form 的字段级控制。

:::tip 单组件页
如果你需要查完整的属性、事件和插槽表，优先看 [Button 按钮](/components/button) 和 [Select 选择器](/components/select)。
:::

## Button 按钮

按钮用于页面主操作、次要操作和轻量文本动作。

### 基础用法

<xy-space wrap>
  <xy-button>默认动作</xy-button>
  <xy-button status="success">通过</xy-button>
  <xy-button status="danger">删除</xy-button>
  <xy-button variant="outline">次要按钮</xy-button>
</xy-space>

对于后台页面，通常把最关键的动作放在 `solid + primary`，把次要动作放在 `outline`，把低强调度操作放在 `ghost` 或 `text`。

### 选择哪种按钮风格

- `solid`：主操作，例如保存、创建、提交。
- `outline`：次要操作，例如取消、重置、导出。
- `ghost`：需要保留按钮形态，但不想抢主视觉时使用。
- `text`：放在表格操作列或段落上下文里，适合轻量动作。

### Button API 摘要

| 属性          | 说明                       | 类型                                                           | 默认值       |
| ------------- | -------------------------- | -------------------------------------------------------------- | ------------ |
| `variant`     | 按钮视觉风格               | `'solid' \| 'outline' \| 'ghost' \| 'text'`                    | `solid`      |
| `status`      | 状态语义                   | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `primary`    |
| `size`        | 按钮尺寸                   | `'sm' \| 'md' \| 'lg'`                                         | 跟随全局配置 |
| `disabled`    | 是否禁用                   | `boolean`                                                      | `false`      |
| `loading`     | 是否显示加载态，并阻止点击 | `boolean`                                                      | `false`      |
| `block`       | 是否撑满整行               | `boolean`                                                      | `false`      |
| `native-type` | 原生按钮类型               | `'button' \| 'submit' \| 'reset'`                              | `button`     |

### Button 插槽

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 按钮主内容   |
| `prefix`  | 按钮前缀内容 |
| `suffix`  | 按钮后缀内容 |

完整 API 见 [Button 按钮](/components/button)。

更多示例和完整表格见 [Button 按钮](/components/button)。

## Input 输入框

输入框适合关键字搜索、名称录入和短文本字段。

### 基础用法

<div class="xy-doc-stack">
  <xy-input v-model="keyword" placeholder="请输入关键字" clearable />
  <xy-tag status="neutral">当前输入：{{ keyword || "空" }}</xy-tag>
</div>

`clearable` 很适合筛选栏；在表单语境里，`change / blur` 事件会自动接上 `FormItem` 校验。

### Input API 摘要

| 属性          | 说明             | 类型                                                      | 默认值       |
| ------------- | ---------------- | --------------------------------------------------------- | ------------ |
| `model-value` | 输入值           | `string \| number`                                        | `""`         |
| `placeholder` | 占位提示         | `string`                                                  | `""`         |
| `disabled`    | 是否禁用         | `boolean`                                                 | `false`      |
| `clearable`   | 是否显示清空按钮 | `boolean`                                                 | `false`      |
| `readonly`    | 是否只读         | `boolean`                                                 | `false`      |
| `type`        | 输入类型         | `'text' \| 'password' \| 'email' \| 'search' \| 'number'` | `text`       |
| `size`        | 输入框尺寸       | `'sm' \| 'md' \| 'lg'`                                    | 跟随全局配置 |

### Input 事件

| 事件                 | 说明                   | 参数         |
| -------------------- | ---------------------- | ------------ |
| `update:model-value` | 输入时更新值           | `string`     |
| `change`             | 原生 change 触发时派发 | `string`     |
| `clear`              | 点击清空按钮时派发     | —            |
| `focus`              | 获取焦点时派发         | `FocusEvent` |
| `blur`               | 失焦时派发             | `FocusEvent` |

## Select 选择器

选择器适合筛选栏和固定枚举值录入，当前版本优先覆盖“单选 + 搜索 + 清空 + 键盘导航”这条高频路径。

### 基础用法

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
    no-match-text="没有符合条件的状态"
  />
  <xy-tag status="primary">当前状态：{{ selectValue ?? '未选择' }}</xy-tag>
</div>

### 键盘体验

- `ArrowDown / ArrowUp` 在选项间移动。
- `Enter / Space` 选择当前高亮项。
- `Escape` 关闭下拉并把焦点还给触发器。
- `clearable + no-match-text` 很适合后台筛选栏。

### Select API 摘要

| 属性            | 说明               | 类型                       | 默认值       |
| --------------- | ------------------ | -------------------------- | ------------ |
| `model-value`   | 当前选中值         | `string \| number \| null` | `null`       |
| `options`       | 选项列表           | `SelectOption[]`           | `[]`         |
| `placeholder`   | 未选择时的占位提示 | `string`                   | `请选择`     |
| `disabled`      | 是否禁用           | `boolean`                  | `false`      |
| `clearable`     | 是否允许清空       | `boolean`                  | `false`      |
| `searchable`    | 是否支持搜索       | `boolean`                  | `false`      |
| `size`          | 尺寸               | `'sm' \| 'md' \| 'lg'`     | 跟随全局配置 |
| `no-data-text`  | 无选项时的文案     | `string`                   | `暂无选项`   |
| `no-match-text` | 搜索无结果时的文案 | `string`                   | `没有匹配项` |

### Select 事件

| 事件                 | 说明                 | 参数                       |
| -------------------- | -------------------- | -------------------------- |
| `update:model-value` | 选中值变化时派发     | `string \| number \| null` |
| `change`             | 选中值变化时派发     | `string \| number \| null` |
| `clear`              | 清空时派发           | —                          |
| `visible-change`     | 下拉打开或关闭时派发 | `boolean`                  |
| `focus`              | 打开下拉时派发       | —                          |
| `blur`               | 关闭下拉时派发       | —                          |

完整 API 见 [Select 选择器](/components/select)。

更多示例和完整表格见 [Select 选择器](/components/select)。

## Form / FormItem 表单

表单适合弹窗录入、局部保存和字段级交互。相比“整表一次性提交”，`validateField / clearValidate / resetFields` 更适合后台页面的局部流程。

### 字段级控制

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

### 什么时候用字段级 API

- `validateField("name")`：适合局部保存或向导式步骤。
- `clearValidate("name")`：适合切换数据源后清掉旧错误态。
- `resetFields("role")`：适合筛选项或表单分区回滚。

### Form API 摘要

| 属性             | 说明         | 类型                           | 默认值  |
| ---------------- | ------------ | ------------------------------ | ------- |
| `model`          | 表单数据对象 | `Record<string, unknown>`      | —       |
| `rules`          | 校验规则集合 | `Record<string, XyFormRule[]>` | `{}`    |
| `label-width`    | 标签宽度     | `string \| number`             | `112px` |
| `label-position` | 标签位置     | `'left' \| 'top'`              | `left`  |
| `size`           | 全局尺寸     | `'sm' \| 'md' \| 'lg'`         | `md`    |

### Form 暴露方法

| 方法                             | 说明                                         |
| -------------------------------- | -------------------------------------------- |
| `validate()`                     | 校验全部字段，返回 `Promise<boolean>`        |
| `validateField(props, trigger?)` | 校验指定字段，`props` 支持字符串或字符串数组 |
| `resetFields(props?)`            | 重置全部或指定字段到初始值                   |
| `clearValidate(props?)`          | 清空全部或指定字段的校验状态                 |

### FormItem API 摘要

| 属性       | 说明                           | 类型           | 默认值  |
| ---------- | ------------------------------ | -------------- | ------- |
| `label`    | 字段标签                       | `string`       | `""`    |
| `prop`     | 对应字段名                     | `string`       | `""`    |
| `rules`    | 额外规则，会和 Form 级规则合并 | `XyFormRule[]` | `[]`    |
| `required` | 是否必填                       | `boolean`      | `false` |
| `help`     | 默认提示文案                   | `string`       | `""`    |

## Drawer 抽屉

当录入内容更长、你又不想完全打断当前页面时，优先考虑 Drawer，而不是继续堆 Modal。

### 侧边编辑示例

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-button @click="drawerVisible = true">打开侧边编辑</xy-button>
    <xy-tag status="warning">适合大表单、详情侧滑编辑和保留列表上下文</xy-tag>
  </xy-space>

  <xy-drawer v-model="drawerVisible" title="编辑成员资料">
    <xy-form :model="formModel" :rules="formRules">
      <xy-form-item label="成员名称" prop="name">
        <xy-input v-model="formModel.name" placeholder="请输入成员名称" />
      </xy-form-item>
      <xy-form-item label="角色" prop="role">
        <xy-select
          v-model="formModel.role"
          searchable
          :options="[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' },
            { label: '访客', value: 'guest' }
          ]"
        />
      </xy-form-item>
    </xy-form>

    <template #footer>
      <xy-space>
        <xy-button variant="outline" @click="drawerVisible = false">取消</xy-button>
        <xy-button @click="drawerVisible = false">保存</xy-button>
      </xy-space>
    </template>

  </xy-drawer>
</div>

### 什么时候用 Drawer 而不是 Modal

- 表单字段更多，需要更大的纵向编辑空间。
- 你希望用户还能感知列表或详情页上下文。
- 详情查看和编辑天然是“侧边进入”的交互路径。

完整 API 见 [Drawer 抽屉](/components/drawer)。
