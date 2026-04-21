<template>
  <xyu-space>
    <xyu-dropdown
      placement="top"
      :items="[
        { key: 'top', label: '顶部菜单项' }
      ]"
    >
      <xyu-button>顶部弹出</xyu-button>
    </xyu-dropdown>
    <xyu-dropdown
      placement="bottom"
      :items="[
        { key: 'bottom', label: '底部菜单项' }
      ]"
    >
      <xyu-button>底部弹出</xyu-button>
    </xyu-dropdown>
  </xyu-space>
</template>
