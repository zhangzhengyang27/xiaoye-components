---
title: 前台组件概览
description: 前台专属组件库概览
outline: deep
---

# 前台专属组件

前台专属组件是针对电商、零售、O2O 等前台业务场景封装的业务组件库，提供商品展示、营销弹层、图片画廊、SKU 选择、地址选择等高频功能，以及一套完整的基础 UI 组件库。

## 业务组件

| 组件 | 说明 |
| --- | --- |
| [ProductCard 商品卡片](/front/product-card) | 商品展示卡片，支持多图切换、价格展示、标签、售罄/下架状态 |
| [MarketingModal 营销弹层](/front/marketing-modal) | 营销场景弹层，支持优惠券、限时抢购、满减活动 |
| [ImageGallery 图片画廊](/front/image-gallery) | 商品图片展示，支持缩略图切换和大图预览 |
| [SkuSelector SKU选择器](/front/sku-selector) | 商品SKU规格选择，支持颜色、尺寸、图片等多种规格类型 |
| [AddressPicker 地址选择器](/front/address-picker) | 中国省市区三级联动地址选择器 |

## 基础组件

### 基础元素

| 组件 | 说明 |
| --- | --- |
| [Button 按钮](/front/button) | 基础按钮，支持多种类型和状态 |
| [Text 文本](/front/text) | 内联文本样式控制 |
| [Link 链接](/front/link) | 链接组件，支持多种样式 |
| [Tag 标签](/front/tag) | 标签组件，用于信息标记 |
| [Badge 徽标](/front/badge) | 徽标组件，用于数量提示 |
| [Divider 分割线](/front/divider) | 分割线组件，用于内容分隔 |

### 表单组件

| 组件 | 说明 |
| --- | --- |
| [Input 输入框](/front/input) | 文本输入框，支持多种类型 |
| [InputNumber 数字输入](/front/input-number) | 数字输入框，支持步进 |
| [InputTag 标签输入](/front/input-tag) | 标签输入组件 |
| [Select 选择器](/front/select) | 下拉选择器 |
| [Checkbox 多选框](/front/checkbox) | 多选框组件 |
| [Radio 单选框](/front/radio) | 单选框组件 |
| [Switch 开关](/front/switch) | 开关组件 |
| [Slider 滑块](/front/slider) | 滑块组件，用于范围选择 |
| [Cascader 级联选择](/front/cascader) | 级联选择器 |
| [DatePicker 日期选择](/front/date-picker) | 日期选择器 |
| [TimePicker 时间选择](/front/time-picker) | 时间选择器 |
| [ColorPicker 颜色选择器](/front/color-picker) | 颜色选择器 |

### 反馈组件

| 组件 | 说明 |
| --- | --- |
| [Alert 警告提示](/front/alert) | 警告提示组件 |
| [Message 消息提示](/front/message) | 消息提示组件 |
| [Notification 通知](/front/notification) | 通知组件 |
| [Loading 加载](/front/loading) | 加载状态组件 |
| [Progress 进度条](/front/progress) | 进度条组件 |
| [Rate 评分](/front/rate) | 评分组件 |
| [Result 结果](/front/result) | 结果展示组件 |

### 导航组件

| 组件 | 说明 |
| --- | --- |
| [Tabs 标签页](/front/tabs) | 标签页组件 |
| [Steps 步骤条](/front/steps) | 步骤条组件 |
| [Backtop 回到顶部](/front/backtop) | 回到顶部组件 |

### 容器组件

| 组件 | 说明 |
| --- | --- |
| [Card 卡片](/front/card) | 卡片容器 |
| [Space 间距](/front/space) | 间距组件 |
| [Timeline 时间线](/front/timeline) | 时间线组件 |
| [Skeleton 骨架屏](/front/skeleton) | 骨架屏组件 |
| [Empty 空状态](/front/empty) | 空状态组件 |

### 浮层组件

| 组件 | 说明 |
| --- | --- |
| [Tooltip 文字提示](/front/tooltip) | 文字提示组件 |
| [Popover 弹出框](/front/popover) | 弹出框组件 |
| [Popconfirm 气泡确认框](/front/popconfirm) | 气泡确认框 |
| [Dialog 对话框](/front/dialog) | 对话框组件 |
| [Drawer 抽屉](/front/drawer) | 抽屉组件 |
| [Dropdown 下拉菜单](/front/dropdown) | 下拉菜单组件 |

### 数据展示

| 组件 | 说明 |
| --- | --- |
| [Avatar 头像](/front/avatar) | 头像组件 |
| [Image 图片](/front/image) | 图片组件，支持预览 |
| [Pagination 分页](/front/pagination) | 分页组件 |
| [Upload 上传](/front/upload) | 文件上传组件 |

## Headless 组合 API

除了业务组件，组件库还提供基于 Headless UI Vue 模式的组合式组件 API，提供无样式或低样式的组件组合方式。

[了解更多](/front/headless)

## 特点

- **开箱即用**：针对前台业务场景深度优化，无需额外配置
- **主题定制**：支持通过 CSS 变量和插槽进行样式定制
- **TypeScript**：完整的 TypeScript 类型支持
- **无障碍**：遵循 WAI-ARIA 规范，支持键盘导航
