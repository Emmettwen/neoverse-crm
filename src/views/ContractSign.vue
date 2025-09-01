<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/utils/api'
  import { message } from '@/utils/helper'
  import request from '@/utils/request'

  const route = useRoute()
  const id = ref()
  const content = ref('')
  const filename = ref('')
  const signed = ref(false)
  const signature = ref()
  const signature_img_data = ref('')

  onMounted(() => {
    if (route.query.id) {
      id.value = route.query.id
      request({
        // @ts-ignore
        ...api.contract.view(id.value),
      }).then(res => {
        content.value = res.data.content
        filename.value = res.data.filename
        signed.value = res.data.signed
        if (signed.value) {
          signature.value.lockSignaturePad()
          signature_img_data.value = res.data.signature_img_data
        }
      })
    }
  })

  const clean = () => {
    signature.value.clearSignature()
  }
  const save = () => {
    const { isEmpty, data } = signature.value.saveSignature()
    if (!isEmpty) {
      request({
        // @ts-ignore
        ...api.contract.sign(id.value),
        data: {
          signature_img_data: data,
          signed: true,
          sign_time: new Date(),
        },
      }).then(() => {
        message.success('签署成功')
        signature.value.lockSignaturePad()
        signed.value = true
      })
    }
  }

</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <div v-html="content" />
        <template v-if="signed">
          <v-row v-if="signed" justify="center">
            <v-col cols="12" sm="6">
              <v-img :src="signature_img_data" />
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row align="center" justify="center">
            <VueSignaturePad id="signature" ref="signature" height="150px" width="500px" />
          </v-row>
          <v-row justify="center">
            <v-btn @click="clean">清除</v-btn>
            <v-btn @click="save">提交</v-btn>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
#signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
}

</style>
