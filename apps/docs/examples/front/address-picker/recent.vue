<script setup lang="ts">
import { ref } from "vue";

const address = ref({});

const recentAddresses = ref([
  {
    label: "公司",
    value: {
      province: "广东省",
      city: "深圳市",
      district: "南山区",
      street: "科技园南路XX号"
    }
  },
  {
    label: "家里",
    value: {
      province: "北京市",
      city: "市辖区",
      district: "海淀区",
      street: "中关村大街XX号"
    }
  }
]);
</script>

<template>
  <div class="demo-address-picker-recent">
    <xy-address-picker
      v-model="address"
      display-format="full"
      :recent-addresses="recentAddresses"
      style="max-width: 400px;"
    />
    <p class="result">选中地址：{{ JSON.stringify(address) }}</p>
  </div>
</template>

<style scoped>
.demo-address-picker-recent {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}
</style>
