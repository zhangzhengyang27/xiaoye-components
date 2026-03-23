<script setup lang="ts">
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button tag="a" href="https://example.com" target="_blank" rel="noreferrer">
        外部链接
      </xy-button>
      <xy-button tag="div" type="primary">自定义标签</xy-button>
      <xy-button tag="a" type="danger" href="#danger-action">危险链接</xy-button>
    </xy-space>
  </div>
</template>
