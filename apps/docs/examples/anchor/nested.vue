<script setup lang="ts">
const sections = [
  {
    id: "anchor-nested-guide",
    title: "接入指引",
    description: "父级节点可以自己带 href，也可以只作为层级标题。"
  },
  {
    id: "anchor-nested-api",
    title: "接口约定",
    description: "接口约定、字段映射和事件回调通常是最适合放子级目录的部分。"
  },
  {
    id: "anchor-nested-test",
    title: "验证清单",
    description: "回归验证、联调检查和上线确认也很适合拆成子级锚点。"
  }
];
</script>

<template>
  <div class="demo-anchor-nested">
    <xy-anchor container=".demo-anchor-nested__viewport" :sync-hash="false">
      <xy-anchor-link title="实施方案" href="#anchor-nested-guide">
        <xy-anchor-link title="接口约定" href="#anchor-nested-api" />
        <xy-anchor-link title="验证清单" href="#anchor-nested-test" />
      </xy-anchor-link>
    </xy-anchor>

    <div class="demo-anchor-nested__viewport">
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="demo-anchor-nested__section"
      >
        <h4>{{ section.title }}</h4>
        <p>{{ section.description }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-anchor-nested {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 20px;
}

.demo-anchor-nested__viewport {
  height: 300px;
  overflow: auto;
  padding: 8px 16px;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
}

.demo-anchor-nested__section {
  min-height: 180px;
  padding: 20px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-anchor-nested__section:last-child {
  border-bottom: 0;
}

.demo-anchor-nested__section h4 {
  margin: 0 0 10px;
  color: var(--xy-text-color);
}

.demo-anchor-nested__section p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .demo-anchor-nested {
    grid-template-columns: 1fr;
  }
}
</style>
