<template>
  <xy-space wrap>
    <xy-tooltip
      :trigger="['click', 'contextmenu']"
      :trigger-keys="['Enter', 'F2']"
      effect="light"
      placement="right-start"
      :popper-options="{
        strategy: 'absolute',
        fallbackPlacements: ['left-start']
      }"
    >
      <xy-button plain>右键或按 F2</xy-button>

      <template #content>
        <div class="demo-tooltip-advanced">
          <strong class="demo-tooltip-advanced__title">组合触发</strong>
          <p class="demo-tooltip-advanced__description">
            支持 click 与 contextmenu 组合；键盘可以继续用 Enter 或自定义 F2。
          </p>
        </div>
      </template>
    </xy-tooltip>
  </xy-space>
</template>

<style scoped>
.demo-tooltip-advanced {
  display: grid;
  gap: 6px;
  max-width: 240px;
}

.demo-tooltip-advanced__title {
  font-weight: 600;
}

.demo-tooltip-advanced__description {
  margin: 0;
  color: inherit;
}
</style>
