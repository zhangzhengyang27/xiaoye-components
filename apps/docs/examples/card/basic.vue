<template>
  <xy-card style="max-width: 480px">
    <template #header>
      <div class="demo-card-header">
        <span>Card name</span>
      </div>
    </template>

    <p
      v-for="item in 4"
      :key="item"
      class="demo-card-item"
      :class="{ 'is-separated': item > 1 }"
    >
      {{ `List item ${item}` }}
    </p>

    <template #footer>Footer content</template>
  </xy-card>
</template>

<style scoped>
.demo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.demo-card-item {
  margin: 0;
  padding: 10px 0;
  color: var(--xy-text-color-secondary);
}

.demo-card-item.is-separated {
  border-top: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}
</style>
