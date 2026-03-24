<template>
  <xy-space wrap>
    <xy-tooltip trigger="click" content="点击外部区域即可关闭" :show-arrow="false">
      <xy-button plain>Click 触发</xy-button>
    </xy-tooltip>

    <xy-tooltip
      trigger="focus"
      placement="bottom-start"
      :offset="16"
      max-width="320px"
      content="这个提示更适合输入框、表头说明或需要更长文案的场景。"
    >
      <xy-button type="primary">Focus + maxWidth</xy-button>
    </xy-tooltip>
  </xy-space>
</template>
