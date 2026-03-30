<template>
  <xy-audio-player
    :track="{
      src: 'https://www.w3schools.com/html/horse.mp3',
      title: '值班语音播报',
      artist: '调度系统',
      cover: 'https://picsum.photos/seed/audio-track/160/160'
    }"
    :playback-rates="[1, 1.25, 1.5, 2]"
  />
</template>
