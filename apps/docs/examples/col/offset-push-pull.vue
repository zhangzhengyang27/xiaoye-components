<template>
  <div class="xy-doc-stack">
    <xy-row :gutter="16">
      <xy-col :span="8">
        <div class="col-demo-block">span 8</div>
      </xy-col>
      <xy-col :span="8" :offset="4">
        <div class="col-demo-block col-demo-block--accent">offset 4</div>
      </xy-col>
    </xy-row>

    <xy-row :gutter="16">
      <xy-col :span="8" :push="4">
        <div class="col-demo-block">push 4</div>
      </xy-col>
      <xy-col :span="8" :pull="4">
        <div class="col-demo-block col-demo-block--accent">pull 4</div>
      </xy-col>
    </xy-row>
  </div>
</template>

<style scoped>
.col-demo-block {
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  text-align: center;
  font-weight: 600;
}

.col-demo-block--accent {
  background: rgba(14, 165, 233, 0.12);
  color: #0369a1;
}
</style>
