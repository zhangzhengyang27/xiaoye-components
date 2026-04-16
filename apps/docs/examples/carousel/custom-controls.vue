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
        <span class="demo-carousel-progress-bar__value" :style="{ width: `${percent}%` }" />
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
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, var(--xy-border-color));
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--xy-color-primary) 14%, white),
      transparent 44%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-text-color);
  font-size: 24px;
  font-weight: 700;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
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

.demo-carousel-progress-bar__value {
  display: block;
  height: 100%;
  background: var(--xy-color-primary);
}
</style>
