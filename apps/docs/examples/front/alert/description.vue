<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-alert
      title="标题"
      description="这是一段描述文字，补充说明标题的详细内容。"
      type="success"
    />
    <xyu-alert
      title="带操作的描述"
      description="描述文字支持插槽，可在操作区添加自定义内容。"
      type="info"
    >
      <template #actions>
        <xyu-button size="small" type="primary">查看详情</xyu-button>
        <xyu-button size="small">忽略</xyu-button>
      </template>
    </xyu-alert>
    <xyu-alert
      title="超长描述"
      description="这是一段非常长的描述文字，用于测试描述区域的显示效果。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      type="warning"
      :description-line-clamp="2"
    />
  </xyu-space>
</template>
