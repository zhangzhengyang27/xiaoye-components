---
title: Anchor 锚点
description: 通过页内锚点快速定位长内容章节，支持滚动高亮、marker、局部滚动容器和 hash 同步。
outline: deep
---

# Anchor 锚点

`xy-anchor` 和 `xy-anchor-link` 用于把“长内容页的章节定位”收口成一套稳定的页内导航。采用复合组件和插槽优先写法，默认支持复合组件和插槽优先写法，默认支持 `vertical + horizontal`、复合嵌套目录、滚动容器监听、marker 指示条、`scrollTo` expose 和 URL hash 同步。

## 基础用法

:::demo 最常见的接法是左侧一列目录、右侧一列长内容。点击目录后，滚动容器会平滑定位到对应章节。
anchor/basic
:::

## 自定义滚动容器

:::demo 当内容不在整页滚动，而是在局部面板里滚动时，可以通过 `container`、`offset` 和 `bound` 调整定位和高亮时机。
anchor/scroll
:::

## Active 变化与点击事件

:::demo `change` 适合回写当前章节状态，`click` 适合埋点、日志或联动其它说明面板。
anchor/change
:::

## Horizontal 模式

:::demo `direction='horizontal'` 适合顶部页内导航。首版允许嵌套声明，但视觉保持扁平，不展开二级缩进目录。
anchor/horizontal
:::

## 嵌套目录

:::demo 复合嵌套 `<xy-anchor-link><xy-anchor-link /></xy-anchor-link>` 更适合纵向目录树。父级和子级都能参与 active 命中。
anchor/nested
:::

## 与 Affix 组合

:::demo 当目录需要在滚动过程中持续可见时，可以直接和 `xy-affix` 组合使用。
anchor/affix
:::

## 何时使用

- 需要给长说明页、详情页、发布清单或配置中心提供稳定的页内目录导航。
- 需要让目录跟随滚动自动高亮，而不是只做静态跳转链接。
- 需要目录工作在局部滚动容器内，而不是只能监听整页滚动。

## API

### Anchor Attributes

| 属性        | 说明                                                    | 类型                                      | 默认值       |
| ----------- | ------------------------------------------------------- | ----------------------------------------- | ------------ |
| `container` | 滚动容器，可传选择器、`HTMLElement`、`window` 或 `null` | `string \| HTMLElement \| Window \| null` | `null`       |
| `offset`    | 锚点滚动后的额外偏移距离                                | `number`                                  | `0`          |
| `bound`     | 提前触发 active 切换的边界偏移                          | `number`                                  | `15`         |
| `duration`  | 平滑滚动时长，单位毫秒                                  | `number`                                  | `300`        |
| `marker`    | 是否显示 marker 指示条                                  | `boolean`                                 | `true`       |
| `direction` | 导航方向                                                | `'vertical' \| 'horizontal'`              | `'vertical'` |
| `sync-hash` | 是否在挂载、点击和滚动时同步 URL hash                   | `boolean`                                 | `true`       |

### Anchor Events

| 事件     | 说明                   | 参数                                         |
| -------- | ---------------------- | -------------------------------------------- |
| `change` | 当前高亮锚点变化时触发 | `(href: string) => void`                     |
| `click`  | 点击锚点时触发         | `(event: MouseEvent, href?: string) => void` |

### Anchor Exposes

| 暴露项     | 说明               | 类型                      |
| ---------- | ------------------ | ------------------------- |
| `scrollTo` | 手动滚动到指定锚点 | `(href?: string) => void` |

### Anchor Slots

| 插槽      | 说明                      |
| --------- | ------------------------- |
| `default` | `xy-anchor-link` 组件列表 |

### AnchorLink Attributes

| 属性    | 说明                                  | 类型     | 默认值 |
| ------- | ------------------------------------- | -------- | ------ |
| `title` | 锚点标题                              | `string` | `''`   |
| `href`  | 锚点地址，推荐使用 `#section-id` 形式 | `string` | `''`   |

## 行为约定

- `vertical` 适合侧边目录和层级导航；`horizontal` 适合顶部页内导航。
- `horizontal` 首版允许嵌套声明，但视觉保持扁平，不渲染二级缩进目录。
- `syncHash=true` 时，组件会读取初始 hash，并在点击和滚动切换 active 时用 `history.replaceState` 同步 URL。
- `syncHash=false` 时，只保留滚动和 active 高亮，不读写 URL。
- 如果 `href` 对应目标不存在，组件会安全跳过滚动，不抛错。

## 模式建议

- `vertical`：默认模式，优先用于长内容页、配置页、说明页和发布清单。
- `horizontal`：适合顶部章节导航、页面内步骤导航或内容页二级导航。
- `Affix + Anchor`：适合目录必须持续可见的详情页或控制台页面。
