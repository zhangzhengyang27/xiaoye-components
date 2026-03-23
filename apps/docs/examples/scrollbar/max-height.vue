<template>
  <xy-scrollbar max-height="180px" always>
    <div class="demo-scroll-notes">
      <div v-for="item in 6" :key="item" class="demo-scroll-note">
        <span>说明 {{ item }}</span>
        <small>always 模式会始终显示自定义滚动条，适合可预期会滚动的说明区域。</small>
      </div>
    </div>
  </xy-scrollbar>
</template>

<style scoped>
.demo-scroll-notes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 8px;
}

.demo-scroll-note {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-color-primary) 8%, white);
}

.demo-scroll-note span {
  color: var(--xy-text-color);
  font-weight: 600;
}

.demo-scroll-note small {
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}
</style>
