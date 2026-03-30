<template>
  <xy-descriptions
    title="成员信息"
    :items="[
      {
        label: '负责人',
        value: '小叶',
        icon: 'mdi:account-circle-outline'
      },
      {
        label: '状态',
        value: '启用',
        tag: {
          text: '启用',
          props: {
            status: 'success'
          }
        }
      },
      {
        label: '文档',
        value: '查看成员手册',
        link: {
          href: '/components/link',
          target: '_blank'
        }
      }
    ]"
  />
</template>
