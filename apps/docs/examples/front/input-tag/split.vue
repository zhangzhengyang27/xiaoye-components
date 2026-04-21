<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-input-tag v-model="['苹果', '香蕉']" split="、" placeholder="使用顿号分隔" />
    <xyu-input-tag v-model="['苹果', '香蕉']" split=" " placeholder="使用空格分隔" />
  </xyu-space>
</template>
