<template>
  <xyu-space wrap style="width: 300px; border: 1px dashed var(--xyu-border); padding: 8px">
    <xyu-button v-for="i in 8" :key="i">按钮 {{ i }}</xyu-button>
  </xyu-space>
</template>
