<script setup lang="ts">
  import { computed } from 'vue'
  import { getOrderStatus } from '@/utils/helper'

  const model = defineModel({ type: String, default: '' })
  const status = computed(() => {
    return getOrderStatus(model.value)
  })
</script>

<template>
  <v-chip
    class="ma-2"
    :color="status.color"
    label
  >
    <v-icon icon="mdi-information" start />
    {{ status.title }}
  </v-chip>
</template>

<style scoped>

</style>
