<template>
  <xy-card style="max-width: 480px">
    <p v-for="item in 4" :key="item" class="demo-card-item">{{ `List item ${item}` }}</p>
  </xy-card>
</template>

<style scoped>
.demo-card-item {
  margin: 0;
  padding: 10px 0;
  color: var(--xy-text-color-secondary);
}

.demo-card-item + .demo-card-item {
  border-top: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}
</style>
