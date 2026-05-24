<template>
  <!-- 头像组基础用法：展示多人头像的叠加展示 -->
  <div class="demo-avatar-group">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-avatar-group__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>头像组</xy-tag>
        </div>
        <p class="demo-avatar-group__description">
          头像组用于展示多人参与的场景，自动处理重叠和溢出展示。
        </p>
      </template>

      <xy-avatar-group size="lg" shape="square">
        <xy-avatar>叶</xy-avatar>
        <xy-avatar src="https://example.com/not-found-avatar.png" icon="mdi:account-outline" />
        <xy-avatar shape="circle">AB</xy-avatar>
        <xy-avatar icon="mdi:shield-account-outline" />
      </xy-avatar-group>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-avatar-group {
  max-width: 480px;
}

.demo-avatar-group__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-avatar-group__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
