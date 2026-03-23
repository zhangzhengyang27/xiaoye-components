<template>
  <xy-space wrap>
    <xy-tooltip content="这个按钮会立即提交当前表单">
      <xy-button plain>Hover 查看提示</xy-button>
    </xy-tooltip>
    <xy-tooltip content="支持 focus 打开和 Escape 关闭">
      <xy-button type="primary">Focus 也可触发</xy-button>
    </xy-tooltip>
  </xy-space>
</template>
