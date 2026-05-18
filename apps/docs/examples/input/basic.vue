<script setup lang="ts">
import { ref } from "vue";

// 搜索关键词：用于演示 Input 组件的双向绑定和值展示
const searchKeyword = ref("");
</script>

<template>
  <!-- 输入框基础用法：展示文本输入、清空按钮、多行文本域三种形态 -->
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input v-model="searchKeyword" placeholder="请输入搜索关键字" />
      <xy-input placeholder="支持一键清空" clearable />
      <xy-input type="textarea" placeholder="支持多行输入" :rows="3" />
    </xy-space>
    <xy-tag status="primary">当前输入：{{ searchKeyword || "空" }}</xy-tag>
  </div>
</template>
