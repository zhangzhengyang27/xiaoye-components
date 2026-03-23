---
title: Modal 弹窗
description: 适合阻断上下文的录入、确认和强提示场景。
outline: deep
---

# Modal 弹窗

`xy-modal` 用于承载阻断式录入、确认和强提示。当前版本重点保证焦点转移、`Escape` 关闭、遮罩关闭和关闭后焦点恢复这几类基础行为。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <xy-button type="primary" @click="open = true">打开弹窗</xy-button>
  <xy-modal v-model="open" title="新建成员">
    <p>这里可以放表单、说明文本或二次确认内容。</p>

    <template #footer>
      <xy-space>
        <xy-button plain @click="open = false">取消</xy-button>
        <xy-button type="primary" @click="open = false">确认</xy-button>
      </xy-space>
    </template>
  </xy-modal>
</template>
```

## 常见场景

- 弹窗表单录入，例如新建成员、编辑信息。
- 二次确认，例如删除、停用、归档。
- 强提示或阻断式阅读，例如重要配置确认。

:::tip 使用建议
如果你的内容只是补充说明或轻量交互，不需要阻断主页面时，优先使用 `xy-tooltip`。  
只有在需要强制用户处理当前任务时，再使用 `xy-modal`。
:::

## 属性

| 属性               | 说明                   | 类型               | 默认值  |
| ------------------ | ---------------------- | ------------------ | ------- |
| `model-value`      | 是否打开弹窗           | `boolean`          | `false` |
| `title`            | 弹窗标题               | `string`           | `''`    |
| `width`            | 面板宽度               | `string \| number` | `560`   |
| `close-on-overlay` | 点击遮罩是否关闭       | `boolean`          | `true`  |
| `close-on-esc`     | 按下 `Escape` 是否关闭 | `boolean`          | `true`  |
| `destroy-on-close` | 关闭后是否销毁内容     | `boolean`          | `false` |

## 事件

| 事件                 | 说明                   | 参数      |
| -------------------- | ---------------------- | --------- |
| `update:model-value` | 弹窗开关状态变化时触发 | `boolean` |
| `open`               | 弹窗打开后触发         | —         |
| `close`              | 弹窗关闭时触发         | —         |

## 插槽

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 弹窗主体内容     |
| `header`  | 自定义头部内容   |
| `footer`  | 自定义底部操作区 |

## 可访问性与行为约定

- 使用 `dialog` 和 `aria-modal="true"` 语义。
- 打开后会把焦点带入弹窗内部的第一个可聚焦元素。
- `Tab / Shift+Tab` 会在弹窗内部循环。
- 关闭后会尝试把焦点恢复到触发弹窗的元素。
- 当设置了 `title` 时，会自动补齐 `aria-labelledby`；主体内容会通过 `aria-describedby` 关联。
