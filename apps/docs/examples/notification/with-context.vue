<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

const instance = getCurrentInstance();
const logs = ref<string[]>([
  "withContext(appContext) 适合把通知能力继续向 composable、store 或 service 层下发。",
  "当前示例只有一套 ConfigProvider.notification，普通 open() 与 withContext() 的默认配置表现一致。"
]);

function openScopedNotification() {
  const scopedNotify = XyNotificationService.withContext(instance?.appContext ?? null);

  scopedNotify.success({
    title: "显式绑定当前 appContext",
    message: "这条通知会沿用当前 ConfigProvider.notification 的位置和关闭策略。",
    duration: 0
  });

  logs.value.unshift("已通过 withContext(appContext) 触发一条 success 通知。");
}

function openPlainNotification() {
  XyNotificationService.open({
    title: "普通 open() 调用",
    message: "在单个 ConfigProvider 下，它也会继承同一套通知默认配置。",
    duration: 0
  });

  logs.value.unshift("已通过 open() 触发一条普通通知。");
}
</script>

<template>
  <xy-config-provider
    :notification="{
      position: 'bottom-left',
      duration: 0,
      showClose: true,
      max: 2
    }"
  >
    <div class="xy-doc-stack">
      <xy-space wrap>
        <xy-button type="primary" @click="openScopedNotification">
          withContext(appContext)
        </xy-button>
        <xy-button plain @click="openPlainNotification">open()</xy-button>
      </xy-space>

      <xy-tag round status="primary">
        多 app 或多套 Provider 并存时，建议继续显式绑定上下文，避免通知回退到默认配置。
      </xy-tag>

      <div class="notification-log-board">
        <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
      </div>
    </div>
  </xy-config-provider>
</template>

<style scoped>
.notification-log-board {
  display: grid;
  gap: 8px;
}
</style>
