<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useAppStore } from '@/store/app'

  const store = useAppStore()

  const email = ref('')
  const password = ref('')
  const showPass = ref(false)
  const formType = ref('login')
  const username = ref('')

  const formTitle = computed(() => {
    switch (formType.value) {
      case 'login': { return '登录' }
      case 'signup': { return '注册' }
      default: { return '找回密码' }
    }
  })
  const login = async () => {
    store.userLogin({
      identifier: email.value,
      password: password.value,
    })
  }
  const signup = async () => {
    store.userRegister({
      email: email.value,
      username: username.value,
      password: password.value,
    })
  }
  const forgetPassword = async () => {}
</script>

<template>
  <v-container fluid>
    <v-row align="center" justify="center" style="height: 100vh;">
      <v-col cols="12" md="4" sm="8">
        <v-card>
          <v-card-title class="text-h5 text-center">{{ formTitle }}</v-card-title>
          <v-card-text>
            <v-tabs-window v-model="formType">
              <v-tabs-window-item value="login">
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="email"
                    class="mb-4"
                    label="Email"
                    outlined
                    prepend-inner-icon="mdi-email-outline"
                  />
                  <v-text-field
                    v-model="password"
                    :append-inner-icon="showPass ? 'mdi-eye': 'mdi-eye-off'"
                    class="mb-4"
                    label="Password"
                    outlined
                    prepend-inner-icon="mdi-lock-outline"
                    :type="showPass ? 'text':'password'"
                    @click:append-inner="showPass = !showPass"
                  />
                  <v-btn block color="primary" type="submit">登录</v-btn>
                </v-form>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="formType = 'forget'"
                >忘记密码？</v-btn>
                <v-divider class="my-5">没有账号？</v-divider>
                <v-btn block color="primary" @click="formType = 'signup'">立即注册</v-btn>
              </v-tabs-window-item>
              <v-tabs-window-item value="signup">
                <v-form @submit.prevent="signup">
                  <v-text-field
                    v-model="email"
                    class="mb-4"
                    label="电子邮件"
                    outlined
                    prepend-inner-icon="mdi-email-outline"
                    type="email"
                  />
                  <v-text-field
                    v-model="username"
                    class="mb-4"
                    label="用户名"
                    outlined
                    prepend-inner-icon="mdi-account"
                  />
                  <v-text-field
                    v-model="password"
                    :append-inner-icon="showPass ? 'mdi-eye': 'mdi-eye-off'"
                    class="mb-4"
                    label="密码"
                    outlined
                    prepend-inner-icon="mdi-lock-outline"
                    :type="showPass ? 'text':'password'"
                    @click:append-inner="showPass = !showPass"
                  />
                  <v-text-field
                    v-model="password"
                    :append-inner-icon="showPass ? 'mdi-eye': 'mdi-eye-off'"
                    class="mb-4"
                    label="确认密码"
                    outlined
                    prepend-inner-icon="mdi-lock-outline"
                    :type="showPass ? 'text':'password'"
                    @click:append-inner="showPass = !showPass"
                  />
                  <v-btn block color="primary" type="submit">注册</v-btn>
                </v-form>
                <v-divider class="my-5">或者</v-divider>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-chevron-left"
                  variant="text"
                  @click="formType = 'login'"
                >返回登录</v-btn>
              </v-tabs-window-item>
              <v-tabs-window-item value="forget">
                <v-form @submit.prevent="signup">
                  <v-text-field
                    v-model="email"
                    class="mb-4"
                    label="Email"
                    outlined
                    prepend-inner-icon="mdi-email-outline"
                  />
                  <v-btn block color="primary" type="submit">提交找回</v-btn>
                </v-form>
                <v-divider class="my-5">或者</v-divider>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-chevron-left"
                  variant="text"
                  @click="formType = 'login'"
                >返回登录</v-btn>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
