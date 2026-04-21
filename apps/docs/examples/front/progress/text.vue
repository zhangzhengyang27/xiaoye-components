<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-progress :percentage="60" />
    <xyu-progress :percentage="60" :show-text="false" />
    <xyu-progress :percentage="60" :show-text="true" :format="(val: number) => `${val} / 100`" />
  </xyu-space>
</template>
