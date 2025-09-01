<script setup lang="ts">
  import QrcodeVue from 'qrcode.vue'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/store/app.ts'
  import api from '@/utils/api'
  import { message } from '@/utils/helper.ts'
  import request from '@/utils/request.ts'

  const store = useAppStore()
  const router = useRouter()
  const rechargeCode = ref('asjdasldjladkjalskdjaslkdjasldkj')
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
      message.success('提交成功！请等待审核.')
      router.replace('/payment-history')
    })
  }
</script>

<template>
  <v-sheet class="my-8" color="grey-lighten-3">
    <v-table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Qty</td>
          <td>Unit Price</td>
          <td class="text-right">Price</td>
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
          <td class="text-right" colspan="3">Subtotal</td>
          <td class="text-right">${{ store.cartItems.amount * store.cartItems.price }}</td>
        </tr>
        <tr>
          <td class="text-right" colspan="3">Total</td>
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
            class="my-4"
            level="H"
            :size="250"
            :value="rechargeCode"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <v-file-upload
          v-model="paymentPic"
          accept="image/*"
          density="comfortable"
          title="上传支付凭证"
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
  >Subscribe And Pay</v-btn>
</template>

<style scoped>

</style>
