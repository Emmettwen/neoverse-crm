<script setup lang="ts">

  import type { Car, OrderItem } from '@/utils/interface'
  import _ from 'lodash'
  import { computed, ref } from 'vue'
  import { useAppStore } from '@/store/app'
  import api from '@/utils/api'
  import { getOrderStatus, message } from '@/utils/helper'
  import { useTableServer } from '@/utils/hooks'
  import request from '@/utils/request'

  const store = useAppStore()

  const props = defineProps<{
    orderId: string
    orderStatus: string
  }>()
  const emit = defineEmits(['reload-orders'])
  const filters = computed(() => {
    return { order: { documentId: props.orderId } }
  })
  const {
    items,
    pageSize,
    loading,
    totalItems,
    loadItems,
  } = useTableServer<OrderItem>('orderDetail', ['car', 'car.model', 'car.model.make'], filters)
  const headers = ref([
    { title: '品牌', key: 'make', sortable: false },
    { title: '年份', key: 'year', sortable: false },
    { title: '型号', key: 'model', sortable: false },
    { title: '版本', key: 'version', sortable: false },
    { title: '建议零售价', key: 'msrp', sortable: false },
    { title: '数量', key: 'amount', sortable: false, align: 'center' },
    { title: '操作', key: 'actions', sortable: false, align: 'end' },
  ] as const)
  const car_dialog = ref(false)
  const carItem = ref()
  const searchResult = ref([])
  const searchTimer = ref()
  const isLoading = ref(false)
  const pending = ref(false)

  const carDisplayName = computed(() => {
    return (item: Car) => `${item.trim.model.make.name} ${item.trim.model.name} ${item.year}`
  })

  const searchCars = (val: string) => {
    isLoading.value = true
    const params = {
      filters: {
        $or: [
          {
            model: {
              name: {
                $contains: val,
              },
            },
          }, {
            name: {
              $contains: val,
            },
          }, {
            model: {
              make: {
                name: {
                  $contains: val,
                },
              },
            },
          },
        ],
      },
      pagination: {
        page: 1,
        pageSize: 10,
      },
      populate: ['model', 'model.make', 'image'],
    }
    request({
      ...api.car.list,
      params,
    }).then(res => {
      searchResult.value = res.data
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      isLoading.value = false
    })
  }

  const onSearch = function (newSearch: string) {
    if (!newSearch) return
    if (newSearch.length === 0) return
    if (carItem.value?.name === newSearch) return
    if (isLoading.value) return
    searchTimer.value = Date.now()
    setTimeout(() => {
      if (Date.now() - searchTimer.value >= 500) {
        searchCars(newSearch)
      }
    }, 500)
  }

  const onSelected = function (val: Car) {
    if (!val) {
      searchResult.value = []
      return
    }
    const orderItem = {
      quantity: 1,
      order: props.orderId,
      price: val.trim.msrp,
      discount: 0,
      total: val.trim.msrp,
      currency: 'USD',
      status: '',
      note: '',
      car: val,
    }
    let canAdd = true
    for (const item of items.value) {
      if (item.car.documentId === val.documentId) {
        canAdd = false
      }
    }
    if (canAdd) {
      // @ts-ignore
      items.value.push(orderItem)
      car_dialog.value = false
      carItem.value = null
    } else {
      message.error('该车型已添加')
    }
  }

  const deleteItem = function (index: number) {
    if (items.value[index].id) {
      request({
        ...api.orderDetail.delete(items.value[index].documentId),
      }).then(res => {
        message.success('删除成功')
        loadItems()
      })
    } else {
      items.value.splice(index, 1)
    }
  }

  const submitDetail = () => {
    console.log(items.value)
    request({
      // @ts-ignore
      ...api.order.details(props.orderId),
      data: {
        items: items.value,
      },
    }).then(res => {
      message.success('提交成功')
      loadItems()
      emit('reload-orders')
    })
  }
  const status = computed(() => {
    return getOrderStatus(props.orderStatus)
  })
</script>

<template>
  <v-card class="mt-6" flat>
    <v-card-title class="d-flex">
      订单车辆明细
    </v-card-title>
    <v-confirm-edit
      v-model="items"
      ok-text="提交审核"
      @save="submitDetail"
    >
      <template #default="{ isPristine, actions }">
        <v-card-text>
          <v-data-table-server
            v-model:items-per-page="pageSize"
            disable-sort
            :headers="headers"
            hide-default-footer
            :items="items"
            :items-length="totalItems"
            :loading="loading"
          >
            <template #top>
              <div class="d-flex">
                <v-spacer />
                <v-dialog v-model="car_dialog" max-width="800">
                  <template #activator="{props: activatorProps}">
                    <v-btn v-bind="activatorProps" color="info" :disabled="status.level >= 15">
                      添加车型
                    </v-btn>
                  </template>
                  <template #default="{ isActive }">
                    <v-card>
                      <v-card-title class="d-flex justify-space-between align-center">
                        <span class="title">添加车型</span>
                        <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
                      </v-card-title>
                      <v-card-text>
                        <v-autocomplete
                          v-model="carItem"
                          :item-title="carDisplayName"
                          autocomplete="off"
                          item-value="id"
                          :items="searchResult"
                          label="搜索车型"
                          :loading="isLoading"
                          placeholder="输入名称"
                          prepend-icon="mdi-magnify"
                          return-object
                          @update:model-value="onSelected"
                          @update:search="onSearch"
                        />
                      </v-card-text>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </template>
            <template #[`item.make`]="{ item }">
              {{ item.car.trim.model.make.name }}
            </template>

            <template #[`item.year`]="{ item }">
              {{ item.car.year }}
            </template>

            <template #[`item.model`]="{ item }">
              {{ item.car.trim.model.name }}
            </template>

            <template #[`item.version`]="{ item }">
              {{ item.car.trim.name }}
            </template>

            <template #[`item.msrp`]="{ item }">
              ￥{{ item.car.trim.msrp.toLocaleString() }}
            </template>
            <template #[`item.amount`]="{ item }">
              <v-number-input
                class="mx-auto"
                v-model="item.quantity"
                control-variant="stacked"
                density="compact"
                :disabled="status.level >=15"
                hide-details
                max-width="90px"
                variant="outlined"
              />
            </template>
            <template #[`item.actions`]="{ index, item }">
              <v-btn
                :disabled="status.level >=15"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="deleteItem(index)"
              />
              <v-dialog max-width="500">
                <template #activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    icon="mdi-note-alert"
                    size="small"
                    variant="text"
                  />
                </template>
                <template #default="{ isActive }">
                  <v-card>
                    <v-card-title class="d-flex justify-space-between align-center">
                      <span class="title">添加备注</span>
                      <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
                    </v-card-title>
                    <v-card-text>
                      <v-textarea
                        v-model="item.note"
                        clearable
                        :disabled="status.level >=15"
                        label="备注"
                        placeholder="颜色、改装等其他要求"
                        rows="5"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-btn @click="isActive.value = false">确定</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </template>
          </v-data-table-server>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="mr-2"
            color="primary"
            :disabled="isPristine || status.level >= 15"
            @click="submitDetail"
          >
            提交订单
          </v-btn>
          <component :is="actions" v-if="false" />
        </v-card-actions>

      </template>
    </v-confirm-edit>
  </v-card>
</template>

<style scoped>
.v-table :deep(tbody) tr:nth-child(odd) {
    background-color: unset;
}
</style>
