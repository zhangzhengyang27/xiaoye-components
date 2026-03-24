<template>
  <div class="demo-card-grid">
    <xy-card shadow="always">
      Always
    </xy-card>
    <xy-card shadow="hover">
      Hover
    </xy-card>
    <xy-card shadow="never">
      Never
    </xy-card>
  </div>
</template>

<style scoped>
.demo-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
</style>
