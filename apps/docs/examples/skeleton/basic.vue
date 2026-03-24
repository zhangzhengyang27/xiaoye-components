<template>
  <div class="demo-skeleton-basic">
    <xy-card shadow="never">
      <xy-skeleton :rows="4" />
    </xy-card>

    <xy-card shadow="never">
      <xy-skeleton>
        <template #template>
          <div class="demo-skeleton-basic__template">
            <xy-skeleton-item variant="h3" />
            <xy-skeleton-item variant="text" />
            <xy-skeleton-item variant="text" />
            <xy-skeleton-item variant="text" style="width: 72%;" />
          </div>
        </template>
      </xy-skeleton>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-skeleton-basic {
  display: grid;
  gap: 16px;
  max-width: 640px;
}

.demo-skeleton-basic__template {
  display: grid;
  gap: 14px;
}
</style>
