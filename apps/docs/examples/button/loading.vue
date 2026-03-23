<template>
  <xy-space wrap>
    <xy-button type="primary" loading>保存中</xy-button>
    <xy-button plain loading loading-icon="mdi:refresh">同步中</xy-button>
    <xy-button loading>
      <template #loading>
        <xy-space size="sm">
          <xy-icon icon="mdi:loading" spin />
          <span>处理中</span>
        </xy-space>
      </template>
      提交
    </xy-button>
  </xy-space>
</template>
