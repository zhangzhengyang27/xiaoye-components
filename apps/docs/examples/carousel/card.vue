<template>
  <xy-carousel type="card" height="240px" :autoplay="false" style="--xy-carousel-radius: 18px">
    <xy-carousel-item v-for="item in 5" :key="`card-${item}`" :name="`card-${item}`">
      <div class="demo-carousel-card">
        <span class="demo-carousel-card__eyebrow">Pick {{ item }}</span>
        <strong>推荐位 {{ item }}</strong>
        <p>点击左右卡片可以直接切换当前内容。</p>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 22px;
  border-radius: 18px;
  background: linear-gradient(160deg, #0f766e, #2563eb);
  color: white;
  overflow: hidden;
}

.demo-carousel-card__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-card strong {
  font-size: 22px;
  line-height: 1.1;
}

.demo-carousel-card p {
  margin: 0;
  color: color-mix(in srgb, white 80%, transparent);
}
</style>
