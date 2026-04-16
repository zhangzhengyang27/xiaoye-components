<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

type FreezeStage = "pending" | "frozen" | "recovered";

const stage = ref<FreezeStage>("pending");
const freezeStart = ref<Date | null>(null);
const freezeEnd = ref<Date | null>(null);

onMounted(() => {
  const now = Date.now();

  freezeStart.value = new Date(now + 18 * 60 * 1000);
  freezeEnd.value = new Date(now + 2 * 60 * 60 * 1000);
});

const currentTitle = computed(() => {
  if (stage.value === "pending") {
    return "距离进入变更冻结";
  }

  if (stage.value === "frozen") {
    return "距离恢复变更";
  }

  return "冻结窗口已结束";
});

const currentTarget = computed(() => {
  if (stage.value === "pending") {
    return freezeStart.value;
  }

  return freezeEnd.value;
});

const currentTag = computed(() => {
  if (stage.value === "pending") {
    return {
      status: "warning" as const,
      text: "即将冻结"
    };
  }

  if (stage.value === "frozen") {
    return {
      status: "danger" as const,
      text: "冻结中"
    };
  }

  return {
    status: "success" as const,
    text: "已恢复"
  };
});

const currentDescription = computed(() => {
  if (stage.value === "pending") {
    return "适合承接发版窗口、数据库迁移或节假日大促前的变更冻结提示。";
  }

  if (stage.value === "frozen") {
    return "冻结期间禁止直接合并高风险改动，所有发布请求都需要转审批或排队。";
  }

  return "当前已恢复正常变更节奏，可以重新开放流水线和热修复申请。";
});

function handleFinish() {
  if (stage.value === "pending") {
    stage.value = "frozen";
    return;
  }

  if (stage.value === "frozen") {
    stage.value = "recovered";
  }
}
</script>

<template>
  <xy-card class="countdown-freeze-panel" shadow="always">
    <template #header>
      <div class="countdown-freeze-panel__header">
        <div>
          <strong>发布冻结窗口</strong>
          <p class="countdown-freeze-panel__header-description">
            把“何时开始冻结、何时恢复变更”统一收进同一块发布看板里。
          </p>
        </div>
        <xy-tag :status="currentTag.status" round>{{ currentTag.text }}</xy-tag>
      </div>
    </template>

    <div class="countdown-freeze-panel__body">
      <xy-countdown
        class="countdown-freeze-panel__countdown"
        v-if="currentTarget"
        :key="stage"
        :value="currentTarget"
        :title="currentTitle"
        format="HH:mm:ss"
        @finish="handleFinish"
      >
        <template #prefix>
          <span class="countdown-freeze-panel__prefix">
            {{ stage === "pending" ? "T-" : stage === "frozen" ? "恢复前" : "已恢复" }}
          </span>
        </template>
        <template #suffix>
          <span class="countdown-freeze-panel__suffix">
            {{ stage === "pending" ? "开始" : stage === "frozen" ? "恢复" : "完成" }}
          </span>
        </template>
      </xy-countdown>

      <div class="countdown-freeze-panel__aside">
        <div>
          <strong>当前策略</strong>
          <p class="countdown-freeze-panel__aside-description">{{ currentDescription }}</p>
        </div>
        <ul class="countdown-freeze-panel__aside-list">
          <li class="countdown-freeze-panel__aside-item">核心链路只允许紧急热修复申请</li>
          <li class="countdown-freeze-panel__aside-item">数据库变更统一切到下一批窗口</li>
          <li class="countdown-freeze-panel__aside-item">值班群内同步冻结状态和恢复时间</li>
        </ul>
      </div>
    </div>
  </xy-card>
</template>

<style scoped>
.countdown-freeze-panel {
  max-width: 760px;
}

.countdown-freeze-panel__header,
.countdown-freeze-panel__body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.countdown-freeze-panel__header-description,
.countdown-freeze-panel__aside-description,
.countdown-freeze-panel__aside-item {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.countdown-freeze-panel__body {
  margin-top: 4px;
}

.countdown-freeze-panel__countdown {
  flex: 0 0 280px;
}

.countdown-freeze-panel__prefix,
.countdown-freeze-panel__suffix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.countdown-freeze-panel__aside {
  min-width: 0;
}

.countdown-freeze-panel__aside-list {
  margin: 12px 0 0;
  padding-left: 18px;
}

@media (max-width: 640px) {
  .countdown-freeze-panel__header,
  .countdown-freeze-panel__body {
    flex-direction: column;
  }

  .countdown-freeze-panel__countdown {
    flex-basis: auto;
  }
}
</style>
