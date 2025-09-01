<script setup lang="ts">
  import type { Location, Order } from '@/utils/interface'
  import ct from 'i18n-iso-countries'
  import zhCt from 'i18n-iso-countries/langs/zh.json'
  import { onMounted, reactive, ref } from 'vue'
  import OrderStatus from '@/components/base/OrderStatus.vue'
  import router from '@/router'
  import { useAppStore } from '@/store/app'
  import api from '@/utils/api'
  import { copyText, getImageUrl, message } from '@/utils/helper'
  import { useTableServer } from '@/utils/hooks'
  import request from '@/utils/request'

  ct.registerLocale(zhCt)

  defineOptions({
    name: 'OrderList',
  })
  const {
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
  } = useTableServer<Order>('order', ['product', 'paymentPic'])
  const headers = ref([
    { title: 'Order Number', key: 'documentId' },
    { title: 'Product', key: 'product.name' },
    { title: 'Status', key: 'orderStatus' },
    { title: 'Machine Code', key: 'code' },
    { title: 'Qty', key: 'qty' },
    { title: 'Total', key: 'total' },
    { title: 'Duration', key: 'duration' },
    { title: '操作', key: 'actions', align: 'end' },
  ] as const)

  const selected = ref()
  const dialog = ref(false)

  const approveOrder = (documentId: string) => {
    if (confirm('确认通过并发放订单：' + documentId + '的密钥吗？')) {
      request({
        ...api.order.approve(documentId),
      }).then(res => {
        message.success('审批成功')
        loadItems()
      })
    }
  }

  const confirmationTarget = ref<Order>(null)

  const showImage = (target: Order) => {
    confirmationTarget.value = target
    dialog.value = true
  }

</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <v-spacer />
    </v-card-title>
    <v-divider />
    <v-data-table-server
      v-model:items-per-page="pageSize"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    >
      <template #[`item.code`]="{value}">
        <span
          class="d-inline-block text-truncate"
          style="max-width: 120px"
        >{{ value }}</span>
        <v-btn
          icon="mdi-content-copy"
          size="small"
          variant="text"
          @click="copyText(value)"
        />
      </template>
      <template #[`item.customer`]="{value}">
        {{ value ? value.name : '' }}
      </template>
      <template #[`item.actions`]="{item}">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="showImage(item)"
        />
        <v-btn
          v-if="item.orderStatus === 'pending'"
          icon="mdi-check"
          size="small"
          variant="text"
          @click="approveOrder(item.documentId)"
        />
      </template>
    </v-data-table-server>
    <v-dialog
      v-model="dialog"
      width="500px"
      persistent
    >
      <v-card>
        <v-card-title>支付凭证</v-card-title>
        <v-card-text>
          <v-img :src="getImageUrl(confirmationTarget?.paymentPic)" />
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="dialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>

</style>
