<template>
  <v-sheet>
    <v-row class="mt-6" justify="center">
      <v-col cols="12" md="6">
        <SubscriptionList />
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat>
          <v-card-title>Useful Links</v-card-title>
          <v-divider class="mb-4" />
          <v-btn v-if="!store.isAdmin" class="mr-2" to="/products" variant="outlined">Buy a license</v-btn>
          <v-btn class="mr-2" to="/change-password" variant="outlined">Change Password</v-btn>
          <v-btn
            class="mr-2"
            variant="outlined"
            @click="store.userLogout"
          >Logout</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts" setup>
  import SubscriptionList from '@/components/Home/SubscriptionList.vue'
  import { useAppStore } from '@/store/app'
  const store = useAppStore()
</script>
