<template>
  <xy-space wrap>
    <xy-popover
      trigger="hover"
      title="Hover 说明"
      content="当内容只是补充解释，又希望视觉上比 Tooltip 更完整时，可以用 hover Popover。"
      width="300px"
    >
      <template #reference>
        <xy-button plain>Hover 打开</xy-button>
      </template>
    </xy-popover>

    <xy-popover title="内部关闭" width="320px">
      <template #reference>
        <xy-button type="primary">插槽关闭能力</xy-button>
      </template>

      <template #default="{ close }">
        <div class="xy-doc-stack">
          <p>默认插槽会暴露一个 `close` 方法，适合在卡片内部完成确认后主动关闭。</p>
          <xy-button text @click="close()">我知道了</xy-button>
        </div>
      </template>
    </xy-popover>
  </xy-space>
</template>
