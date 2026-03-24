<script setup lang="ts">
import { computed, ref } from "vue";

const allCities = ["上海", "北京", "广州"];
const checkedCities = ref<string[]>(["上海"]);

const checkAll = computed({
  get: () => checkedCities.value.length === allCities.length,
  set: (value: boolean) => {
    checkedCities.value = value ? [...allCities] : [];
  }
});

const isIndeterminate = computed(
  () =>
    checkedCities.value.length > 0 && checkedCities.value.length < allCities.length
);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-checkbox v-model="checkAll" :indeterminate="isIndeterminate" border>
      全选城市
    </xy-checkbox>

    <xy-checkbox-group v-model="checkedCities">
      <xy-checkbox v-for="city in allCities" :key="city" :value="city">
        {{ city }}
      </xy-checkbox>
    </xy-checkbox-group>

    <xy-text size="sm">当前选择：{{ checkedCities.join("，") || "未选择" }}</xy-text>
  </div>
</template>
