<script setup lang="ts">
  import type { Product } from '@/utils/interface.ts'
  import { ref } from 'vue'
  import api from '@/utils/api.ts'
  import { getThumbnail, message } from '@/utils/helper.ts'
  import { useTableServer } from '@/utils/hooks.ts'
  import request from '@/utils/request.ts'
  import { requiredRegex } from '@/utils/rules.ts'

  defineOptions({
    name: 'ProductList',
  })

  const name = ref()
  const displayName = ref()
  const price = ref(0)
  const duration = ref(0)
  const form = ref()
  const formValid = ref(false)
  const productDialog = ref(false)
  const edit = ref(false)
  const target = ref<string>('')

  const {
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
    deleteItem,
    currentPage,
  } = useTableServer<Product>('product')
  const headers = ref([
    { title: '名称', key: 'name' },
    { title: '展示名称', key: 'displayName' },
    { title: '价格($)', key: 'price' },
    { title: '时长(天)', key: 'duration' },
    { title: '禁用', key: 'disabled' },
    { title: '操作', key: 'actions' },
  ])

  const handleSubmit = async () => {
    const { valid } = await form.value.validate()
    if (!valid) {
      message.error('请补充信息')
      return
    }
    if (edit.value) {
      request({
        ...api.product.update(target.value),
        data: {
          data: {
            name: name.value,
            displayName: displayName.value,
            price: price.value,
            duration: duration.value,
          },
        },
      }).then(() => {
        message.success('修改成功')
        productDialog.value = false
        loadItems()
      })
    } else {
      request({
        ...api.product.create,
        data: {
          data: {
            displayName: displayName.value,
            name: name.value,
            price: price.value,
            duration: duration.value,
            disabled: false,
          },
        },
      }).then(() => {
        message.success('创建成功')
        productDialog.value = false
        loadItems()
      })
    }
  }

  const editItem = async (item: Product) => {
    target.value = item.documentId
    name.value = item.name
    displayName.value = item.displayName
    price.value = item.price
    duration.value = item.duration
    productDialog.value = true
    edit.value = true
  }

  const createItem = () => {
    edit.value = false
    name.value = ''
    displayName.value = ''
    price.value = 0
    duration.value = 0
    productDialog.value = true
  }

  const updateDisableItem = async (index: number, documentId: string) => {
    request({
      ...api.product.update(documentId),
      data: {
        data: {
          disabled: items.value[index].disabled,
        },
      },
    }).then(() => {
      message.success('更新成功')
    })
  }
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <v-spacer />
      <v-btn
        color="primary"
        text="添加新产品"
        variant="flat"
        @click="createItem"
      />
      <v-dialog v-model="productDialog" max-width="500">
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
          <v-card title="添加新产品">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    density="comfortable"
                    label="名称"
                    :rules="[requiredRegex]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="displayName"
                    density="comfortable"
                    label="展示名称"
                    :rules="[requiredRegex]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="price"
                    density="comfortable"
                    label="价格"
                    prefix="$"
                    :rules="[requiredRegex]"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="duration"
                    density="comfortable"
                    label="时长"
                    :rules="[requiredRegex]"
                    suffix="天"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                text="取消"
                @click="productDialog = false"
              />
              <v-btn
                class="ml-2"
                color="primary"
                text="提交"
                type="submit"
              />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-card-title>
    <v-divider />
    <v-data-table-server
      v-model:items-per-page="pageSize"
      v-model:page="currentPage"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    >
      <template #[`item.disabled`]="{ index, item }">
        <v-switch
          v-model="item.disabled"
          color="error"
          hide-details
          @update:model-value="updateDisableItem(index, item.documentId)"
        />
      </template>
      <template #[`item.actions`]="{item}">
        <v-btn
          icon="mdi-square-edit-outline"
          variant="text"
          @click="editItem(item)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          @click="deleteItem(item.documentId)"
        />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>
