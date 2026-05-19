<script setup lang="ts">
import { ref, computed } from 'vue'
import { XyCard, XyTable, XyTableColumn, XyTag, XyButton, XyInput, XySelect, XySpace, XyBadge, XyDrawer, XyDescriptions, XyDescriptionsItem, XyTimeline, XyTimelineItem, XyMessage } from 'xiaoye-components'

const searchText = ref('')
const orderStatus = ref('')
const currentOrder = ref<any>(null)
const showDetail = ref(false)

const orderList = ref([
  { id: 'ORD202401150001', customer: '张三', phone: '138****5678', product: 'iPhone 15 Pro Max', quantity: 1, amount: 9999, status: 'completed', payment: 'wechat', createTime: '2024-01-15 10:30:25', address: '北京市朝阳区建国路88号' },
  { id: 'ORD202401150002', customer: '李四', phone: '139****8765', product: 'MacBook Pro 14"', quantity: 1, amount: 15999, status: 'pending', payment: 'alipay', createTime: '2024-01-15 11:15:42', address: '上海市浦东新区世纪大道1000号' },
  { id: 'ORD202401150003', customer: '王五', phone: '137****2345', product: 'AirPods Pro 2', quantity: 2, amount: 3798, status: 'processing', payment: 'card', createTime: '2024-01-15 12:20:18', address: '广州市天河区珠江新城' },
  { id: 'ORD202401150004', customer: '赵六', phone: '136****9876', product: 'iPad Air 5', quantity: 1, amount: 4799, status: 'shipped', payment: 'wechat', createTime: '2024-01-15 13:45:33', address: '深圳市南山区科技园' },
  { id: 'ORD202401150005', customer: '钱七', phone: '135****1234', product: 'Apple Watch S9', quantity: 1, amount: 3299, status: 'completed', payment: 'alipay', createTime: '2024-01-15 14:30:55', address: '杭州市西湖区文三路' },
  { id: 'ORD202401150006', customer: '孙八', phone: '134****5678', product: 'iPhone 15', quantity: 1, amount: 5999, status: 'cancelled', payment: 'card', createTime: '2024-01-15 15:10:12', address: '成都市高新区天府大道' },
  { id: 'ORD202401150007', customer: '周九', phone: '133****9012', product: 'MacBook Air M3', quantity: 1, amount: 10999, status: 'refund', payment: 'wechat', createTime: '2024-01-15 16:25:40', address: '南京市玄武区中山路' },
  { id: 'ORD202401150008', customer: '吴十', phone: '132****3456', product: 'AirPods Max', quantity: 1, amount: 4399, status: 'pending', payment: 'alipay', createTime: '2024-01-15 17:50:28', address: '武汉市洪山区珞喻路' }
])

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待支付', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '退款中', value: 'refund' }
]

const filteredOrders = computed(() => {
  let result = orderList.value
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword) ||
      order.phone.includes(keyword)
    )
  }
  if (orderStatus.value) {
    result = result.filter(order => order.status === orderStatus.value)
  }
  return result
})

const statusMap: Record<string, { text: string; type: string; badge: string }> = {
  pending: { text: '待支付', type: 'warning', badge: 'warning' },
  processing: { text: '处理中', type: 'primary', badge: 'primary' },
  shipped: { text: '已发货', type: 'info', badge: 'processing' },
  completed: { text: '已完成', type: 'success', badge: 'success' },
  cancelled: { text: '已取消', type: 'default', badge: 'default' },
  refund: { text: '退款中', type: 'danger', badge: 'danger' }
}

const paymentMap: Record<string, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  card: '银行卡'
}

function getStatusTag(status: string) {
  return statusMap[status] || { text: status, type: 'default' }
}

function viewDetail(order: any) {
  currentOrder.value = order
  showDetail.value = true
}

function handleProcess(order: any) {
  XyMessage.success(`订单 ${order.id} 已开始处理`)
}

function handleShip(order: any) {
  XyMessage.success(`订单 ${order.id} 已发货`)
}

