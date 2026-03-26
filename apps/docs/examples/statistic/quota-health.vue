<script setup lang="ts">
interface QuotaCard {
  title: string;
  value: number;
  suffix: string;
  precision?: number;
  hint: string;
  style: {
    color: string;
  };
}

function compactFormatter(value: number | string) {
  if (typeof value !== "number") {
    return value;
  }

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value;
}

const quotaCards: QuotaCard[] = [
  {
    title: "API 调用量",
    value: 38420540,
    suffix: "/ 天",
    hint: "剩余额度 18%，建议提前切到高峰保护策略",
    style: {
      color: "var(--xy-color-warning)"
    }
  },
  {
    title: "对象存储",
    value: 1284.36,
    suffix: "TB",
    precision: 2,
    hint: "素材归档后预计可回收 96TB 空间",
    style: {
      color: "var(--xy-color-primary)"
    }
  },
  {
    title: "离线队列积压",
    value: 7204,
    suffix: "条",
    hint: "当前 backlog 仍在收敛，夜间批任务建议限流",
    style: {
      color: "var(--xy-color-danger)"
    }
  }
];
</script>

<template>
  <div class="statistic-quota-grid">
    <xy-card
      v-for="item in quotaCards"
      :key="item.title"
      class="statistic-quota-grid__card"
      shadow="hover"
    >
      <xy-statistic
        :title="item.title"
        :value="item.value"
        :suffix="item.suffix"
        :precision="item.precision"
        :value-style="item.style"
        :formatter="item.title === 'API 调用量' ? compactFormatter : undefined"
      >
        <template #prefix>
          <span class="statistic-quota-grid__prefix">≈</span>
        </template>
      </xy-statistic>
      <p>{{ item.hint }}</p>
    </xy-card>
  </div>
</template>

<style scoped>
.statistic-quota-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.statistic-quota-grid__card p {
  margin: 12px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.statistic-quota-grid__prefix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}
</style>
