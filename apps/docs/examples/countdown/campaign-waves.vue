<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

type WaveTone = "primary" | "warning" | "danger";

interface CampaignWave {
  name: string;
  channel: string;
  target: ReturnType<typeof dayjs> | null;
  note: string;
  owner: string;
  tone: WaveTone;
  highlight: string;
}

const waves = ref<CampaignWave[]>([
  {
    name: "预热场",
    channel: "站内 Push + Banner",
    target: null,
    note: "适合把倒计时直接挂进作战室面板，提醒运营同学什么时候切换资源位。",
    owner: "负责人 Aiden",
    tone: "primary",
    highlight: "窗口充足"
  },
  {
    name: "主会场开场",
    channel: "直播会场 + 首页 Hero",
    target: null,
    note: "临近开场时自动切成高风险色，便于大促作战室快速扫盘。",
    owner: "负责人 Chloe",
    tone: "warning",
    highlight: "临近切换"
  },
  {
    name: "加码场",
    channel: "秒杀流量池",
    target: null,
    note: "适合搭配 title / prefix / suffix 插槽，把倒计时做成更贴业务的话术。",
    owner: "负责人 Mason",
    tone: "danger",
    highlight: "最后校准"
  }
]);

onMounted(() => {
  const start = dayjs();
  const offsets = [7, 28, 85];

  waves.value = waves.value.map((wave, index) => ({
    ...wave,
    target: start.add(offsets[index] ?? 10, "minute").add(index * 13, "second")
  }));
});

function handleChange(index: number, remainingMs: number) {
  const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
  const tone: WaveTone =
    remainingMinutes <= 10 ? "danger" : remainingMinutes <= 30 ? "warning" : "primary";

  waves.value[index] = {
    ...waves.value[index],
    tone,
    highlight:
      tone === "danger"
        ? "立即确认"
        : tone === "warning"
          ? "临近切换"
          : "窗口充足"
  };
}

function getValueStyle(tone: WaveTone) {
  if (tone === "danger") {
    return {
      color: "var(--xy-color-danger)"
    };
  }

  if (tone === "warning") {
    return {
      color: "var(--xy-color-warning)"
    };
  }

  return {
    color: "var(--xy-color-primary)"
  };
}
</script>

<template>
  <div class="countdown-campaign-grid">
    <xy-card
      v-for="(wave, index) in waves"
      :key="wave.name"
      class="countdown-campaign-grid__card"
      shadow="hover"
    >
      <template #header>
        <div class="countdown-campaign-grid__header">
          <div>
            <strong>{{ wave.name }}</strong>
            <p class="countdown-campaign-grid__header-description">{{ wave.channel }} · {{ wave.owner }}</p>
          </div>
          <xy-tag :status="wave.tone" round>{{ wave.highlight }}</xy-tag>
        </div>
      </template>

      <xy-countdown
        v-if="wave.target"
        :value="wave.target"
        format="mm:ss"
        :value-style="getValueStyle(wave.tone)"
        @change="handleChange(index, $event)"
      >
        <template #title>
          <div class="countdown-campaign-grid__title">
            距离资源位切换
            <span>{{ wave.channel }}</span>
          </div>
        </template>
        <template #prefix>
          <span class="countdown-campaign-grid__prefix">T-</span>
        </template>
        <template #suffix>
          <span class="countdown-campaign-grid__suffix">切场</span>
        </template>
      </xy-countdown>

      <p class="countdown-campaign-grid__note">{{ wave.note }}</p>
    </xy-card>
  </div>
</template>

<style scoped>
.countdown-campaign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.countdown-campaign-grid__card {
  min-height: 230px;
}

.countdown-campaign-grid__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.countdown-campaign-grid__header-description,
.countdown-campaign-grid__note {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.countdown-campaign-grid__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.countdown-campaign-grid__title span,
.countdown-campaign-grid__prefix,
.countdown-campaign-grid__suffix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .countdown-campaign-grid__header {
    flex-direction: column;
  }
}
</style>
