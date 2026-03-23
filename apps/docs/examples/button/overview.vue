<template>
  <div class="xy-button-overview">
    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong>基础</strong>
        <span>Filled</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button>默认按钮</xy-button>
        <xy-button type="primary">主要按钮</xy-button>
        <xy-button type="success">成功按钮</xy-button>
        <xy-button type="warning">提醒按钮</xy-button>
        <xy-button type="danger">危险按钮</xy-button>
      </div>
    </div>

    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong>朴素</strong>
        <span>Plain</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button plain>默认按钮</xy-button>
        <xy-button type="primary" plain>主要按钮</xy-button>
        <xy-button type="success" plain>成功按钮</xy-button>
        <xy-button type="warning" plain>提醒按钮</xy-button>
        <xy-button type="danger" plain>危险按钮</xy-button>
      </div>
    </div>

    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong>圆角</strong>
        <span>Round</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button round>默认按钮</xy-button>
        <xy-button type="primary" round>主要按钮</xy-button>
        <xy-button type="success" round>成功按钮</xy-button>
        <xy-button type="warning" round>提醒按钮</xy-button>
        <xy-button type="danger" round>危险按钮</xy-button>
      </div>
    </div>

    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong>圆形</strong>
        <span>Circle</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button circle icon="mdi:magnify" aria-label="搜索" />
        <xy-button type="primary" circle icon="mdi:pencil-outline" aria-label="编辑" />
        <xy-button type="success" circle icon="mdi:check" aria-label="确认" />
        <xy-button type="warning" circle icon="mdi:star-outline" aria-label="收藏" />
        <xy-button type="danger" circle icon="mdi:delete-outline" aria-label="删除" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.xy-button-overview {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.xy-button-overview__group {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.xy-button-overview__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.9));
  text-align: center;
}

.xy-button-overview__label strong {
  font-size: 13px;
  line-height: 1.2;
  color: var(--vp-c-text-1);
}

.xy-button-overview__label span {
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.xy-button-overview__row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.xy-button-overview__row :deep(.xy-button:not(.is-circle)) {
  flex: 0 0 126px;
  justify-content: center;
}

.xy-button-overview__row :deep(.xy-button.is-circle) {
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .xy-button-overview {
    gap: 12px;
  }

  .xy-button-overview__group {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .xy-button-overview__label {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }

  .xy-button-overview__row {
    gap: 12px;
  }

  .xy-button-overview__row :deep(.xy-button:not(.is-circle)) {
    flex-basis: 118px;
  }
}

@media (max-width: 520px) {
  .xy-button-overview__row :deep(.xy-button:not(.is-circle)) {
    flex: 1 1 calc(50% - 12px);
    min-width: 0;
  }
}
</style>
