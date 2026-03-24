<template>
  <xy-result
    variant="card"
    size="lg"
    status="primary"
    title="批量更新已进入执行队列"
    description="系统已经锁定本次变更快照，预计 3 分钟内完成分发。你可以先离开页面，任务结束后会通过通知中心提醒。"
  >
    <template #extra>
      <xy-button type="primary">查看任务详情</xy-button>
      <xy-button plain>回到列表</xy-button>
    </template>
  </xy-result>
</template>
