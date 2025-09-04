<script setup lang="ts">
  import type { Order } from '@/utils/interface.ts'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTableServer } from '@/utils/hooks.ts'

  const { t } = useI18n()


  const {
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
  } = useTableServer<Order>('order', ['product', 'paymentPic'])
  const headers = ref([
    { title: 'Order Number', key: 'documentId' },
    { title: 'Product', key: 'product.name' },
    { title: 'Status', key: 'orderStatus' },
    { title: 'End Date', key: 'endDate' },
  ] as const)
</script>

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      {{ t('activeSubscription') }}
    </v-card-title>
    <v-divider />
    <v-data-table-server
      v-model:items-per-page="pageSize"
      :headers="headers"
      hide-default-footer
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      no-data-text="You have no paid license"
      :search="search"
      @update:options="loadItems"
    >
      <template #[`item.customer`]="{value}">
        {{ value ? value.name : '' }}
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>
