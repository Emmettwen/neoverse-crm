<script setup lang="ts">
  import type { Order } from '@/utils/interface'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/store/app.ts'
  import api from '@/utils/api'
  import { copyText, getImageUrl, message } from '@/utils/helper'
  import { useTableServer } from '@/utils/hooks'
  import request from '@/utils/request'
  import dayjs from "dayjs";

  const store = useAppStore()
  const { t } = useI18n()
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
  } = useTableServer<Order>('order', ['product', 'paymentPic', 'customer', 'keys'])
  const headers = computed(() => [
    { title: t('order.orderNumber'), key: 'documentId', sortable: false },
    { title: t('order.product'), key: 'product.name', sortable: false },
    { title: t('order.customer'), key: 'customer.username', sortable: false },
    { title: t('order.status'), key: 'orderStatus', sortable: false },
    { title: t('product.qty'), key: 'qty', sortable: false },
    { title: t('checkout.total'), key: 'total', sortable: false },
    { title: t('product.duration'), key: 'duration', sortable: false },
    { title: '收益', key: 'group', sortable: false },
    { title: t('order.date'), key: 'createdAt' },
    { title: t('product.actions'), key: 'actions', align: 'end', sortable: false },
  ] as const)

  const dialog = ref(false)
  const groupDialog = ref(false)
  const serverDialog = ref(false)
  const groupItems = ref([
    { title: '4%', value: '00' },
    { title: '5%', value: '01' },
    { title: '7%', value: '02' },
    { title: '12%', value: '03' },
  ])
  const groupId = ref('00')
  const target = ref('')
  const serverTarget = ref()
  const name = ref()
  const server = ref()
  const account = ref()
  const sortBy = ref([{ key: 'createdAt', order: 'desc' }])

  const chooseRate = (documentId: string) => {
    target.value = documentId
    groupDialog.value = true
  }

  const approveOrder = () => {
    if (confirm(t('order.confirmMessage', { id: target.value }))) {
      request({
        ...api.order.approve(target.value),
        data: {
          rate: groupId.value,
        },
      }).then(res => {
        message.success(t('checkout.approve'))
        loadItems()
        groupDialog.value = false
      })
    }
  }
  const onClickServerInformation = item => {
    serverTarget.value = item
    name.value = item.brokerName
    server.value = item.brokerServer
    account.value = item.transactionAccount
    serverDialog.value = true
  }
  const updateServerInformation = () => {
    request({
      ...api.order.update(serverTarget.value.documentId),
      data: {
        data: {
          brokerName: name.value,
          brokerServer: server.value,
          transactionAccount: account.value,
        },
      },
    }).then(res => {
      message.success('更新成功！')
      serverDialog.value = false
      loadItems()
    })
  }

  const confirmationTarget = ref<Order>(null)
  const groupRate = group => {
    switch (group) {
      case 'g00': {
        return '4%'
      }
      case 'g01': {
        return '5%'
      }
      case 'g02': {
        return '7%'
      }
      case 'g03': {
        return '12%'
      }
      default: {
        return '5%'
      }
    }
  }

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
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      show-expand
      @update:options="loadItems"
    >
      <template #[`item.code`]="{ item }">
        <div class="d-flex align-center">
          <span
            class="d-inline-block text-truncate"
            style="max-width: 120px"
          >{{ item.code }}</span>
          <v-btn
            icon="mdi-content-copy"
            size="small"
            variant="text"
            @click="copyText(item.code)"
          />
        </div>
      </template>
      <template #[`item.group`]="{ value }">
        {{ groupRate(value) }}
      </template>
      <template #[`item.customer`]="{value}">
        {{ value ? value.name : '' }}
      </template>
      <template #[`item.createdAt`]="{ value }">
        {{ dayjs(value).format('YYYY-MM-DD HH:MM:ss').toString() }}
      </template>
      <template #[`item.actions`]="{item}">
        <v-tooltip interactive location="top">
          <template #activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="showImage(item)"
            />
          </template>
          <div>
            支付凭证
          </div>
        </v-tooltip>
        <v-btn
          v-if="item.orderStatus === 'pending'"
          icon="mdi-check"
          size="small"
          variant="text"
          @click="chooseRate(item.documentId)"
        />
      </template>
      <template #expanded-row="{ columns, item }">
        <tr>
          <td class="py-2" :colspan="columns.length">
            <v-sheet border class="pa-2">
              <KeyList v-if="item.keys.length > 0" v-model="item.documentId" />
              <KeySingle v-else v-model="item.documentId" />
            </v-sheet>
          </td>
        </tr>
      </template>
    </v-data-table-server>
    <v-dialog
      v-model="dialog"
      persistent
      width="500px"
    >
      <v-card>
        <v-card-title>{{ t('order.receipt') }}</v-card-title>
        <v-card-text>
          <v-img :src="getImageUrl(confirmationTarget?.paymentPic)" />
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="dialog = false">{{ t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="groupDialog"
      persistent
      width="500px"
    >
      <v-card>
        <v-card-title>选择收益比例</v-card-title>
        <v-card-text>
          <v-select
            v-model="groupId"
            :items="groupItems"
            label="收益比例"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="groupDialog = false">{{ t('cancel') }}</v-btn>
          <v-btn @click="approveOrder">{{ t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="serverDialog"
      persistent
      width="500px"
    >
      <v-card>
        <v-card-title>已绑定信息</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="name"
              density="compact"
              label="Broker Name"
            />
            <v-text-field
              v-model="server"
              density="compact"
              label="Broker Server"
            />
            <v-text-field
              v-model="account"
              density="compact"
              label="Transaction Account"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="serverDialog = false">{{ t('close') }}</v-btn>
          <v-btn color="primary" @click="updateServerInformation">{{ t('save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>

</style>
