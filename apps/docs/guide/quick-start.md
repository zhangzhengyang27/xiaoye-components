---
title: 快速开始
description: 在 Vue 3 项目中接入 xiaoye-components。
outline: deep
---

# 快速开始

本页介绍如何在 Vue 3 项目里接入 `xiaoye-components`，并用最短路径跑通第一个页面。

## 安装

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

## 完整引入

如果你更关注接入成本而不是极致拆分，推荐先用完整引入。对后台项目来说，这通常是最稳定、最省心的起点。

```ts [main.ts]
import { createApp } from "vue";
import XiaoyeComponents from "xiaoye-components";
import "xiaoye-components/style.css";
import App from "./App.vue";

const app = createApp(App);

app.use(XiaoyeComponents);
app.mount("#app");
```

## 在模板中直接使用

完成完整引入后，就可以在模板里直接写组件标签。

```vue [App.vue]
<template>
  <xy-space>
    <xy-button type="primary">保存</xy-button>
    <xy-button plain>取消</xy-button>
  </xy-space>
</template>
```

:::tip 命名约定
文档里的组件标签统一使用 `xy-button`、`xy-form-item` 这类 kebab-case。  
如果你在 TypeScript 中手动导入组件，仍然使用 `XyButton`、`XyFormItem` 这类 PascalCase 标识符。
:::

## 按组件引入

如果你希望页面依赖显式可见，也可以直接按组件导入。当前阶段这是最清晰、最容易配合 IDE 阅读的方式。

```vue [App.vue]
<script setup lang="ts">
import { XyButton, XySpace } from "xiaoye-components";
import "xiaoye-components/style.css";
</script>

<template>
  <xy-space>
    <xy-button type="primary">保存</xy-button>
    <xy-button plain>取消</xy-button>
  </xy-space>
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

:::tip 什么时候包一层 Config Provider
如果你的项目需要统一表单尺寸、管理弹层层级或未来准备接多语言文案，建议在应用根节点就包上 `xy-config-provider`。
:::

## 推荐阅读顺序

1. 先看 [组件总览](/components/overview)，确认当前版本覆盖了哪些页面任务。
2. 再看 [基础与表单组件](/components/basic-form)，优先掌握最常用的录入和操作控件。
3. 最后看 [管理后台闭环示例](/examples/admin)，把组件用法放回真实页面里理解。
