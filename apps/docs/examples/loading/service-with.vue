<script setup lang="ts">
import { ref } from "vue";
import { XyLoadingService } from "xiaoye-components";

const status = ref("空闲");

async function simulateSuccess() {
  status.value = "执行成功流程";

  await XyLoadingService.with(
    async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      return "done";
    },
    {
      text: "正在发布版本..."
    }
  );

  status.value = "成功结束，loading 已自动关闭";
}

async function simulateFailure() {
  status.value = "执行失败流程";

  try {
    await XyLoadingService.with(
      async () => {
        await new Promise((resolve) => window.setTimeout(resolve, 900));
        throw new Error("发布校验失败");
      },
      {
        text: "正在校验发布前置条件..."
      }
    );
  } catch (error) {
    status.value = (error as Error).message;
  }
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="simulateSuccess">with 成功流程</xy-button>
    <xy-button plain @click="simulateFailure">with 失败流程</xy-button>
    <xy-tag status="neutral">{{ status }}</xy-tag>
  </xy-space>
</template>
