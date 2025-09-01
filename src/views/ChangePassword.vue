<script setup lang="ts">
  import { ref } from 'vue'
  import { useAppStore } from '@/store/app.ts'
  import { message } from '@/utils/helper.ts'
  import { requiredRegex } from '@/utils/rules'

  const currentPassword = ref()
  const password = ref()
  const passwordConfirmation = ref()
  const form = ref()
  const formValid = ref(false)
  const store = useAppStore()
  const confirmationRegex = (value: string) => {
    return password.value && password.value === value ? true : '两次密码不相同，请重新输入';
  }

  const handleSubmit = async () => {
    const { valid } = await form.value.validate()
    if (!valid) {
      message.error('请补充信息')
      return
    }
    store.userChangePassword({
      currentPassword: currentPassword.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    })
  }
</script>

<template>
  <v-row align="center" class="mt-6" justify="center">
    <v-col cols="12" md="4" sm="8">
      <v-card>
        <v-card-title class="text-h5 text-center">修改密码</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="currentPassword"
              class="mb-4"
              density="comfortable"
              label="当前密码"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="[requiredRegex]"
              type="password"
            />
            <v-text-field
              v-model="password"
              class="mb-4"
              density="comfortable"
              label="新密码"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="[requiredRegex]"
              type="password"
            />
            <v-text-field
              v-model="passwordConfirmation"
              class="mb-4"
              density="comfortable"
              label="确认密码"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="[requiredRegex, confirmationRegex]"
              type="password"
            />
            <v-btn block color="primary" type="submit">提交修改</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
