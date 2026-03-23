<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  name: "初始名称"
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-form :model="model">
      <xy-form-item label="成员名称" prop="name" help="修改后点击重置按钮">
        <xy-input v-model="model.name" />
      </xy-form-item>
      <xy-space wrap>
        <xy-button plain native-type="reset">重置字段</xy-button>
        <xy-tag status="primary">当前值：{{ model.name }}</xy-tag>
      </xy-space>
    </xy-form>
  </div>
</template>
