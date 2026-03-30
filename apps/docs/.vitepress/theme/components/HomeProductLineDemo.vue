<template>
  <div class="xy-home-demo">
    <div class="xy-home-demo__intro">
      <xy-tag status="primary">双产品线</xy-tag>
      <h3>基础层负责通用，增强层负责中后台闭环</h3>
      <p>
        这不是单个组件的视觉陈列，而是更接近真实后台页面的最小片段。先感受基础层控件如何提供原子能力，再看增强层如何把它们编排成完整后台闭环。
      </p>
    </div>

    <div class="xy-home-demo__surface">
      <xy-space wrap>
        <xy-input placeholder="搜索成员 / 项目" clearable />
        <xy-select
          :options="[
            { label: '全部角色', value: 'all' },
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' }
          ]"
          placeholder="角色筛选"
          clearable
        />
        <xy-button type="primary">新建成员</xy-button>
        <xy-button plain>导出数据</xy-button>
      </xy-space>

      <div class="xy-home-metrics">
        <div>
          <strong>60+</strong>
          <span>基础组件</span>
        </div>
        <div>
          <strong>30+</strong>
          <span>增强组件规划池</span>
        </div>
        <div>
          <strong>1</strong>
          <span>后台旗舰闭环示例</span>
        </div>
      </div>
    </div>
  </div>
</template>
