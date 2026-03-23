<template>
  <xy-space wrap>
    <xy-input placeholder="搜索项目">
      <template #prefix>
        <xy-icon icon="mdi:magnify" />
      </template>
    </xy-input>

    <xy-input placeholder="只读内容" readonly>
      <template #suffix>
        <xy-tag size="sm">只读</xy-tag>
      </template>
    </xy-input>
  </xy-space>
</template>
