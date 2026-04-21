<template>
  <xyu-dropdown
    disabled
    :items="[
      { key: 'home', label: '首页' },
      { key: 'profile', label: '个人中心' }
    ]"
  >
    <xyu-button type="primary">禁用下拉菜单</xyu-button>
  </xyu-dropdown>
</template>
