<script setup lang="ts">
  import type { Product } from '@/utils/interface.ts'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import api from '@/utils/api.ts'
  import { message } from '@/utils/helper.ts'
  import { useTableServer } from '@/utils/hooks.ts'
  import request from '@/utils/request.ts'
  import { requiredRegex } from '@/utils/rules.ts'

  defineOptions({
    name: 'ProductList',
  })

  const { t } = useI18n()
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
  const headers = computed(() => [
    { title: t('product.name'), key: 'name' },
    { title: t('product.displayName'), key: 'displayName' },
    { title: t('product.price'), key: 'price' },
    { title: t('product.duration'), key: 'duration' },
    { title: t('product.disabled'), key: 'disabled' },
    { title: t('product.actions'), key: 'actions' },
  ])

  const handleSubmit = async () => {
    const { valid } = await form.value.validate()
    if (!valid) {
      message.error(t('error.addInformation'))
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
        message.success(t('success.update'))
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
        message.success(t('product.create'))
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
      message.success(t('product.update'))
    })
  }
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <v-spacer />
      <v-btn
        color="primary"
        :text="t('product.addNewProduct')"
        variant="flat"
        @click="createItem"
      />
      <v-dialog v-model="productDialog" max-width="500">
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
          <v-card :title="t('product.addNewProduct')">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    density="comfortable"
                    :label="t('product.name')"
                    :rules="[requiredRegex]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="displayName"
                    density="comfortable"
                    :label="t('product.displayName')"
                    :rules="[requiredRegex]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="price"
                    density="comfortable"
                    :label="t('product.price')"
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
                    :label="t('product.duration')"
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
                :text="t('cancel')"
                @click="productDialog = false"
              />
              <v-btn
                class="ml-2"
                color="primary"
                :text="t('submit')"
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
