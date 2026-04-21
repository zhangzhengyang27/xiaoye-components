<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-input-tag v-model="['标签1', '标签2']" :max="3" placeholder="最多输入 3 个标签" />
    <xyu-input-tag v-model="['标签A', '标签B', '标签C']" :max="3" placeholder="已达到最大数量" />
  </xyu-space>
</template>
