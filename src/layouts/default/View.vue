<template>
  <v-main class="page-main">
    <v-container>
      <router-view />
      <LiveChatWidget
        v-if="false"
        :customer-email="store.user.email"
        :customer-name="store.user.username"
        license="18368694"
        visibility="minimized"
        @new-event="handleNewEvent"
      />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
  import { type EventHandlerPayload, LiveChatWidget } from '@livechat/widget-vue'
  import { useAppStore } from '@/store/app'

  const store = useAppStore()

  function handleNewEvent (event: EventHandlerPayload<'onNewEvent'>) {
    console.log('LiveChatWidget.onNewEvent', event)
  }
</script>

<style scoped>
.page-main {
  background-image: url("@/assets/neoverse-bg.jpg");
  background-size: cover;
  background-position: center;
}
</style>
