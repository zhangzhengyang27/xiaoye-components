<script setup lang="ts">
import { ref, computed } from 'vue'
import { XyCard, XyTable, XyTag, XyButton, XyInput, XySelect, XyDialog, XyForm, XyFormItem, XyImage, XySpace, XySwitch, XyMessage, XyPopconfirm, XyInputNumber } from 'xiaoye-components'

const searchText = ref('')
const category = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const currentProduct = ref<any>(null)

const categoryOptions = [
  { label: '全部分类', value: '' },
  { label: '手机数码', value: 'phone' },
  { label: '电脑办公', value: 'computer' },
  { label: '平板设备', value: 'tablet' },
  { label: '穿戴设备', value: 'wearable' },
  { label: '音频设备', value: 'audio' },
  { label: '配件周边', value: 'accessory' }
]

const productList = ref([
  { id: 1, name: 'iPhone 15 Pro Max', category: 'phone', price: 9999, originalPrice: 10999, stock: 156, sales: 892, image: 'https://picsum.photos/200', status: true, featured: true, createTime: '2024-01-10' },
  { id: 2, name: 'MacBook Pro 14"', category: 'computer', price: 15999, originalPrice: 16999, stock: 45, sales: 234, image: 'https://picsum.photos/201', status: true, featured: true, createTime: '2024-01-08' },
  { id: 3, name: 'iPad Air 5', category: 'tablet', price: 4799, originalPrice: 4999, stock: 89, sales: 567, image: 'https://picsum.photos/202', status: true, featured: false, createTime: '2024-01-05' },
  { id: 4, name: 'Apple Watch S9', category: 'wearable', price: 3299, originalPrice: 3499, stock: 123, sales: 445, image: 'https://picsum.photos/203', status: true, featured: true, createTime: '2024-01-03' },
  { id: 5, name: 'AirPods Pro 2', category: 'audio', price: 1899, originalPrice: 1999, stock: 234, sales: 1234, image: 'https://picsum.photos/204', status: true, featured: false, createTime: '2024-01-01' },
  { id: 6, name: 'Magic Keyboard', category: 'accessory', price: 999, originalPrice: 999, stock: 0, sales: 156, image: 'https://picsum.photos/205', status: false, featured: false, createTime: '2023-12-28' },
  { id: 7, name: 'iPhone 15', category: 'phone', price: 5999, originalPrice: 6499, stock: 78, sales: 678, image: 'https://picsum.photos/206', status: true, featured: false, createTime: '2023-12-25' },
  { id: 8, name: 'MacBook Air M3', category: 'computer', price: 10999, originalPrice: 11999, stock: 34, sales: 189, image: 'https://picsum.photos/207', status: true, featured: true, createTime: '2023-12-20' }
])

const formData = ref({
  name: '',
  category: 'phone',
  price: 0,
  originalPrice: 0,
  stock: 0,
  status: true,
  featured: false,
  image: ''
})

const filteredProducts = computed(() => {
  let result = productList.value
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword)
    )
  }
  if (category.value) {
    result = result.filter(p => p.category === category.value)
  }
  return result
})

const categoryMap: Record<string, string> = {
  phone: '手机数码',
  computer: '电脑办公',
  tablet: '平板设备',
  wearable: '穿戴设备',
  audio: '音频设备',
  accessory: '配件周边'
}

const tableColumns = [
  { title: '商品信息', key: 'info', slot: 'info', width: 280 },
  { title: '分类', key: 'category', slot: 'category', width: 100 },
  { title: '价格', key: 'price', slot: 'price', width: 140 },
  { title: '库存', key: 'stock', slot: 'stock', width: 100 },
  { title: '销量', key: 'sales', width: 80 },
  { title: '状态', key: 'status', slot: 'status', width: 100 },
  { title: '操作', key: 'action', slot: 'action', width: 180 }
]

function openAddModal() {
  isEdit.value = false
  formData.value = {
    name: '',
    category: 'phone',
    price: 0,
    originalPrice: 0,
    stock: 0,
    status: true,
    featured: false,
    image: 'https://picsum.photos/200'
  }
  showModal.value = true
}

function openEditModal(product: any) {
  isEdit.value = true
  currentProduct.value = product
  formData.value = { ...product }
  showModal.value = true
}

function handleSubmit() {
  if (!formData.value.name || formData.value.price <= 0) {
    XyMessage.error('请填写完整的商品信息')
    return
  }
  
  if (isEdit.value) {
    const index = productList.value.findIndex(p => p.id === currentProduct.value.id)
    if (index !== -1) {
      productList.value[index] = { ...formData.value, id: currentProduct.value.id, sales: currentProduct.value.sales, createTime: currentProduct.value.createTime }
      XyMessage.success('商品更新成功')
    }
  } else {
    productList.value.unshift({
      ...formData.value,
      id: Date.now(),
      sales: 0,
      createTime: new Date().toISOString().split('T')[0]
    })
    XyMessage.success('商品添加成功')
  }
  
  showModal.value = false
}

