<template>
  <xy-descriptions
    title="审批详情"
    :column="2"
    border
    :items="[
      {
        label: '状态',
        value: 'approved',
        valueType: 'tag',
        options: [
          { label: '已通过', value: 'approved', status: 'success' }
        ]
      },
      {
        label: '预算',
        value: 128000.5,
        valueType: 'money'
      },
      {
        label: '更新时间',
        value: '2026-04-18T14:30:00+08:00',
        valueType: 'datetime'
      },
      {
        label: '摘要',
        value: '可信 <strong>HTML</strong>',
        renderHTML: (value: unknown) => `<span>${String(value ?? '')}</span>`
      }
    ]"
  />
</template>
