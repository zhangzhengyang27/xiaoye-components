<template>
  <xyu-card style="width: 360px">
    <template #cover>
      <img
        src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=720&q=80"
        alt="cover"
        style="width: 100%; height: 180px; object-fit: cover"
      />
    </template>
    <template #header>
      <div style="font-weight: 600">带封面图片的卡片</div>
    </template>
    <div>卡片内容区域，可配合 cover 插槽使用。</div>
  </xyu-card>
</template>
