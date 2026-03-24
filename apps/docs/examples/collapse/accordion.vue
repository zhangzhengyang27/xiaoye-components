<script setup lang="ts">
import { ref } from "vue";

const active = ref<string | number>("base");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-tag status="primary">当前展开：{{ active }}</xy-tag>

    <xy-collapse v-model="active" accordion expand-icon-position="left">
      <xy-collapse-item name="base" title="基础设置">
        用于快速配置名称、负责人、状态和发布日期。
      </xy-collapse-item>

      <xy-collapse-item name="advanced" title="高级设置">
        用于配置灰度范围、回滚策略、通知对象和更细的权限策略。
      </xy-collapse-item>

      <xy-collapse-item name="audit" title="审计记录">
        用于查看最近一次配置变更、操作人和发布时间。
      </xy-collapse-item>
    </xy-collapse>
  </div>
</template>
