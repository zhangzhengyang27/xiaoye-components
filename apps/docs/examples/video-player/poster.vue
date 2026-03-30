<template>
  <xy-video-player
    poster="https://picsum.photos/seed/video-poster/960/540"
    :height="360"
    :options="{
      playbackRates: [0.75, 1, 1.25, 1.5]
    }"
    :sources="[
      {
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        type: 'video/mp4'
      }
    ]"
  />
</template>
