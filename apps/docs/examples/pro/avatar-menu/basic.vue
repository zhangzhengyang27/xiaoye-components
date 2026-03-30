<template>
  <xy-avatar-menu
    username="小叶"
    description="系统管理员"
    :items="[
      { key: 'profile', label: '个人中心', command: 'profile' },
      { key: 'logout', label: '退出登录', command: 'logout', danger: true }
    ]"
  />
</template>
