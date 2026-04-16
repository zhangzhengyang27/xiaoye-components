<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

const target = ref<ReturnType<typeof dayjs> | null>(null);
const finished = ref(false);

onMounted(() => {
  target.value = dayjs().add(1, "day").add(6, "hour").add(30, "minute");
});
</script>

<template>
  <xy-card class="countdown-basic-card" shadow="always">
    <template #header>
      <div class="countdown-basic-card__header">
        <strong>版本发布窗口</strong>
        <span>{{ finished ? "已到达发布时间" : "正在倒计时" }}</span>
      </div>
    </template>

    <xy-countdown
      v-if="target"
      :value="target"
      title="距离灰度开始"
      @finish="finished = true"
    />
    <p v-else class="countdown-basic-card__loading">正在加载倒计时...</p>
  </xy-card>
</template>

<style scoped>
.countdown-basic-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.countdown-basic-card__header span,
.countdown-basic-card__loading {
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.countdown-basic-card__loading {
  margin: 0;
}
</style>
