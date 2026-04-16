<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="frontline-demo-stack">
    <xy-front-button leading-icon="mdi:creation-outline" @click="open = true">
      打开发布弹层
    </xy-front-button>

    <xy-front-dialog
      v-model="open"
      title="把这一版直接推到体验环境"
      description="实验线先不追求后台式信息密度，而是强调更轻的阅读节奏、更清晰的决策区和更强的品牌气质。"
    >
      <template #content>
        <p>
          你可以把这类 Dialog 理解成产品前台里的聚焦容器。它适合承接发布确认、订阅说明、升级引导或试用申请，而不是后台那种密集审批表单。
        </p>
      </template>
      <template #footer>
        <xy-front-button variant="ghost" tone="neutral" @click="open = false">再想想</xy-front-button>
        <xy-front-button @click="open = false">确认发布</xy-front-button>
      </template>
    </xy-front-dialog>
  </div>
</template>
