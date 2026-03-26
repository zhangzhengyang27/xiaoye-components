<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import { XyMessage } from "xiaoye-components";

const instance = getCurrentInstance();
const appMessage = instance?.appContext.config.globalProperties.$message as
  | typeof XyMessage
  | undefined;

const logs = ref<string[]>([
  "withContext(appContext) 适合把消息能力继续传给 composable、store 或 service 层。",
  "$message.withContext() 会默认继承当前 app，可继续向业务模块透传。"
]);

function openScopedImportMessage() {
  const scopedMessage = XyMessage.withContext(instance?.appContext ?? null);

  scopedMessage.success({
    message: "显式绑定当前 appContext 的消息提示。",
    placement: "bottom-right",
    duration: 0,
    showClose: true
  });

  logs.value.unshift("已通过 XyMessage.withContext(appContext) 打开一条 success 消息。");
}

function openInjectedScopedMessage() {
  appMessage?.withContext().warning({
    message: "通过 $message.withContext() 继续复用当前 app 的默认消息配置。",
    duration: 0
  });

  logs.value.unshift("已通过 $message.withContext() 打开一条 warning 消息。");
}
</script>

<template>
  <xy-config-provider
    :message="{
      placement: 'bottom-right',
      duration: 0,
      showClose: true,
      grouping: true,
      max: 2
    }"
  >
    <div class="xy-doc-stack">
      <xy-space wrap>
        <xy-button type="primary" @click="openScopedImportMessage">
          XyMessage.withContext(appContext)
        </xy-button>
        <xy-button plain @click="openInjectedScopedMessage"> $message.withContext() </xy-button>
      </xy-space>

      <xy-tag round status="primary">
        单个 ConfigProvider 下两种方式都会继承同一套默认消息配置；多 app 并存时建议显式绑定。
      </xy-tag>

      <div class="message-context-log-board">
        <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
      </div>
    </div>
  </xy-config-provider>
</template>

<style scoped>
.message-context-log-board {
  display: grid;
  gap: 8px;
}
</style>
