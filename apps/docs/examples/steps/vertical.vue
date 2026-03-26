<template>
  <xy-steps direction="vertical" :active="2" space="96px">
    <xy-step title="拉取分支">
      <template #description>从发布分支同步本次版本的基线代码。</template>
    </xy-step>
    <xy-step title="执行测试">
      <template #description>跑通类型检查、单测和关键页面回归。</template>
    </xy-step>
    <xy-step title="变更复核">
      <template #description>确认风险、补齐说明并准备合并。</template>
    </xy-step>
    <xy-step title="发布完成">
      <template #description>产物上传完成后通知相关负责人。</template>
    </xy-step>
  </xy-steps>
</template>
