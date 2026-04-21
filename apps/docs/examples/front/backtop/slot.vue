<template>
  <div style="position: relative; height: 400px; overflow: auto; background: var(--xyu-bg-page); padding: 20px">
    <p v-for="i in 20" :key="i" style="margin: 10px 0; color: var(--xyu-text-secondary)">
      滚动页面查看自定义回到顶部按钮
    </p>
    <xyu-backtop :visibility-height="100">
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--xyu-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">↑</div>
    </xyu-backtop>
  </div>
</template>
