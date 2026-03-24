<script setup lang="ts">
import { ref } from "vue";

const activeNames = ref<Array<string | number>>(["intro"]);
</script>

<template>
  <xy-collapse v-model="activeNames">
    <xy-collapse-item name="intro" title="什么是小叶组件库？">
      小叶组件库面向中后台场景，强调表单录入、浮层交互、排期管理和文档示例闭环。
    </xy-collapse-item>

    <xy-collapse-item name="design" title="设计风格为什么更偏业务？">
      组件默认视觉会优先服务“清晰、可运营、可扩展”的后台页面，而不是追求单一展示感。
    </xy-collapse-item>

    <xy-collapse-item name="a11y" title="是否考虑键盘和语义？">
      Collapse 的标题区支持键盘触发，并为头部和内容区域建立了 `button / region` 语义关联。
    </xy-collapse-item>
  </xy-collapse>
</template>
