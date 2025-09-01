<script setup lang="ts">
  import type { Order } from '@/utils/interface'
  import ct from 'i18n-iso-countries'
  import zhCt from 'i18n-iso-countries/langs/zh.json'
  import { onMounted, ref } from 'vue'
  import api from '@/utils/api'
  import { copyText, message } from '@/utils/helper.ts'
  import { useTableServer } from '@/utils/hooks'
  import request from '@/utils/request.ts'

  ct.registerLocale(zhCt)

  defineOptions({
    name: 'PaymentHistory',
  })
  const name = ref()
  const server = ref()
  const account = ref()
  const expanded = ref([])

  const {
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
  } = useTableServer<Order>('order', ['product'])
  const headers = ref([
    { title: 'Order Number', key: 'documentId' },
    { title: 'Product', key: 'product.name' },
    { title: 'Status', key: 'orderStatus' },
    { title: 'Machine Code', key: 'code' },
    { title: 'Broker Name', key: 'brokerName' },
    { title: 'Broker Server', key: 'brokerServer' },
    { title: 'Transaction Account', key: 'transactionAccount' },
  ] as const)

  const submitBinding = (documentId: string, id: number) => {
    request({
      ...api.order.bind(documentId),
      data: {
        brokerName: name.value,
        brokerServer: server.value,
        transactionAccount: account.value,
      },
    }).then(() => {
      message.success('绑定成功！')
      collapseRow(id)
      loadItems()
    })
  }
  const collapseRow = (id: number) => {
    // 主动收起：把该 id 从 expanded 中移除
    expanded.value = expanded.value.filter(expandedId => expandedId !== id)
  }
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <v-spacer />
    </v-card-title>
    <v-divider />
    <v-data-table-server
      v-model:expanded="expanded"
      v-model:items-per-page="pageSize"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      show-expand
      @update:options="loadItems"
    >
      <template #[`item.code`]="{value}">
        <div v-if="value" class="d-flex align-center">
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
        </div>
      </template>
      <template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand, item }">
        <v-btn
          v-if="item.orderStatus === 'approved'"
          :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          border
          class="text-none"
          color="medium-emphasis"
          size="small"
          slim
          :text="isExpanded(internalItem) ? 'Collapse' : 'Binding'"
          variant="text"
          width="105"
          @click="toggleExpand(internalItem)"
        />
      </template>
      <template #expanded-row="{ columns, item }">
        <tr>
          <td class="py-2" :colspan="columns.length">
            <v-row align="center">
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="name"
                  density="compact"
                  hide-details
                  label="Broker Name"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="server"
                  density="compact"
                  hide-details
                  label="Broker Server"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="account"
                  density="compact"
                  hide-details
                  label="Transaction Account"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  block
                  color="primary"
                  text="Submit"
                  @click="submitBinding(item.documentId, item.id)"
                />
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>
