<script setup lang="ts">

  import type { Customer, Order, User } from '@/utils/interface'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import OrderStatus from '@/components/base/OrderStatus.vue'
  import ContractTab from '@/components/OrderDetail/ContractTab.vue'

  import CustomerInfo from '@/components/OrderDetail/CustomerInfo.vue'
  import OrderInfo from '@/components/OrderDetail/OrderInfo.vue'
  import OrderItems from '@/components/OrderDetail/OrderItems.vue'
  import TransportationTab from '@/components/OrderDetail/TransportationTab.vue'
  import api from '@/utils/api'

  import { getOrderStatus } from '@/utils/helper'
  import request from '@/utils/request'

  const route = useRoute()

  defineOptions({
    name: 'OrderEdit',
  })
  const edit = ref(false)
  const nameEditing = ref(false)
  const order = reactive<Order>({
    documentId: '',
    name: '',
    sales: {} as User,
    createdAt: '',
    customer: {} as Customer,
    status: '',
  })
  const orderLoaded = ref(false)
  const tab = ref('basic-info')

  onMounted(() => {
    if (route.query.id) {
      edit.value = true
      initialData()
    }
  })

  const updateOrderName = () => {}

  const deleteDeal = () => {}

  const initialData = () => {
    request({
      ...api.order.find(route.query.id as string),
      params: {
        populate: ['sales', 'customer', 'customer.address', 'destination'],
      },
    }).then(res => {
      updateOrder(res.data)
    })
  }
  const updateOrder = (data: Order) => {
    Object.assign(order, data)
    orderLoaded.value = true
  }

  const status = computed(() => {
    return getOrderStatus(order.status)
  })

</script>

<template>
  <v-toolbar color="white" elevation="6" rounded>
    <v-toolbar-title
      v-show="!nameEditing"
      class="headline"
      :text="order.name"
    >
      <v-btn
        v-show="!nameEditing"
        class="ml-2"
        color="grey"
        density="comfortable"
        icon="mdi-pencil"
        size="small"
        variant="text"
        @click="nameEditing = true"
      >
        <v-icon>mdi-pencil</v-icon>
        <v-tooltip
          activator="parent"
          location="bottom"
        >
          修改名称
        </v-tooltip>
      </v-btn>
    </v-toolbar-title>
    <v-text-field
      v-show="nameEditing"
      v-model="order.name"
      class="mx-3"
      density="compact"
      hide-details
      append-icon="mdi-content-save"
      label="名称"
      append-inner-icon="mdi-close-circle"
      max-width="240px"
      type="text"
      @click:append="updateOrderName"
      @click:append-inner="nameEditing = false"
    />
    <v-spacer />
    <OrderStatus v-model="order.status" />
    <v-btn icon="">
      <v-icon>mdi-information-outline</v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
      >
        近期活动
      </v-tooltip>
    </v-btn>
    <v-btn
      icon="mdi-delete"
      @click="deleteDeal"
    >
      <v-icon>mdi-delete</v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
      >
        删除订单
      </v-tooltip>
    </v-btn>
  </v-toolbar>
  <div class="d-flex flex-row mt-4">
    <v-tabs
      v-model="tab"
      color="primary"
      direction="vertical"
    >
      <v-tab prepend-icon="mdi-book-outline" text="基本信息" value="basic-info" />
      <v-tab prepend-icon="mdi-ballot-outline" text="订单详情" value="order-detail" />
      <v-tab prepend-icon="mdi-file-sign" text="合同&采购" value="contract-purchase" />
      <v-tab
        :disabled="status.level < 50"
        prepend-icon="mdi-truck-delivery-outline"
        text="物流运输"
        value="transportation"
      />
      <v-tab
        :disabled="status.level < 30"
        prepend-icon="mdi-file-document-multiple"
        text="材料文件"
        value="docs"
      />
      <v-tab prepend-icon="mdi-list-box-outline" text="详细动态" value="activities" />
    </v-tabs>
    <v-tabs-window v-if="orderLoaded" v-model="tab" class="flex-fill">
      <v-tabs-window-item value="basic-info">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <OrderInfo :order="order" @reload-order="initialData" />
            </v-col>
            <v-col cols="12" md="6">
              <CustomerInfo :order="order" @reload-order="initialData" />
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="order-detail">
        <v-container>
          <OrderItems :order-id="order.documentId" :order-status="order.status" @reload-order="initialData" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="contract-purchase">
        <v-container>
          <ContractTab
            :customer-name="order.customer?.name || '无人'"
            :order-id="order.documentId"
            :order-name="order.name"
            @reload-order="initialData"
          />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="transportation">
        <v-container>
          <TransportationTab />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="docs">
        <v-container />
      </v-tabs-window-item>
      <v-tabs-window-item value="activities">
        <v-container />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<style scoped>

</style>
