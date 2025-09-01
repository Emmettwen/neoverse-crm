<template>
  <router-view />
  <v-overlay class="align-center justify-center" :model-value="fullscreenLoading">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/store/app'

  const store = useAppStore()
  const fullscreenLoading = computed(() => store.fullscreenLoading)
</script>

<style>
.v-table thead th {
    white-space: nowrap
}

.v-table tbody tr:nth-child(odd) {
    background-color: #e9e9e9
}

.tox.tox-tinymce-aux {
    z-index: 4000;
}
</style>
