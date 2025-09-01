<script setup lang="ts">
  import type { Order } from '@/utils/interface'
  import ct from 'i18n-iso-countries'
  import zhCt from 'i18n-iso-countries/langs/zh.json'
  import { computed, ref } from 'vue'

  import CustomerForm from '@/components/Customer/CustomerForm.vue'
  import { useAppStore } from '@/store/app'
  import api from '@/utils/api'
  import { message } from '@/utils/helper'
  import request from '@/utils/request'

  ct.registerLocale(zhCt)
  const store = useAppStore()
  const emit = defineEmits(['reload-orders'])

  const dialog = ref(false)
  const dialog_customer = ref(false)
  const mode = ref('create')
  const model = ref()
  const isLoading = ref(false)
  const searchResult = ref([])
  const searchTimer = ref()
  const binding = ref(false)

  const searchCustomer = (val: string) => {
    isLoading.value = true
    const params = {
      filters: {
        name: {
          $contains: val,
        },
      },
      pagination: {
        page: 1,
        pageSize: 10,
      },
    }
    request({
      ...api.customer.list,
      params,
    }).then(res => {
      searchResult.value = res.data
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      isLoading.value = false
    })
  }

  const props = defineProps<{
    order: Order
  }>()

  const addNewCustomer = () => {
    mode.value = 'create'
    dialog_customer.value = true
  }

  const customer = computed(() => {
    return props.order.customer
  })

  const onSearch = function (newSearch: string) {
    if (!newSearch) return
    if (model.value?.name === newSearch) return
    if (isLoading.value) return
    searchTimer.value = Date.now()
    setTimeout(() => {
      if (Date.now() - searchTimer.value >= 500) {
        searchCustomer(newSearch)
      }
    }, 500)
  }

  const bindOrderCustomer = function () {
    binding.value = true
    request({
      ...api.order.update(props.order.documentId),
      data: {
        data: {
          customer: model.value?.documentId,
        },
      },
    }).then(() => {
      binding.value = false
      dialog.value = false
      emit('reload-orders')
      message.success('绑定成功')
    })
  }

</script>

<template>
  <v-card
    elevation="3"
    prepend-icon="mdi-account"
    title="客户信息"
  >
    <template v-if="customer" #append>
      <v-btn icon="mdi-pencil" size="small" variant="text" />
    </template>
    <template v-if="!customer" #subtitle>
      订单<b>{{ props.order.name }} </b>还没有关联公司
    </template>
    <v-card-text>
      <v-table v-if="customer" density="comfortable">
        <tbody>
          <tr>
            <td>客户名称</td>
            <td>{{ customer.name }}</td>
          </tr>
          <tr>
            <td>国家</td>
            <td>{{ ct.getName(customer.address?.country || 'RU', 'zh') }}</td>
          </tr>
          <tr>
            <td>市</td>
            <td>{{ customer.address?.city || '' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions v-if="!customer">
      <v-dialog v-model="dialog" max-width="500">
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            block
            color="primary"
            variant="tonal"
          >
            添加关联客户
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="title">关联公司</span>
              <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
            </v-card-title>
            <v-card-text>
              <customer-form
                ref="company_dialog"
                v-model="dialog_customer"
                :cus="customer"
                :mode="mode"
              />
              <v-autocomplete
                v-model="model"
                item-title="name"
                autocomplete="off"
                item-value="documentId"
                :items="searchResult"
                label="搜索客户"
                :loading="isLoading"
                placeholder="输入名称"
                prepend-icon="mdi-magnify"
                return-object
                @update:search="onSearch"
              >
                <template #append-item>
                  <v-divider class="mb-2" />
                  <v-list-item
                    density="compact"
                    prepend-icon="mdi-plus"
                    title="创建客户"
                    @click="addNewCustomer"
                  />
                </template>
              </v-autocomplete>

            </v-card-text>
            <v-card-actions
              v-if="model"
            >
              <v-spacer />
              <v-btn
                color="error"
                :disabled="!model"
                @click="model = null"
              >
                清空
              </v-btn>
              <v-btn
                v-if="mode==='create'"
                color="primary"
                :disabled="binding"
                :loading="binding"
                @click="bindOrderCustomer"
              >
                确定
              </v-btn>
              <v-btn
                v-if="mode === 'update'"
                color="primary"
                :disabled="binding"
                :loading="binding"
                @click="bindOrderCustomer"
              >
                修改
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </v-card>

</template>

<style scoped>

</style>
