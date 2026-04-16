<script setup lang="ts">
const groups = [
  {
    title: "文本层级",
    description: "适合拼标题、说明、段落和列表行里最常见的文本骨架。",
    items: [
      { variant: "h1", note: "大标题" },
      { variant: "h3", note: "区块标题" },
      { variant: "text", note: "正文文本" },
      { variant: "caption", note: "辅助说明" },
      { variant: "p", note: "整段占位" }
    ]
  },
  {
    title: "形状与媒体",
    description: "适合头像、卡片封面、图片区和操作按钮一类更具结构感的占位。",
    items: [
      { variant: "circle", note: "头像 / 状态点" },
      { variant: "rect", note: "卡片封面" },
      { variant: "image", note: "图片占位" },
      { variant: "button", note: "操作按钮" }
    ]
  }
] as const;
</script>

<template>
  <div class="demo-skeleton-variants">
    <section v-for="group in groups" :key="group.title" class="demo-skeleton-variants__group">
      <div class="demo-skeleton-variants__group-head">
        <strong>{{ group.title }}</strong>
        <p class="demo-skeleton-variants__group-description">{{ group.description }}</p>
      </div>

      <div class="demo-skeleton-variants__grid">
        <xy-card
          v-for="item in group.items"
          :key="item.variant"
          shadow="never"
          body-class="demo-skeleton-variants__body"
        >
          <div class="demo-skeleton-variants__preview" :class="`is-${item.variant}`">
            <xy-skeleton-item
              :variant="item.variant"
              class="demo-skeleton-variants__item"
            />
          </div>

          <div class="demo-skeleton-variants__meta">
            <xy-tag status="neutral" round>{{ item.variant }}</xy-tag>
            <span class="demo-skeleton-variants__meta-note">{{ item.note }}</span>
          </div>
        </xy-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-skeleton-variants {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-skeleton-variants__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-skeleton-variants__group-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-skeleton-variants__group-description,
.demo-skeleton-variants__meta-note {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.demo-skeleton-variants__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
  gap: 14px;
}

:global(.demo-skeleton-variants__body) {
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 14px;
  min-height: 168px;
}

.demo-skeleton-variants__preview {
  width: 100%;
  min-height: 88px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 78%, white);
  border-radius: 14px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--xy-bg-color-muted) 72%, white),
      transparent 100%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 90%, white);
}

.demo-skeleton-variants__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.demo-skeleton-variants__preview.is-circle {
  --xy-skeleton-circle-size: 56px;
}

.demo-skeleton-variants__preview.is-rect,
.demo-skeleton-variants__preview.is-image {
  min-height: 120px;
}

.demo-skeleton-variants__preview.is-caption,
.demo-skeleton-variants__preview.is-h1,
.demo-skeleton-variants__preview.is-h3,
.demo-skeleton-variants__preview.is-p,
.demo-skeleton-variants__preview.is-text {
  justify-content: flex-start;
}

.demo-skeleton-variants__item {
  max-width: 100%;
}
</style>
