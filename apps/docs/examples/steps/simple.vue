<template>
  <xy-steps simple :active="1" finish-status="success">
    <xy-step title="创建工单" />
    <xy-step title="处理反馈">
      <template #icon>
        <xy-icon icon="mdi:message-reply-text-outline" />
      </template>
    </xy-step>
    <xy-step title="确认解决" />
    <xy-step title="关闭归档" />
  </xy-steps>
</template>
