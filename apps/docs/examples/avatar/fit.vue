<script setup lang="ts">
const wideImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="96" viewBox="0 0 160 96">
    <rect width="160" height="96" fill="#e0f2fe" />
    <rect x="10" y="10" width="140" height="76" rx="18" fill="#0f172a" />
    <circle cx="52" cy="40" r="18" fill="#93c5fd" />
    <path d="M22 78c10-16 22-24 30-24s20 8 30 24" fill="#93c5fd" />
    <rect x="94" y="26" width="36" height="10" rx="5" fill="#38bdf8" />
    <rect x="94" y="44" width="28" height="10" rx="5" fill="#7dd3fc" />
  </svg>
`)}`;
</script>

<template>
  <xy-space wrap align="center">
    <xy-avatar :size="56" shape="square" :src="wideImage" fit="cover" />
    <xy-avatar :size="56" shape="square" :src="wideImage" fit="contain" />
    <xy-avatar :size="56" shape="square" :src="wideImage" fit="fill" />
  </xy-space>
</template>
