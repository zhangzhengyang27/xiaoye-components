<template>
  <xy-upload tip="外层 tip 仍可保留，但这里更推荐用插槽自定义说明。">
    <template #trigger>
      <xy-button type="primary">选择附件</xy-button>
    </template>

    <template #tip>
      <xy-text>支持 PDF、PNG、JPG，单文件不超过 10 MB。</xy-text>
    </template>
  </xy-upload>
</template>
