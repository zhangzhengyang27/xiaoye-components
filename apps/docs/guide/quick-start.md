---
title: 快速开始
description: 在 Vue 3 项目中接入基础层和中后台业务增强层。
outline: deep
---

# 快速开始

这页先帮你用最短路径把基础层 `xiaoye-components` 和增强层 `xiaoye-pro-components` 接进 Vue 3 项目，并尽快跑通第一个页面。

<p class="xy-section-lead">
  如果你只是想先搭基础页面，可以先只接基础层。只有当你已经明确在做中后台页面闭环时，再叠加增强层会更稳。
</p>

## 安装基础层

::: code-group

```bash [pnpm]
pnpm add xiaoye-components
```

```bash [npm]
npm install xiaoye-components
```

```bash [yarn]
yarn add xiaoye-components
```

:::

## 只接基础层

```ts [main.ts]
import { createApp } from "vue";
import XiaoyeComponents from "xiaoye-components";
import "xiaoye-components/style.css";
import App from "./App.vue";

const app = createApp(App);

app.use(XiaoyeComponents);
app.mount("#app");
```

## 安装增强层

如果你的项目已经明确是中后台页面，并且需要筛选栏、请求表单、页面容器、详情编排、批量动作和流程增强件，可以叠加安装增强层。

::: code-group

```bash [pnpm]
pnpm add xiaoye-components xiaoye-pro-components
```

```bash [npm]
npm install xiaoye-components xiaoye-pro-components
```

```bash [yarn]
yarn add xiaoye-components xiaoye-pro-components
```

:::

## 基础层 + 增强层一起引入

```ts [main.ts]
import { createApp } from "vue";
import XiaoyeComponents from "xiaoye-components";
import XiaoyeProComponents from "xiaoye-pro-components";
import "xiaoye-components/style.css";
import "xiaoye-pro-components/style.css";
import App from "./App.vue";

const app = createApp(App);

app.use(XiaoyeComponents);
app.use(XiaoyeProComponents);
app.mount("#app");
```

## 在模板中直接使用

完成安装后，就可以在模板里直接写基础层和增强层组件标签。

```vue [App.vue]
<template>
  <xy-space>
    <xy-button type="primary">保存</xy-button>
    <xy-button plain>取消</xy-button>
  </xy-space>

  <xy-search-form
    :model="{ keyword: '' }"
    :fields="[{ prop: 'keyword', label: '关键词', component: 'input' }]"
  />
</template>
```

:::tip 命名约定
文档里的组件标签统一使用 `xy-button`、`xy-form-item` 这类 kebab-case。  
如果你在 TypeScript 中手动导入组件，仍然使用 `XyButton`、`XyFormItem` 这类 PascalCase 标识符。
:::

## 按组件引入

```vue [App.vue]
<script setup lang="ts">
import { XyButton, XySpace } from "xiaoye-components";
import { XySearchForm } from "xiaoye-pro-components";
import "xiaoye-components/style.css";
import "xiaoye-pro-components/style.css";
</script>

<template>
  <xy-space>
    <xy-button type="primary">保存</xy-button>
    <xy-button plain>取消</xy-button>
  </xy-space>

  <xy-search-form
    :model="{ keyword: '' }"
    :fields="[{ prop: 'keyword', label: '关键词', component: 'input' }]"
  />
</template>
```

## 全局默认配置

如果你想统一默认尺寸、命名空间或弹层层级，可以在应用根部包一层 `xy-config-provider`。对于后台系统，最常用的是 `size` 和 `z-index`。

```vue [App.vue]
<script setup lang="ts">
import { XyConfigProvider } from "xiaoye-components";
import "xiaoye-components/style.css";

const locale = {
  emptyDescription: "暂无数据"
};
</script>

<template>
  <xy-config-provider size="md" :z-index="2400" :locale="locale">
    <router-view />
  </xy-config-provider>
</template>
```

## 推荐阅读顺序

1. 先看 [组件总览](/components/overview)，确认基础层覆盖了哪些通用能力。
2. 再看 [增强组件总览](/pro-components/overview)，确认中后台闭环可以直接复用哪些增强件。
3. 最后看 [管理后台闭环示例](/examples/admin)，把基础层和增强层放回真实页面里理解。

## 接入建议

- 如果你在做通用页面，先只接基础层。
- 如果你已经明确在做中后台页面闭环，再叠加增强层。
- 如果你准备统一表单尺寸和弹层层级，尽早把 `xy-config-provider` 放到根节点。