function handleDelete(id: number) {
  productList.value = productList.value.filter(p => p.id !== id)
  XyMessage.success('商品删除成功')
}

function toggleStatus(product: any) {
  product.status = !product.status
  XyMessage.success(`商品已${product.status ? '上架' : '下架'}`)
}

function toggleFeatured(product: any) {
  product.featured = !product.featured
  XyMessage.success(`商品已${product.featured ? '设置' : '取消'}为精选`)
}
</script>

<template>
  <div class="product-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">商品管理</h2>
          <p class="page-desc">管理商品信息，支持商品上架、下架、编辑等操作</p>
        </div>
        <div class="header-right">
          <XySpace>
            <XyInput
              v-model="searchText"
              placeholder="搜索商品名称"
              :prefix-icon="'mdi:magnify'"
              clearable
              style="width: 200px"
            />
            <XySelect v-model="category" :options="categoryOptions" placeholder="商品分类" style="width: 120px" />
            <XyButton type="primary" @click="openAddModal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              添加商品
            </XyButton>
          </XySpace>
        </div>
      </div>
    </XyCard>
    
    <XyCard>
      <XyTable :columns="tableColumns" :data="filteredProducts" stripe>
        <template #info="{ record }">
          <div class="product-info">
            <XyImage :src="record.image" width="60" height="60" fit="cover" style="border-radius: 8px;" />
            <div class="product-detail">
              <span class="product-name">
                {{ record.name }}
                <XyTag v-if="record.featured" type="warning" size="small">精选</XyTag>
              </span>
              <span class="product-time">创建于 {{ record.createTime }}</span>
            </div>
          </div>
        </template>
        <template #category="{ record }">
          <XyTag type="primary">{{ categoryMap[record.category] }}</XyTag>
        </template>
        <template #price="{ record }">
          <div class="price-info">
            <span class="current-price">¥{{ record.price.toLocaleString() }}</span>
            <span v-if="record.originalPrice > record.price" class="original-price">¥{{ record.originalPrice.toLocaleString() }}</span>
          </div>
        </template>
        <template #stock="{ record }">
          <span :class="record.stock < 20 ? 'stock-low' : ''">
            {{ record.stock }}
            <XyTag v-if="record.stock === 0" type="danger" size="small">缺货</XyTag>
            <XyTag v-else-if="record.stock < 20" type="warning" size="small">库存紧张</XyTag>
          </span>
        </template>
        <template #status="{ record }">
          <XySwitch v-model="record.status" @change="toggleStatus(record)" />
        </template>
        <template #action="{ record }">
          <XySpace>
            <XyButton type="link" size="small" @click="openEditModal(record)">编辑</XyButton>
            <XyButton type="link" size="small" @click="toggleFeatured(record)">
              {{ record.featured ? '取消精选' : '设为精选' }}
            </XyButton>
            <XyPopconfirm title="确定删除该商品?" @confirm="handleDelete(record.id)">
              <XyButton type="link" size="small" danger>删除</XyButton>
            </XyPopconfirm>
          </XySpace>
        </template>
      </XyTable>
    </XyCard>
    
    <XyDialog v-model="showModal" :title="isEdit ? '编辑商品' : '添加商品'" :width="600" @ok="handleSubmit">
      <XyForm :model="formData" :column="2" label-width="100px">
        <XyFormItem label="商品名称" required>
          <XyInput v-model="formData.name" placeholder="请输入商品名称" />
        </XyFormItem>
        <XyFormItem label="商品分类" required>
          <XySelect v-model="formData.category">
            <option v-for="opt in categoryOptions.filter(o => o.value)" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </XySelect>
        </XyFormItem>
        <XyFormItem label="商品价格" required>
          <XyInputNumber v-model="formData.price" :min="0" :precision="2" placeholder="现价" />
        </XyFormItem>
        <XyFormItem label="原价">
          <XyInputNumber v-model="formData.originalPrice" :min="0" :precision="2" placeholder="原价（选填）" />
        </XyFormItem>
        <XyFormItem label="库存数量" required>
          <XyInputNumber v-model="formData.stock" :min="0" :precision="0" placeholder="库存数量" />
        </XyFormItem>
        <XyFormItem label="商品图片">
          <XyInput v-model="formData.image" placeholder="图片URL" />
        </XyFormItem>
        <XyFormItem label="上架状态">
          <XySwitch v-model="formData.status" />
        </XyFormItem>
        <XyFormItem label="精选商品">
          <XySwitch v-model="formData.featured" />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.product-management {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
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
  
  .product-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .product-detail {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .product-name {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 500;
        color: #1e293b;
      }
      
      .product-time {
        font-size: 12px;
        color: #94a3b8;
      }
    }
  }
  
  .price-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .current-price {
      font-weight: 600;
      color: #ef4444;
    }
    
    .original-price {
      font-size: 12px;
      color: #94a3b8;
      text-decoration: line-through;
    }
  }
  
  .stock-low {
    color: #ef4444;
    font-weight: 500;
  }
}
</style>
