<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/store/app'

  const store = useAppStore()

  const snackbar = computed(() => store.snackbar)

  const closeSnackbar = () => {
    store.closeSnackbar()
  }
</script>

<template>
  <v-snackbar
    v-model="snackbar.visible"
    :color="snackbar.color"
    location="top"
    :multi-line="snackbar.multiline"
    :timeout="snackbar.timeout"
  >
    {{ store.snackbar.text }}
    <template #actions>
      <v-btn small variant="text" @click="closeSnackbar">
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>

</style>
