<template>
  <xyu-dropdown
    trigger="hover"
    :items="[
      { key: 'home', label: '首页' },
      { key: 'profile', label: '个人中心' },
      { key: 'settings', label: '设置' }
    ]"
  >
    <xyu-button type="primary">悬停显示菜单</xyu-button>
  </xyu-dropdown>
</template>
