<script setup lang="ts">
const poster = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#111827"/>
  <rect x="48" y="48" width="864" height="444" rx="32" fill="#1f2937"/>
  <circle cx="480" cy="270" r="72" fill="#f59e0b"/>
  <path d="M452 226L548 270L452 314Z" fill="#111827"/>
  <text x="72" y="110" font-size="34" fill="#f9fafb" font-family="Arial">Training Preview</text>
  <text x="72" y="154" font-size="20" fill="#9ca3af" font-family="Arial">poster + options + loop</text>
</svg>
`)}`;
</script>

<template>
  <xy-video-player
    :sources="[
      {
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        type: 'video/mp4'
      }
    ]"
    :poster="poster"
    :height="360"
    :options="{
      playbackRates: [0.75, 1, 1.25, 1.5, 2]
    }"
  />
</template>