function handleExport() {
  XyMessage.success('订单数据导出成功')
}
</script>

<template>
  <div class="order-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">订单管理</h2>
          <p class="page-desc">管理所有订单，支持订单查询、状态更新、导出等操作</p>
        </div>
        <div class="header-right">
          <XySpace>
            <XyInput
              v-model="searchText"
              placeholder="搜索订单号/客户/手机号"
              :prefix-icon="'mdi:magnify'"
              clearable
              style="width: 240px"
            />
            <XySelect v-model="orderStatus" :options="statusOptions" placeholder="订单状态" style="width: 120px" />
            <XyButton @click="handleExport">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              导出
            </XyButton>
          </XySpace>
        </div>
      </div>
      
      <div class="order-stats">
        <div class="stat-item">
          <XyBadge :value="orderList.filter(o => o.status === 'pending').length" type="warning">
            <div class="stat-content">
              <span class="stat-label">待支付</span>
            </div>
          </XyBadge>
        </div>
        <div class="stat-item">
          <XyBadge :value="orderList.filter(o => o.status === 'processing').length" type="primary">
            <div class="stat-content">
              <span class="stat-label">处理中</span>
            </div>
          </XyBadge>
        </div>
        <div class="stat-item">
          <XyBadge :value="orderList.filter(o => o.status === 'shipped').length" type="info">
            <div class="stat-content">
              <span class="stat-label">已发货</span>
            </div>
          </XyBadge>
        </div>
        <div class="stat-item">
          <XyBadge :value="orderList.filter(o => o.status === 'completed').length" type="success">
            <div class="stat-content">
              <span class="stat-label">已完成</span>
            </div>
          </XyBadge>
        </div>
        <div class="stat-item">
          <XyBadge :value="orderList.filter(o => o.status === 'refund').length" type="danger">
            <div class="stat-content">
              <span class="stat-label">退款中</span>
            </div>
          </XyBadge>
        </div>
      </div>
    </XyCard>
    
    <XyCard>
      <XyTable :data="filteredOrders" stripe>
        <XyTableColumn prop="id" label="订单编号" width="180" />
        <XyTableColumn prop="customer" label="客户信息">
          <template #default="{ row }">
            <div class="customer-info">
              <span class="customer-name">{{ row.customer }}</span>
              <span class="customer-phone">{{ row.phone }}</span>
            </div>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="product" label="商品信息">
          <template #default="{ row }">
            <div class="product-info">
              <span class="product-name">{{ row.product }}</span>
              <span class="product-quantity">x{{ row.quantity }}</span>
            </div>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="amount" label="订单金额" width="120" />
        <XyTableColumn prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <XyTag :type="getStatusTag(row.status).type">
              {{ getStatusTag(row.status).text }}
            </XyTag>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="payment" label="支付方式" width="100">
          <template #default="{ row }">
            <span class="payment-text">{{ paymentMap[row.payment] }}</span>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="createTime" label="下单时间" width="170" />
        <XyTableColumn label="操作" width="150">
          <template #default="{ row }">
            <XySpace>
              <XyButton type="link" size="small" @click="viewDetail(row)">详情</XyButton>
              <XyButton 
                v-if="row.status === 'pending'" 
                type="link" 
                size="small" 
                @click="handleProcess(row)"
              >
                处理
              </XyButton>
              <XyButton 
                v-if="row.status === 'processing'" 
                type="link" 
                size="small" 
                @click="handleShip(row)"
              >
                发货
              </XyButton>
            </XySpace>
          </template>
        </XyTableColumn>
      </XyTable>
    </XyCard>
    
    <XyDrawer v-model="showDetail" title="订单详情" :size="600">
      <template v-if="currentOrder">
        <XyDescriptions :column="2" border>
          <XyDescriptionsItem label="订单编号">{{ currentOrder.id }}</XyDescriptionsItem>
          <XyDescriptionsItem label="订单状态">
            <XyTag :type="getStatusTag(currentOrder.status).type">
              {{ getStatusTag(currentOrder.status).text }}
            </XyTag>
          </XyDescriptionsItem>
          <XyDescriptionsItem label="客户姓名">{{ currentOrder.customer }}</XyDescriptionsItem>
          <XyDescriptionsItem label="联系电话">{{ currentOrder.phone }}</XyDescriptionsItem>
          <XyDescriptionsItem label="收货地址" :span="2">{{ currentOrder.address }}</XyDescriptionsItem>
          <XyDescriptionsItem label="商品名称">{{ currentOrder.product }}</XyDescriptionsItem>
          <XyDescriptionsItem label="购买数量">{{ currentOrder.quantity }}</XyDescriptionsItem>
          <XyDescriptionsItem label="订单金额">
            <strong style="color: #ef4444;">¥{{ currentOrder.amount.toLocaleString() }}</strong>
          </XyDescriptionsItem>
          <XyDescriptionsItem label="支付方式">{{ paymentMap[currentOrder.payment] }}</XyDescriptionsItem>
          <XyDescriptionsItem label="下单时间" :span="2">{{ currentOrder.createTime }}</XyDescriptionsItem>
        </XyDescriptions>
        
        <div class="order-timeline">
          <h4>订单追踪</h4>
          <XyTimeline>
            <XyTimelineItem title="订单创建" :timestamp="currentOrder.createTime">
              订单已创建，等待买家付款
            </XyTimelineItem>
            <XyTimelineItem 
              v-if="['processing', 'shipped', 'completed'].includes(currentOrder.status)" 
              title="支付成功" 
              icon="mdi:check-circle"
            >
              买家已成功支付订单
            </XyTimelineItem>
            <XyTimelineItem 
              v-if="['shipped', 'completed'].includes(currentOrder.status)" 
              title="商品发货"
              icon="mdi:truck"
            >
              商品已从仓库发出，正在配送途中
            </XyTimelineItem>
            <XyTimelineItem 
              v-if="currentOrder.status === 'completed'" 
              title="确认收货"
              icon="mdi:package-variant"
            >
              买家已确认收货，订单完成
            </XyTimelineItem>
          </XyTimeline>
        </div>
      </template>
    </XyDrawer>
  </div>
