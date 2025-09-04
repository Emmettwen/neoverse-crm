<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/store/app.ts'
  import { message } from '@/utils/helper.ts'
  import { requiredRegex } from '@/utils/rules'

  const { t } = useI18n()
  const currentPassword = ref()
  const password = ref()
  const passwordConfirmation = ref()
  const form = ref()
  const formValid = ref(false)
  const store = useAppStore()
  const confirmationRegex = (value: string) => {
    return password.value && password.value === value ? true : t('error.passwordNotMatch')
  }

  const handleSubmit = async () => {
    const { valid } = await form.value.validate()
    if (!valid) {
      message.error(t('error.addInformation'))
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
        <v-card-title class="text-h5 text-center">{{ t('changePassword') }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="currentPassword"
              class="mb-4"
              density="comfortable"
              :label="t('currentPassword')"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="[requiredRegex]"
              type="password"
            />
            <v-text-field
              v-model="password"
              class="mb-4"
              density="comfortable"
              :label="t('newPassword')"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="[requiredRegex]"
              type="password"
            />
            <v-text-field
              v-model="passwordConfirmation"
              class="mb-4"
              density="comfortable"
              :label="t('passwordConfirmation')"
              outlined
              prepend-inner-icon="mdi-lock-outline"
              :rules="[requiredRegex, confirmationRegex]"
              type="password"
            />
            <v-btn block color="primary" type="submit">{{ t('submit') }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
