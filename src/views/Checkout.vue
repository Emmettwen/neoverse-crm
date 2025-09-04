<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue'
  import {computed, onMounted, ref} from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/store/app.ts'
  import api from '@/utils/api'
  import { message } from '@/utils/helper.ts'
  import request from '@/utils/request.ts'

  const { t } = useI18n()
  const store = useAppStore()
  const router = useRouter()
  const paymentCode = ref('')
  const paymentPic = ref<File>()

  const canSubmit = computed(() => {
    return !!paymentPic.value
  })

  const placeOrder = async () => {
    const pic: any = await store.uploadFile(paymentPic.value as File)
    request({
      ...api.order.place,
      data: {
        product: store.cartItems,
        payment: pic[0].id,
      },
    }).then(() => {
      message.success(t('success.submit'))
      router.replace('/payment-history')
    })
  }

  onMounted(async () => {
    request({
      ...api.SETTINGS,
    }).then(res => {
      paymentCode.value = res.data.paymentCode
    })
  })
</script>

<template>
  <v-sheet class="my-8" color="grey-lighten-3">
    <v-table>
      <thead>
        <tr>
          <td>{{ t('product.name') }}</td>
          <td>{{ t('product.qty') }}</td>
          <td>{{ t('checkout.unitPrice') }}</td>
          <td class="text-right">{{ t('product.price') }}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ store.cartItems.name }}</td>
          <td>{{ store.cartItems.amount }}</td>
          <td>${{ store.cartItems.price }}</td>
          <td class="text-right">${{ store.cartItems.amount * store.cartItems.price }}</td>
        </tr>
        <tr>
          <td class="text-right" colspan="3">{{ t('checkout.subtotal') }}</td>
          <td class="text-right">${{ store.cartItems.amount * store.cartItems.price }}</td>
        </tr>
        <tr>
          <td class="text-right" colspan="3">{{ t('checkout.total') }}</td>
          <td class="text-right">${{ store.cartItems.amount * store.cartItems.price }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>

  <v-sheet class="my-8" color="grey-lighten-3">
    <v-row class="px-4">
      <v-col cols="12" sm="6">
        <div class="text-center">
          <QrcodeVue
            v-if="paymentCode"
            class="my-4"
            level="H"
            :size="250"
            :value="paymentCode"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <v-file-upload
          v-model="paymentPic"
          accept="image/*"
          density="comfortable"
          :title="t('checkout.uploadScreenshot')"
        />
      </v-col>
    </v-row>
  </v-sheet>

  <v-btn
    block
    class="my-8"
    color="primary"
    :disabled="!canSubmit"
    @click="placeOrder"
  >{{ t('submit') }}</v-btn>
</template>

<style scoped>

</style>
