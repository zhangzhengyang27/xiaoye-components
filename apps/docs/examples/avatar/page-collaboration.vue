<template>
  <xy-page-container
    title="协作成员"
    description="AvatarGroup 可以作为页面壳层中的协作成员摘要区块。"
    :meta-items="[
      { label: '负责人', value: '小叶', icon: 'mdi:account-circle' }
    ]"
    shadow
  >
    <xy-card header="当前参与成员">
      <xy-avatar-group
        :items="[
          { key: 'xiaoye', text: '叶' },
          { key: 'mavis', text: 'MV' },
          { key: 'luna', icon: 'mdi:account-outline' },
          { key: 'kai', text: '凯' }
        ]"
        :gutter="10"
        collapse-avatars
        collapse-avatars-tooltip
        :max-collapse-avatars="3"
      />
    </xy-card>
  </xy-page-container>
</template>
