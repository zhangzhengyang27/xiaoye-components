<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-pagination v-model="1" :total="100" small />
    <xyu-pagination v-model="1" :total="100" :small="true" />
  </xyu-space>
</template>
