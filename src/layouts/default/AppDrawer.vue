<script setup lang="ts">
  import type { UserRole } from '@/utils/interface.ts'
  import { useAppStore } from '@/store/app'
  import { getMenu } from '@/utils/config'

  const store = useAppStore()
</script>

<template>

  <v-navigation-drawer
    v-if="store.isUserLogin"
    v-model="store.drawer"
  >
    <v-list v-if="store.user.role">
      <!-- @vue-ignore -->
      <template v-for="(item, index) in getMenu(store.user.role)">
        <v-list-item
          v-if="!item.children"
          :key="item.title"
          link
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.link"
        />
        <v-list-group v-else :key="index" no-action>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.title"
            />
          </template>
          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            link
            :to="child.link"
          >
            <v-list-item-title>{{ child.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </template>
      <v-list-item
        link
        prepend-icon="mdi-logout"
        title="退出登录"
        @click="store.userLogout"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>
