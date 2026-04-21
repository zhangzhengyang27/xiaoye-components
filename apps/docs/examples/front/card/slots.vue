<template>
  <xyu-card style="width: 360px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-weight: 600">自定义头部</span>
        <xyu-button size="small" type="primary">操作</xyu-button>
      </div>
    </template>
    <div>卡片主体内容</div>
    <template #footer>
      <div style="display: flex; gap: 8px; justify-content: flex-end">
        <xyu-button size="small">取消</xyu-button>
        <xyu-button size="small" type="primary">确定</xyu-button>
      </div>
    </template>
  </xyu-card>
</template>
