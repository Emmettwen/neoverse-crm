<script setup lang="ts">
  import type { Key } from '@/utils/interface.ts'
  import dayjs from 'dayjs'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/store/app.ts'
  import api from '@/utils/api.ts'
  import { copyText, message } from '@/utils/helper.ts'
  import { useTableServer } from '@/utils/hooks.ts'
  import request from '@/utils/request.ts'

  const { t } = useI18n()
  const store = useAppStore()
  const model = defineModel({ type: String, default: '' })
  const name = ref()
  const server = ref()
  const account = ref()
  const serverDialog = ref(false)
  const serverTarget = ref()
  const filters = ref({
    order: {
      documentId: { $eq: model.value },
    },
  })
  const {
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
    currentPage,
  } = useTableServer<Key>('key', ['order'], filters)
  const headers = computed(() => [
    { title: t('order.machineCode'), key: 'code', sortable: false },
    { title: t('product.duration'), key: 'duration', sortable: false },
    { title: 'Broker Name', key: 'brokerName', sortable: false },
    { title: 'Broker Server', key: 'brokerServer', sortable: false },
    { title: 'Transaction Account', key: 'transactionAccount', sortable: false },
    { title: 'End Date', key: 'endDate', sortable: false },
    { title: t('order.status'), key: 'binded', sortable: false },
    { title: t('product.actions'), key: 'actions', align: 'end', sortable: false },
  ] as const)

  const canUnbind = (status: string) => {
    if (store.isAdmin) {
      if (status === 'used' || status === 'unbinding') {
        return true
      }
    } else {
      if (status === 'used') {
        return true
      }
    }
  }
  const onClickServerInformation = (item: Key) => {
    serverTarget.value = item
    name.value = item.brokerName
    server.value = item.brokerServer
    account.value = item.transactionAccount
    serverDialog.value = true
  }
  const submitBinding = () => {
    if (store.isAdmin) {
      request({
        ...api.key.update(serverTarget.value.documentId),
        data: {
          data: {
            brokerName: name.value,
            brokerServer: server.value,
            transactionAccount: account.value,
            binded: 'used',
          },
        },
      }).then(res => {
        message.success('更新成功！')
        serverDialog.value = false
        loadItems()
      })
    } else {
      request({
        ...api.key.bind(serverTarget.value.documentId),
        data: {
          brokerName: name.value,
          brokerServer: server.value,
          transactionAccount: account.value,
        },
      }).then(() => {
        message.success(t('success.bind'))
        serverDialog.value = false
        loadItems()
      })
    }
  }
  const unbind = (documentId: string) => {
    if (confirm('确认解绑？')) {
      if (store.isAdmin) {
        request({
          ...api.key.unbind(documentId),
        }).then(() => {
          message.success(t('success.unbind'))
          loadItems()
        })
      } else {
        request({
          ...api.key.customerUnbind(documentId),
        }).then(() => {
          message.success(t('success.unbind'))
          loadItems()
        })
      }
    }
  }
  const keyStatus = (status: string) => {
    if (status) {
      if (status === 'used') return '已绑定'
      else if (status === 'unbinding') return '解绑中'
      else return '已解绑'
    } else {
      return '未绑定'
    }
  }
</script>

<template>
  <v-data-table-server
    v-model:items-per-page="pageSize"
    v-model:page="currentPage"
    :headers="headers"
    hide-default-footer
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    @update:options="loadItems"
  >
    <template #[`item.code`]="{ item }">
      <div class="d-flex align-center">
        <span
          class="d-inline-block text-truncate"
          style="max-width: 150px"
        >{{ item.code }}</span>
        <v-btn
          icon="mdi-content-copy"
          size="small"
          variant="text"
          @click="copyText(item.code)"
        />
      </div>
    </template>
    <template #[`item.endDate`]="{ value }">
      {{ dayjs(value, "YYYYMMDD").format('YYYY-MM-DD').toString() }}
    </template>
    <template #[`item.binded`]="{ value }">
      {{ keyStatus(value) }}
    </template>
    <template #[`item.actions`]="{item}">
      <v-tooltip interactive location="top">
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            icon="mdi-server-network"
            size="small"
            variant="text"
            @click="onClickServerInformation(item)"
          />
        </template>
        <div>
          绑定信息
        </div>
      </v-tooltip>
      <v-tooltip v-if="canUnbind(item.binded)" interactive location="top">
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            icon="mdi-robot-off-outline"
            size="small"
            variant="text"
            @click="unbind(item.documentId)"
          />
        </template>
        <div>
          解除绑定
        </div>
      </v-tooltip>
    </template>
  </v-data-table-server>
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
        <v-btn color="primary" @click="submitBinding">{{ t('submit') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
