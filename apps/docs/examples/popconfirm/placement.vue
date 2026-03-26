<template>
  <div class="demo-popconfirm-placement">
    <xy-popconfirm
      v-for="item in placements"
      :key="item.value"
      :title="item.label"
      :placement="item.value"
    >
      <template #reference>
        <xy-button plain>{{ item.value }}</xy-button>
      </template>
    </xy-popconfirm>
  </div>
</template>

<script setup lang="ts">
const placements = [
  { value: "top", label: "顶部确认" },
  { value: "right", label: "右侧确认" },
  { value: "bottom", label: "底部确认" },
  { value: "left", label: "左侧确认" }
];
</script>

<style scoped>
.demo-popconfirm-placement {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
