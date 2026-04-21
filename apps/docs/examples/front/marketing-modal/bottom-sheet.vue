<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}
</script>

<template>
  <div class="demo-marketing-modal-bottom-sheet">
    <xy-button type="primary" @click="open">打开底部弹层</xy-button>

    <xy-marketing-modal
      v-model="visible"
      variant="bottom-sheet"
      title="分享到"
    >
      <div class="share-content">
        <div class="share-item">
          <xy-icon icon="mdi:wechat" :size="32" />
          <span>微信</span>
        </div>
        <div class="share-item">
          <xy-icon icon="mdi:wechat" :size="32" />
          <span>朋友圈</span>
        </div>
        <div class="share-item">
          <xy-icon icon="mdi:qqchat" :size="32" />
          <span>QQ</span>
        </div>
        <div class="share-item">
          <xy-icon icon="mdi:weibo" :size="32" />
          <span>微博</span>
        </div>
      </div>
    </xy-marketing-modal>
  </div>
</template>

<style scoped>
.demo-marketing-modal-bottom-sheet {
  display: flex;
  gap: 12px;
}

.share-content {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.share-item:hover {
  color: var(--xy-primary-color);
}
</style>
