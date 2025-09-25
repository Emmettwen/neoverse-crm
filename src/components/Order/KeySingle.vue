<script setup lang="ts">
  import type { Order } from '@/utils/interface.ts'
  import dayjs from 'dayjs'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/store/app.ts'
  import api from '@/utils/api.ts'
  import { message } from '@/utils/helper.ts'
  import request from '@/utils/request.ts'

  const store = useAppStore()
  const model = defineModel({ type: String, default: '' })
  const { t } = useI18n()
  const name = ref()
  const server = ref()
  const account = ref()
  const order = ref<Order>()

  const submitBinding = () => {
    if (store.isAdmin) {
      request({
        ...api.order.update(model.value),
        data: {
          data: {
            brokerName: name.value,
            brokerServer: server.value,
            transactionAccount: account.value,
          },
        },
      }).then(res => {
        message.success('更新成功！')
        loadItem()
      })
    } else {
      request({
        ...api.order.bind(model.value),
        data: {
          brokerName: name.value,
          brokerServer: server.value,
          transactionAccount: account.value,
        },
      }).then(() => {
        message.success(t('success.bind'))
        loadItem()
      })
    }
  }
  const unbind = (documentId: string) => {
    if (confirm('确认解绑？')) {
      if (store.isAdmin) {
        request({
          ...api.order.unbind(documentId),
        }).then(() => {
          message.success(t('success.unbind'))
          loadItem()
        })
      } else {
        request({
          ...api.order.customerUnbind(documentId),
        }).then(() => {
          message.success(t('success.unbind'))
          loadItem()
        })
      }
    }
  }

  onMounted(async () => {
    await loadItem()
  })

  const loadItem = async () => {
    const item = await request({
      ...api.order.find(model.value),
    })
    order.value = item.data
    name.value = item.data.brokerName
    server.value = item.data.brokerServer
    account.value = item.data.transactionAccount
  }
</script>

<template>
  <v-row align="center">
    <v-col cols="12" sm="2">
      <v-text-field
        v-model="name"
        density="compact"
        hide-details
        label="Broker Name"
      />
    </v-col>
    <v-col cols="12" sm="2">
      <v-text-field
        v-model="server"
        density="compact"
        hide-details
        label="Broker Server"
      />
    </v-col>
    <v-col cols="12" sm="2">
      <v-text-field
        v-model="account"
        density="compact"
        hide-details
        label="Transaction Account"
      />
    </v-col>
    <v-col cols="12" sm="2">
      {{ dayjs(order?.endDate, "YYYYMMDD").format('YYYY-MM-DD').toString() }} 到期
    </v-col>
    <v-col cols="12" sm="2">
      {{ order?.orderStatus }}
    </v-col>
    <v-col cols="12" sm="2">
      <v-btn
        color="primary"
        size="small"
        :text="t('submit')"
        @click="submitBinding"
      />
      <v-btn
        class="ml-1"
        color="primary"
        size="small"
        :text="t('unbind')"
        @click="unbind"
      />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
