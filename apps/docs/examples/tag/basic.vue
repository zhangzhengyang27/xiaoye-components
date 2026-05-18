<template>
  <!-- 标签基础用法：展示 5 种语义状态（默认/主要/成功/警告/危险），常用于状态标识 -->
  <xy-space wrap>
    <xy-tag>默认</xy-tag>
    <xy-tag status="primary">进行中</xy-tag>
    <xy-tag status="success">已完成</xy-tag>
    <xy-tag status="warning">待确认</xy-tag>
    <xy-tag status="danger">已拒绝</xy-tag>
  </xy-space>
</template>
