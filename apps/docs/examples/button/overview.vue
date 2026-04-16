<template>
  <div class="xy-button-overview">
    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong class="xy-button-overview__label-title">基础</strong>
        <span class="xy-button-overview__label-subtitle">Filled</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button class="xy-button-overview__button">默认按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="primary">主要按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="success">成功按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="warning">提醒按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="danger">危险按钮</xy-button>
      </div>
    </div>

    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong class="xy-button-overview__label-title">朴素</strong>
        <span class="xy-button-overview__label-subtitle">Plain</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button class="xy-button-overview__button" plain>默认按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="primary" plain>主要按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="success" plain>成功按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="warning" plain>提醒按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="danger" plain>危险按钮</xy-button>
      </div>
    </div>

    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong class="xy-button-overview__label-title">圆角</strong>
        <span class="xy-button-overview__label-subtitle">Round</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button class="xy-button-overview__button" round>默认按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="primary" round>主要按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="success" round>成功按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="warning" round>提醒按钮</xy-button>
        <xy-button class="xy-button-overview__button" type="danger" round>危险按钮</xy-button>
      </div>
    </div>

    <div class="xy-button-overview__group">
      <div class="xy-button-overview__label">
        <strong class="xy-button-overview__label-title">圆形</strong>
        <span class="xy-button-overview__label-subtitle">Circle</span>
      </div>
      <div class="xy-button-overview__row">
        <xy-button class="xy-button-overview__button-circle" circle icon="mdi:magnify" aria-label="搜索" />
        <xy-button class="xy-button-overview__button-circle" type="primary" circle icon="mdi:pencil-outline" aria-label="编辑" />
        <xy-button class="xy-button-overview__button-circle" type="success" circle icon="mdi:check" aria-label="确认" />
        <xy-button class="xy-button-overview__button-circle" type="warning" circle icon="mdi:star-outline" aria-label="收藏" />
        <xy-button class="xy-button-overview__button-circle" type="danger" circle icon="mdi:delete-outline" aria-label="删除" />
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 86%, white);
  text-align: center;
}

.xy-button-overview__label-title {
  font-size: 13px;
  line-height: 1.2;
  color: var(--xy-text-color-heading);
}

.xy-button-overview__label-subtitle {
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--xy-text-color-subtle);
}

.xy-button-overview__row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.xy-button-overview__button {
  flex: 0 0 126px;
  justify-content: center;
}

.xy-button-overview__button-circle {
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

  .xy-button-overview__button {
    flex-basis: 118px;
  }
}

@media (max-width: 520px) {
  .xy-button-overview__button {
    flex: 1 1 calc(50% - 12px);
    min-width: 0;
  }
}
</style>