</template>

<style lang="scss" scoped>
.order-management {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      
      .header-left {
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0 0 4px;
          transition: color 0.3s ease;
        }
        
        .page-desc {
          font-size: 14px;
          color: var(--admin-text-secondary);
          margin: 0;
          transition: color 0.3s ease;
        }
      }
    }
    
    .order-stats {
      display: flex;
      gap: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--admin-border);
      transition: border-color 0.3s ease;
      
      .stat-item {
        .stat-content {
          padding: 8px 16px;
          background: var(--xy-table-row-striped-background);
          border-radius: 6px;
          transition: background 0.3s ease;
          
          .stat-label {
            font-size: 14px;
            color: var(--admin-text-secondary);
            transition: color 0.3s ease;
          }
        }
      }
    }
  }
  
  .customer-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .customer-name {
      font-weight: 500;
      color: var(--admin-text);
      transition: color 0.3s ease;
    }
    
    .customer-phone {
      font-size: 12px;
      color: var(--admin-text-muted);
      transition: color 0.3s ease;
    }
  }
  
  .product-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .product-name {
      color: var(--admin-text);
      transition: color 0.3s ease;
    }
    
    .product-quantity {
      font-size: 12px;
      color: var(--admin-text-muted);
      transition: color 0.3s ease;
    }
  }
  
  .amount {
    font-weight: 600;
    color: #ef4444;
  }
  
  .payment-text {
    color: var(--admin-text-secondary);
    transition: color 0.3s ease;
  }
  
  .order-timeline {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--admin-border);
    transition: border-color 0.3s ease;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: var(--admin-text);
      margin: 0 0 16px;
      transition: color 0.3s ease;
    }
  }
}
</style>
