<template>
  <xyu-upload
    drag
    action="https://httpbin.org/post"
    accept="image/*"
    list-type="picture-card"
  >
    <div style="padding: 20px 0">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 24V12M18 12L13 17M18 12L23 17" stroke="var(--xyu-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 26H28" stroke="var(--xyu-primary)" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p>拖拽图片文件到此处上传</p>
    </div>
  </xyu-upload>
</template>
