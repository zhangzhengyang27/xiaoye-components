<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-checkbox border>默认项</xy-checkbox>
      <xy-checkbox border :model-value="true">已选项</xy-checkbox>
      <xy-checkbox border disabled>禁用未选</xy-checkbox>
      <xy-checkbox border disabled :model-value="true">禁用已选</xy-checkbox>
      <xy-checkbox border indeterminate>处理中</xy-checkbox>
    </xy-space>
  </div>
</template>
