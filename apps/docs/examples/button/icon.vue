<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" icon="mdi:magnify">搜索</xy-button>
      <xy-button plain round icon="mdi:download">导出</xy-button>
      <xy-button circle icon="mdi:plus" aria-label="新增成员" />
    </xy-space>

    <xy-space wrap>
      <xy-button plain>
        <template #prefix>
          <xy-icon icon="mdi:chevron-left" />
        </template>
        返回
      </xy-button>

      <xy-button type="primary">
        下一步
        <template #suffix>
          <xy-icon icon="mdi:arrow-right" />
        </template>
      </xy-button>
    </xy-space>
  </div>
</template>
