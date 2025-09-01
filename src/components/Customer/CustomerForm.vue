<script setup lang="ts">
  import type { Customer } from '@/utils/interface'
  import { computed, onMounted, reactive, ref } from 'vue'
  import api from '@/utils/api'
  import request from '@/utils/request'

  const props = defineProps<{
    mode: string
    cus: Customer
  }>()
  const dialog_customer = defineModel({ type: Boolean, default: false })

  const result = reactive({
    model: null,
    searchResult: [],
    isLoading: false,
  })

  const customer = reactive<Customer>({
    name: '',
    state: '',
    city: '',
    street: '',
    zip: '',
    email: '',
    phone: '',
    type: '',
    status: '',
    note: '',
    documentId: '',
  })

  onMounted(() => {
    loadCustomer()
  })

  const loadCustomer = () => {
    if (props.cus && props.cus.id && props.mode === 'create') {
      request({
        ...api.customer.find(props.cus.id),
      }).then(res => {
        Object.assign(customer, res.data)
        customer.id = props.cus.id
      })
    }
  }

  const closeForm = () => {
    dialog_customer.value = false
  }

  const submitForm = () => {}

  const updateCompany = () => {}

</script>

<template>
  <v-dialog v-model="dialog_customer" max-width="500px" persistent scrollable>
    <v-card>
      <v-card-title>
        <span v-if="mode === 'create'" class="headline">添加新客户</span>
        <span v-if="mode === 'update'" class="headline">编辑客户信息</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="newCompanyForm"
          autocomplete="off"
          autofill="off"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="customer.name" label="客户名称" required />
              <v-text-field
                id="autocomplete"
                v-model="result.model"
                autocomplete="off"
                autofill="off"
                label="搜索地址"
                placeholder="输入地址"
                prepend-icon="mdi-magnify"
                type="text"
              />
              <div id="map" class="hidden" />
              <v-text-field v-model="customer.street" label="街道地址" />
              <v-text-field v-model="customer.city" label="城市" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="customer.state" label="州" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="customer.zip" label="邮编" />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="customer.note"
                hint="输入公司相关备注"
                label="备注"
                outlined
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" variant="text" @click="closeForm">取消</v-btn>
        <v-btn v-if="mode === 'create'" color="blue darken-1" variant="text" @click="closeForm">稍后提交</v-btn>
        <v-btn v-if="mode === 'create'" color="blue darken-1" variant="text" @click="submitForm">创建</v-btn>
        <v-btn v-if="mode === 'update'" color="blue darken-1" variant="text" @click="updateCompany">提交修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
