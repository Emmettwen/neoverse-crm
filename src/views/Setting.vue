<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import api from '@/utils/api'
  import request from '@/utils/request'

  const settings = reactive({
    paymentCode: '',
  })

  const save = () => {
    request({
      ...api.SETTINGS_UPDATE,
      data: {
        data: {
          paymentCode: settings.paymentCode,
        },
      },
    }).then(res => {
      console.log(res)
    })
  }

  onMounted(async () => {
    request({
      ...api.SETTINGS,
    }).then(res => {
      settings.paymentCode = res.data.paymentCode
    })
  })
</script>

<template>
  <v-card flat>
    <v-card-title>系统设置</v-card-title>
    <v-divider />
    <v-text-field
      v-model="settings.paymentCode"
      label="支付地址"
    />
    <v-card-actions>
      <v-btn color="primary" @click="save">保存</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>
