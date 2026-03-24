<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-tag status="neutral">默认尺寸</xy-tag>
      <xy-pagination :current-page="3" :page-size="20" :total="86" />
    </xy-space>

    <xy-space wrap>
      <xy-tag status="primary">small</xy-tag>
      <xy-pagination small :current-page="3" :page-size="20" :total="86" />
    </xy-space>

    <xy-space wrap>
      <xy-tag status="success">lg</xy-tag>
      <xy-pagination size="lg" :current-page="3" :page-size="20" :total="86" />
    </xy-space>
  </div>
</template>
