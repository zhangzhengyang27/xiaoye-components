# 快速开始

## 安装

```bash
pnpm add xiaoye-components
```

## 注册

```ts
import { createApp } from "vue";
import XiaoyeComponents from "xiaoye-components";
import "xiaoye-components/style.css";
import App from "./App.vue";

createApp(App).use(XiaoyeComponents).mount("#app");
```

## 直接使用

```vue
<template>
  <xy-button>保存</xy-button>
</template>
```

## 设计原则

- 默认值尽量可直接用于中后台页面
- API 命名统一，减少切换组件时的心智成本
- 文档示例以“复制就能改”为目标，而不是只展示静态样式

