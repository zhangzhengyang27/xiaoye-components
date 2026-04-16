<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#g)" />
    <circle cx="148" cy="118" r="42" fill="#bbf7d0" />
    <path d="M74 274c28-46 61-69 84-69s56 23 84 69" fill="#bbf7d0" />
    <rect x="258" y="92" width="198" height="22" rx="11" fill="#ecfeff" opacity="0.95" />
    <rect x="258" y="132" width="146" height="18" rx="9" fill="#ccfbf1" opacity="0.92" />
    <rect x="258" y="188" width="232" height="14" rx="7" fill="#99f6e4" opacity="0.86" />
    <rect x="258" y="214" width="210" height="14" rx="7" fill="#99f6e4" opacity="0.72" />
  </svg>
`)}`;
</script>

<template>
  <xy-card style="max-width: 480px">
    <template #header>Yummy hamburger</template>

    <img :src="imageUrl" alt="demo card image" class="demo-card-image" />

    <div class="demo-card-copy">
      <strong>深夜食堂更新</strong>
      <p class="demo-card-copy__description">适合图文摘要、内容卡片和带封面的运营位。</p>
    </div>
  </xy-card>
</template>

<style scoped>
.demo-card-image {
  display: block;
  width: 100%;
  border-radius: 12px;
}

.demo-card-copy {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-card-copy__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
}
</style>
