<script setup lang="ts">
interface LazyNodeData {
  id: number;
  label: string;
  isLeaf?: boolean;
}

const data: LazyNodeData[] = [
  { id: 1, label: "组织架构" },
  { id: 2, label: "资源目录" }
];

function load(
  node: { level: number; data?: LazyNodeData },
  resolve: (data: LazyNodeData[]) => void,
  reject: () => void
) {
  window.setTimeout(() => {
    if (node.level === 1 && node.data?.id === 1) {
      resolve([
        { id: 11, label: "华东区" },
        { id: 12, label: "华南区", isLeaf: true }
      ]);
      return;
    }

    if (node.level === 1 && node.data?.id === 2) {
      resolve([
        { id: 21, label: "图片资源", isLeaf: true },
        { id: 22, label: "文档资源", isLeaf: true }
      ]);
      return;
    }

    if (node.level > 2) {
      reject();
      return;
    }

    resolve([
      { id: Number(`${node.data?.id ?? 0}1`), label: "下级节点 A", isLeaf: true },
      { id: Number(`${node.data?.id ?? 0}2`), label: "下级节点 B", isLeaf: true }
    ]);
  }, 320);
}
</script>

<template>
  <div class="xy-doc-field">
    <xy-tree
      :data="data"
      node-key="id"
      lazy
      :props="{ label: 'label', isLeaf: 'isLeaf' }"
      :load="load"
    />
  </div>
</template>
