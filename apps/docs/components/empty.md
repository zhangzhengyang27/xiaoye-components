---
title: Empty 空状态
---

# Empty 空状态

用于承接空数据、空搜索结果和首次进入时暂无内容的页面状态。

## 基础用法

<xy-empty title="暂无项目" description="当前筛选条件下没有找到结果" />

## 带操作入口

<xy-empty title="暂无工单" description="可以先创建第一条工单">
  <xy-button plain>立即创建</xy-button>
</xy-empty>

```vue
<xy-empty title="暂无工单" description="可以先创建第一条工单">
  <xy-button plain>立即创建</xy-button>
</xy-empty>
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | `'暂无数据'` |
| `description` | 描述文案 | `string` | `'这里还没有可展示的内容'` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 底部操作区 |
