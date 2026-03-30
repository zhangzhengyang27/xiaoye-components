<template>
  <xy-notice-center
    :tabs="[
      {
        key: 'todo',
        label: '待处理',
        items: [
          {
            key: 'approve-1',
            title: '审批提醒',
            content: '有新的采购审批等待处理',
            time: '刚刚',
            tag: '紧急',
            tagStatus: 'warning'
          }
        ]
      },
      {
        key: 'notice',
        label: '公告',
        items: []
      }
    ]"
    :actions="[
      { key: 'read-all', label: '全部已读', icon: 'mdi:check' },
      { key: 'open-center', label: '进入消息中心', icon: 'mdi:arrow-right' }
    ]"
  />
</template>
