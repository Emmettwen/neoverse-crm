<script setup lang="ts">
  import type { Order } from '@/utils/interface'
  import dayjs from 'dayjs'
  import timezone from 'dayjs/plugin/timezone'
  import utc from 'dayjs/plugin/utc'
  import ct from 'i18n-iso-countries'
  import zhCt from 'i18n-iso-countries/langs/zh.json'
  import { computed, ref } from 'vue'
  import 'dayjs/locale/zh-cn'

  ct.registerLocale(zhCt)

  dayjs.extend(utc)
  dayjs.extend(timezone)

  const props = defineProps<{
    order: Order
  }>()

  const createDate = computed(() => {
    return dayjs(props.order.createdAt).tz('Asia/Shanghai').format('DD/MM/YYYY HH:mm:ss')
  })
</script>

<template>
  <v-card
    elevation="3"
    prepend-icon="mdi-format-list-text"
    :title="'订单号： #' + order.id"
  >
    <v-card-text>
      <v-table density="comfortable">
        <tbody>
          <tr>
            <td>创建时间</td>
            <td>{{ createDate }}</td>
          </tr>
          <tr>
            <td>创建人员</td>
            <td>{{ props.order.sales.username }}</td>
          </tr>
          <tr>
            <td>目标地点</td>
            <td>{{
              ct.getName(order.destination?.country || '', 'zh') + ' ' + props.order.destination?.city
            }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
