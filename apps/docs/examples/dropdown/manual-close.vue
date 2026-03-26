<template>
  <xy-dropdown trigger="click" :hide-on-click="false">
    <xy-button plain>选择后保持展开</xy-button>

    <template #dropdown>
      <xy-dropdown-menu>
        <xy-dropdown-item command="copy">复制链接</xy-dropdown-item>
        <xy-dropdown-item command="archive" description="适合连续执行的批量操作">
          归档当前条件
        </xy-dropdown-item>
      </xy-dropdown-menu>
    </template>
  </xy-dropdown>
</template>
