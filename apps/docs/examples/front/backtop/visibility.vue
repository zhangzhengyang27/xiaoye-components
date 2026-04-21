<template>
  <div style="position: relative; height: 400px; overflow: auto; background: var(--xyu-bg-page); padding: 20px">
    <p v-for="i in 20" :key="i" style="margin: 10px 0; color: var(--xyu-text-secondary)">
      滚动超过 300px 后才显示回到顶部按钮
    </p>
    <xyu-backtop :visibility-height="300" />
  </div>
</template>
