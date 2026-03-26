<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

const target = ref<ReturnType<typeof dayjs> | null>(null);
const lastSeconds = ref(0);

onMounted(() => {
  target.value = dayjs()
    .add(2, "day")
    .add(3, "hour")
    .add(12, "minute")
    .add(6, "second")
    .add(120, "millisecond");
});

function handleChange(value: number) {
  lastSeconds.value = Math.ceil(value / 1000);
}
</script>

<template>
  <div class="countdown-format-grid">
    <xy-card shadow="hover">
      <xy-countdown
        v-if="target"
        :value="target"
        title="发布时间"
        format="DD [days] HH:mm:ss"
      />
    </xy-card>

    <xy-card shadow="hover">
      <xy-countdown
        v-if="target"
        :value="target"
        title="精细时间"
        format="HH:mm:ss:SSS"
        @change="handleChange"
      />
      <p>最近一次 change 回调还剩 {{ lastSeconds }} 秒。</p>
    </xy-card>
  </div>
</template>

<style scoped>
.countdown-format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.countdown-format-grid p {
  margin: 12px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}
</style>
