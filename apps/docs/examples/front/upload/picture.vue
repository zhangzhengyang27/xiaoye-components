<template>
  <xyu-upload
    action="https://httpbin.org/post"
    list-type="picture"
    :file-list="[
      { id: '1', name: 'photo1.jpg', size: 102400, status: 'success', url: 'https://picsum.photos/200' },
      { id: '2', name: 'photo2.jpg', size: 204800, status: 'success', url: 'https://picsum.photos/201' }
    ]"
  />
</template>
