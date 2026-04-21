<template>
  <div style="position: relative; height: 400px; overflow: auto; background: var(--xyu-bg-page); padding: 20px">
    <p v-for="i in 20" :key="i" style="margin: 10px 0; color: var(--xyu-text-secondary)">
      滚动页面查看回到顶部按钮位置变化
    </p>
    <xyu-backtop :right="60" :bottom="80" />
  </div>
</template>
