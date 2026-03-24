<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="100%" stop-color="#22c55e" />
      </linearGradient>
    </defs>
    <rect width="96" height="96" rx="20" fill="url(#g)" />
    <circle cx="48" cy="38" r="16" fill="#ecfeff" />
    <path d="M24 78c7-12 18-18 24-18s17 6 24 18" fill="#ecfeff" />
  </svg>
`)}`;
</script>

<template>
  <xy-space wrap align="center">
    <xy-avatar>叶</xy-avatar>
    <xy-avatar icon="mdi:account-outline" />
    <xy-avatar :src="imageUrl" alt="avatar image" />
    <xy-avatar shape="square">AB</xy-avatar>
  </xy-space>
</template>
