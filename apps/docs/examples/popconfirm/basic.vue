<template>
  <xy-popconfirm
    title="确定要归档这批记录吗？"
    content="归档后会从当前列表移除，但仍可在历史记录中找回。"
  >
    <template #reference>
      <xy-button plain>归档记录</xy-button>
    </template>
  </xy-popconfirm>
</template>
