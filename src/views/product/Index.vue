<script setup lang="ts">
  import type { Product } from '@/utils/interface.ts'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/store/app'
  import { useTableServer } from '@/utils/hooks.ts'

  defineOptions({
    name: 'Products',
  })
  const { t } = useI18n()
  const store = useAppStore()
  const router = useRouter()
  const headers = computed(() => [
    { title: t('product.name'), key: 'name' },
    { title: t('product.qty'), key: 'amount', align: 'center' },
  ] as const)
  const selected = ref([])
  const amount = ref(0)
  const filters = ref({
    disabled: { $ne: true },
  })
  const {
    items,
    loading,
    loadItems,
  } = useTableServer<Product>('product', [], filters)

  const canNext = computed(() => {
    return !(selected.value.length > 0 && amount.value > 0)
  })
  const onClickNext = () => {
    const target = items.value.find(item => item.name === selected.value[0])
    target.amount = amount.value
    store.updateCartItems(target)
    router.push('/checkout')
  }
</script>

<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    hide-default-footer
    item-value="name"
    :items="items"
    select-strategy="single"
    show-select
  >
    <template #[`item.name`]="{ item }">
      <h3 class="text-uppercase">{{ item.displayName }}</h3>
      <p>{{ item.name }} for MT4. One time payment ${{ item.price }}</p>
    </template>
    <template #[`item.amount`]="{ item }">
      <div class="d-flex justify-center">
        <v-number-input
          v-if="selected[0] === item.name"
          v-model="amount"
          control-variant="split"
          density="compact"
          hide-details
          max-width="150"
          :min="0"
        />
      </div>
    </template>
  </v-data-table>
  <v-sheet class="my-8" color="grey-lighten-3">
    <v-row align="center" class="px-4">
      <v-col cols="3">
        <b>{{ t('product.paymentSystem') }}</b>
      </v-col>
      <v-col cols="9">
        <h3>{{ t('product.checkout') }}</h3>
        <p>{{ t('product.checkoutInformation') }}</p>
      </v-col>
    </v-row>
  </v-sheet>
  <v-btn color="primary" :disabled="canNext" @click="onClickNext">{{ t('next') }}</v-btn>
</template>

<style scoped>

</style>
