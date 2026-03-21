---
title: Button 按钮
description: 页面主操作、次要操作和轻量文本动作入口。
outline: deep
---

# Button 按钮

<p class="xy-doc-lead">
  `xy-button` 用来触发即时操作。它不追求复杂变体，而是优先覆盖后台页面里最常见的主按钮、次按钮、危险按钮和加载按钮。
</p>

## 基础用法

<xy-space wrap>
  <xy-button>主要操作</xy-button>
  <xy-button variant="outline">次要操作</xy-button>
  <xy-button variant="ghost">弱化操作</xy-button>
  <xy-button variant="text">文本操作</xy-button>
</xy-space>

```vue
<xy-space wrap>
  <xy-button>主要操作</xy-button>
  <xy-button variant="outline">次要操作</xy-button>
  <xy-button variant="ghost">弱化操作</xy-button>
  <xy-button variant="text">文本操作</xy-button>
</xy-space>
```

## 状态、尺寸与块级布局

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-button status="success">通过</xy-button>
    <xy-button status="warning">提醒</xy-button>
    <xy-button status="danger">删除</xy-button>
  </xy-space>

  <xy-space wrap>
    <xy-button size="sm">小号按钮</xy-button>
    <xy-button size="md">默认按钮</xy-button>
    <xy-button size="lg">大号按钮</xy-button>
  </xy-space>

  <xy-button block>整行保存</xy-button>
</div>

对于后台页面，通常把最关键的动作放在 `solid + primary`，把取消、重置、导出这类次要操作放在 `outline`。

## 加载、禁用与前后缀

<xy-space wrap>
  <xy-button loading>保存中</xy-button>
  <xy-button disabled>已禁用</xy-button>
  <xy-button>
    <template #prefix>
      <xy-icon icon="mdi:magnify" />
    </template>
    搜索
  </xy-button>
  <xy-button variant="outline">
    导出
    <template #suffix>
      <xy-icon icon="mdi:chevron-down" />
    </template>
  </xy-button>
</xy-space>

:::tip 行为约定
当 `loading` 或 `disabled` 为 `true` 时，组件会阻止 `click` 事件继续向外派发，避免重复提交。
:::

## 何时使用

- 页面主操作，例如保存、创建、提交。
- 工具栏操作，例如导出、重置筛选、批量处理。
- 表格或段落中的轻量动作，例如“查看详情”“复制链接”。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 按钮视觉风格 | `'solid' \| 'outline' \| 'ghost' \| 'text'` | `'solid'` |
| `status` | 状态语义，决定颜色风格 | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |
| `size` | 按钮尺寸 | `'sm' \| 'md' \| 'lg'` | 跟随全局配置 |
| `disabled` | 是否禁用交互 | `boolean` | `false` |
| `loading` | 是否显示加载态，并阻止点击 | `boolean` | `false` |
| `block` | 是否占满整行宽度 | `boolean` | `false` |
| `native-type` | 原生按钮类型 | `'button' \| 'submit' \| 'reset'` | `'button'` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击按钮时触发；当 `loading` 或 `disabled` 时不会触发 | `MouseEvent` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 按钮主内容 |
| `prefix` | 按钮前缀内容，通常用于图标 |
| `suffix` | 按钮后缀内容，通常用于图标或补充提示 |

## 可访问性与行为约定

- 使用原生 `button` 元素实现，天然支持键盘触发和禁用态。
- `native-type` 可直接用于表单提交、重置等原生按钮场景。
- `loading` 状态下会保留按钮布局，并通过禁用交互避免重复提交。
