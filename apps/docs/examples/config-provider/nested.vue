<template>
  <div class="xy-doc-stack">
    <xy-config-provider size="sm">
      <xy-space wrap>
        <xy-button plain>外层 small</xy-button>
        <xy-input placeholder="small 输入框" />
      </xy-space>
    </xy-config-provider>

    <xy-config-provider size="lg" :z-index="3200">
      <xy-space wrap>
        <xy-button type="primary">内层 large</xy-button>
        <xy-input placeholder="large 输入框" />
      </xy-space>
    </xy-config-provider>
  </div>
</template>
