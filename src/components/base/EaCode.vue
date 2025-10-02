<script setup lang="ts">
  import { useAppStore } from '@/store/app.ts'
  import api from '@/utils/api.ts'
  import { copyText, message } from '@/utils/helper.ts'
  import request from '@/utils/request.ts'

  const store = useAppStore()
  const model = defineModel({ type: String, default: '' })

  const codeVerification = () => {
    request({
      ...api.key.verify,
      data: {
        regcode: model.value,
      },
    }).then(res => {
      message.info(res.message)
    })
  }
</script>

<template>
  <div class="d-flex align-center">
    <span
      class="d-inline-block text-truncate"
      style="max-width: 200px"
    >{{ model }}</span>
    <v-btn
      icon="mdi-content-copy"
      size="small"
      variant="text"
      @click="copyText(model)"
    />
    <v-btn
      v-if="store.isAdmin"
      icon="mdi-timer-check-outline"
      size="small"
      variant="text"
      @click="codeVerification"
    />
  </div>
</template>

<style scoped>

</style>
