<template>
  <xy-carousel show-progress progress-placement="indicator" height="220px">
    <xy-carousel-item v-for="item in 3" :key="`custom-${item}`">
      <div class="demo-carousel-custom">Custom {{ item }}</div>
    </xy-carousel-item>

    <template #arrow-prev>
      <xy-icon icon="mdi:arrow-left" :size="18" />
    </template>

    <template #arrow-next>
      <xy-icon icon="mdi:arrow-right" :size="18" />
    </template>

    <template #indicator="{ index, active }">
      <span :class="['demo-carousel-indicator', active ? 'is-active' : '']">
        {{ index + 1 }}
      </span>
    </template>

    <template #progress="{ percent }">
      <div class="demo-carousel-progress-bar">
        <span :style="{ width: `${percent}%` }" />
      </div>
    </template>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-custom {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #0f766e, #2563eb);
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.demo-carousel-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--xy-text-color-secondary) 88%, white);
  color: white;
  font-size: 11px;
}

.demo-carousel-indicator.is-active {
  background: var(--xy-color-primary);
}

.demo-carousel-progress-bar {
  width: 120px;
  height: 3px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-border-color) 72%, white);
  overflow: hidden;
}

.demo-carousel-progress-bar span {
  display: block;
  height: 100%;
  background: var(--xy-color-primary);
}
</style>
