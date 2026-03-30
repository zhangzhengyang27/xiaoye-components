<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  menuId: null as number | null
});

const rules = {
  menuId: [{ required: true, message: "请选择菜单", trigger: "change" }]
};

const data = [
  {
    id: 1,
    label: "工作台",
    children: [{ id: 11, label: "账单中心" }]
  },
  {
    id: 2,
    label: "配置中心"
  }
];
</script>

<template>
  <xy-form :model="form" :rules="rules" label-width="96px">
    <xy-form-item label="菜单" prop="menuId">
      <xy-tree-select v-model="form.menuId" :data="data" node-key="id" filterable />
    </xy-form-item>
  </xy-form>
</template>
