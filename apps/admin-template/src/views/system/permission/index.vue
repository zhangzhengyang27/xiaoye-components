<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTree, XyButton, XyTag, XySpace, XyMessage, XySwitch, XyIcon } from 'xiaoye-components'

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  permission?: string
  type: 'page' | 'button' | 'api'
}

const permissionTree = ref<TreeNode[]>([
  {
    id: '1',
    label: '系统管理',
    type: 'page',
    children: [
      {
        id: '1-1',
        label: '用户管理',
        type: 'page',
        children: [
          { id: '1-1-1', label: '查看用户', type: 'button', permission: 'user:view' },
          { id: '1-1-2', label: '新增用户', type: 'button', permission: 'user:add' },
          { id: '1-1-3', label: '编辑用户', type: 'button', permission: 'user:edit' },
          { id: '1-1-4', label: '删除用户', type: 'button', permission: 'user:delete' }
        ]
      },
      {
        id: '1-2',
        label: '角色管理',
        type: 'page',
        children: [
          { id: '1-2-1', label: '查看角色', type: 'button', permission: 'role:view' },
          { id: '1-2-2', label: '新增角色', type: 'button', permission: 'role:add' },
          { id: '1-2-3', label: '编辑角色', type: 'button', permission: 'role:edit' },
          { id: '1-2-4', label: '删除角色', type: 'button', permission: 'role:delete' },
          { id: '1-2-5', label: '分配权限', type: 'button', permission: 'role:assign' }
        ]
      },
      {
        id: '1-3',
        label: '菜单管理',
        type: 'page',
        children: [
          { id: '1-3-1', label: '查看菜单', type: 'button', permission: 'menu:view' },
          { id: '1-3-2', label: '新增菜单', type: 'button', permission: 'menu:add' },
          { id: '1-3-3', label: '编辑菜单', type: 'button', permission: 'menu:edit' },
          { id: '1-3-4', label: '删除菜单', type: 'button', permission: 'menu:delete' }
        ]
      }
    ]
  },
  {
    id: '2',
    label: '内容管理',
    type: 'page',
    children: [
      {
        id: '2-1',
        label: '文章管理',
        type: 'page',
        children: [
          { id: '2-1-1', label: '查看文章', type: 'button', permission: 'article:view' },
          { id: '2-1-2', label: '新增文章', type: 'button', permission: 'article:add' },
          { id: '2-1-3', label: '编辑文章', type: 'button', permission: 'article:edit' },
          { id: '2-1-4', label: '删除文章', type: 'button', permission: 'article:delete' },
          { id: '2-1-5', label: '发布文章', type: 'button', permission: 'article:publish' }
        ]
      }
    ]
  },
  {
    id: '3',
    label: '统计分析',
    type: 'page',
    children: [
      { id: '3-1', label: '统计报表', type: 'page', permission: 'statistics:report:view' },
      { id: '3-2', label: '数据分析', type: 'page', permission: 'statistics:analysis:view' }
    ]
  }
])

const selectedPermission = ref('')
const checkedPermissions = ref<string[]>([])

function handleSelect(node: TreeNode) {
  selectedPermission.value = node.permission || node.id
}

function handleCheck(checked: boolean, node: TreeNode) {
  if (checked) {
    if (!checkedPermissions.value.includes(node.id)) {
      checkedPermissions.value.push(node.id)
    }
  } else {
    checkedPermissions.value = checkedPermissions.value.filter(id => id !== node.id)
  }
}

function getTypeIcon(type: string) {
  const icons: Record<string, string> = {
    page: 'mdi:file-document',
    button: 'mdi:gesture-tap',
    api: 'mdi:api'
  }
  return icons[type] || 'mdi:file'
}

function getTypeTag(type: string) {
  const tags: Record<string, { text: string; color: string }> = {
    page: { text: '页面', color: 'primary' },
    button: { text: '按钮', color: 'success' },
    api: { text: '接口', color: 'warning' }
  }
  return tags[type] || { text: type, color: 'info' }
}

function handleSave() {
  XyMessage.success('权限配置已保存')
}

function handleExpandAll() {
  XyMessage.info('展开全部功能待实现')
}

function handleCollapseAll() {
  XyMessage.info('折叠全部功能待实现')
}
</script>

<template>
  <div class="permission-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">权限管理</h2>
          <p class="page-desc">配置角色权限和访问控制</p>
        </div>
        <div class="header-right">
          <XySpace>
            <XyButton @click="handleExpandAll">
              展开全部
            </XyButton>
            <XyButton @click="handleCollapseAll">
              折叠全部
            </XyButton>
            <XyButton type="primary" @click="handleSave">
              保存配置
            </XyButton>
          </XySpace>
        </div>
      </div>
    </XyCard>

    <div class="permission-content">
      <XyCard class="permission-tree">
        <template #header>
          <div class="card-header">
            <span>权限树</span>
            <XyTag type="info">{{ checkedPermissions.length }} 已选</XyTag>
          </div>
        </template>
        <XyTree
          :data="permissionTree"
          node-key="id"
          show-checkbox
          default-expand-all
          @node-click="handleSelect"
          @check="handleCheck"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <XyIcon :icon="getTypeIcon(data.type)" :size="16" />
              <span class="node-label">{{ node.label }}</span>
              <XyTag :type="getTypeTag(data.type).color" size="small">
                {{ getTypeTag(data.type).text }}
              </XyTag>
            </div>
          </template>
        </XyTree>
      </XyCard>

      <XyCard class="permission-detail">
        <template #header>
          <div class="card-header">
            <span>权限详情</span>
          </div>
        </template>
        <div v-if="selectedPermission" class="detail-info">
          <XySpace direction="vertical" fill>
            <div class="detail-item">
              <span class="label">权限标识:</span>
              <span class="value">{{ selectedPermission }}</span>
            </div>
            <div class="detail-item">
              <span class="label">权限类型:</span>
              <XyTag type="primary">按钮权限</XyTag>
            </div>
            <div class="detail-item">
              <span class="label">启用状态:</span>
              <XySwitch :model-value="true" />
            </div>
          </XySpace>
        </div>
        <div v-else class="no-selection">
          <XyIcon icon="mdi:information-outline" :size="48" />
          <p>请选择权限节点查看详情</p>
        </div>
      </XyCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.permission-management {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-left {
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px;
        }
        
        .page-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      }
    }
  }

  .permission-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    .permission-tree,
    .permission-detail {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tree-node {
        display: flex;
        align-items: center;
        gap: 8px;

        .node-label {
          flex: 1;
        }
      }

      .detail-info {
        padding: 20px;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;

          &:last-child {
            border-bottom: none;
          }

          .label {
            font-weight: 500;
            color: #64748b;
            min-width: 80px;
          }

          .value {
            color: #1e293b;
            font-family: monospace;
          }
        }
      }

      .no-selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: #94a3b8;

        p {
          margin-top: 16px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
