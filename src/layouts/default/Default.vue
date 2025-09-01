<template>
  <v-app>
    <default-drawer v-if="route.meta.showHeader ?? true" />
    <default-bar v-if="route.meta.showHeader ?? true" />
    <default-snackbar />
    <default-view />
    <default-footer />
  </v-app>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  import DefaultFooter from '@/layouts/default/DefaultFooter.vue'
  import DefaultBar from './AppBar.vue'
  import DefaultDrawer from './AppDrawer.vue'
  import DefaultSnackbar from './DefaultSnackbar.vue'

  import DefaultView from './View.vue'

  const route = useRoute()
</script>
