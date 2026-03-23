<script setup lang="ts">
const items = [
  { status: "neutral", label: "默认" },
  { status: "primary", label: "进行中" },
  { status: "success", label: "已通过" },
  { status: "warning", label: "待确认" },
  { status: "danger", label: "已拒绝" }
] as const;
</script>

<template>
  <div class="demo-tag-rows">
    <div class="demo-tag-row">
      <span class="demo-tag-row__label">常规</span>
      <xy-space wrap>
        <xy-tag v-for="item in items" :key="`plain-${item.label}`" :status="item.status">
          {{ item.label }}
        </xy-tag>
      </xy-space>
    </div>
    <div class="demo-tag-row">
      <span class="demo-tag-row__label">圆角</span>
      <xy-space wrap>
        <xy-tag v-for="item in items" :key="`round-${item.label}`" :status="item.status" round>
          {{ item.label }}
        </xy-tag>
      </xy-space>
    </div>
  </div>
</template>

<style scoped>
.demo-tag-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.demo-tag-row__label {
  width: 44px;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}
</style>
