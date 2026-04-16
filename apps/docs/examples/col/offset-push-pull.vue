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
  background: color-mix(in srgb, var(--xy-color-primary) 12%, white);
  color: color-mix(in srgb, var(--xy-color-primary) 78%, var(--xy-text-color));
  text-align: center;
  font-weight: 600;
}

.col-demo-block--accent {
  background: color-mix(in srgb, var(--xy-color-info) 12%, white);
  color: color-mix(in srgb, var(--xy-color-info) 78%, var(--xy-text-color));
}
</style>
