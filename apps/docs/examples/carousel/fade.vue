<template>
  <xy-carousel effect="fade" height="240px">
    <xy-carousel-item v-for="item in 3" :key="`fade-${item}`">
      <div class="demo-carousel-fade" :class="`is-${item}`">
        <strong>Fade {{ item }}</strong>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-fade {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: white;
  font-size: 28px;
  font-weight: 800;
}

.demo-carousel-fade.is-1 {
  background: linear-gradient(135deg, #2563eb, #0f766e);
}

.demo-carousel-fade.is-2 {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
}

.demo-carousel-fade.is-3 {
  background: linear-gradient(135deg, #ea580c, #d97706);
}
</style>
