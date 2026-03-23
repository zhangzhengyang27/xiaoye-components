<template>
  <div class="xy-doc-stack">
    <xy-input placeholder="项目域名">
      <template #prepend>https://</template>
      <template #append>.xiaoye.dev</template>
    </xy-input>

    <xy-input
      placeholder="搜索项目"
      prefix-icon="mdi:magnify"
      suffix-icon="mdi:information-outline"
    >
      <template #suffix>
        <xy-tag size="sm">筛选中</xy-tag>
      </template>
    </xy-input>
  </div>
</template>
