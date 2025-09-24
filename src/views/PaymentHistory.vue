<script setup lang="ts">
  import type { Order } from '@/utils/interface'
  import dayjs from 'dayjs'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import api from '@/utils/api'
  import { copyText, message } from '@/utils/helper.ts'
  import { useTableServer } from '@/utils/hooks'
  import request from '@/utils/request.ts'

  const { t } = useI18n()

  defineOptions({
    name: 'PaymentHistory',
  })
  const name = ref()
  const server = ref()
  const account = ref()
  const expanded = ref([])
  const sortBy = ref([{ key: 'createdAt', order: 'desc' }])

  const {
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
  } = useTableServer<Order>('order', ['product', 'keys'])
  const headers = computed(() => [
    { title: t('order.orderNumber'), key: 'documentId', sortable: false },
    { title: t('order.product'), key: 'product.name', sortable: false },
    { title: t('order.status'), key: 'orderStatus', sortable: false },
    { title: t('order.machineCode'), key: 'code', sortable: false },
    { title: 'Broker Name', key: 'brokerName', sortable: false },
    { title: 'Broker Server', key: 'brokerServer', sortable: false },
    { title: 'Transaction Account', key: 'transactionAccount', sortable: false },
    { title: t('order.date'), key: 'createdAt' },
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
      message.success(t('success.bind'))
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
      v-model:sort-by="sortBy"
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
      <template #[`item.createdAt`]="{ value }">
        {{ dayjs(value).format('YYYY-MM-DD HH:MM:ss').toString() }}
      </template>
      <template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
        <v-btn
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
            <v-sheet border class="pa-2">
              <KeyList v-if="item.keys?.length > 0" v-model="item.documentId" />
              <KeySingle v-else v-model="item.documentId" />
            </v-sheet>
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>
