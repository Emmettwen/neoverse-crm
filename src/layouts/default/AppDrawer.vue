<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/store/app'
  import { getMenu } from '@/utils/config'

  const store = useAppStore()
  const { locale, t } = useI18n({ useScope: 'global' })
  const menu = ref(getMenu(store.user.role))

  watch(locale, () => {
    menu.value = getMenu(store.user.role)
  })
</script>

<template>

  <v-navigation-drawer
    v-if="store.isUserLogin"
    v-model="store.drawer"
  >
    <v-list v-if="store.user.role">
      <!-- @vue-ignore -->
      <template v-for="(item, index) in menu">
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
        :title="t('logout')"
        @click="store.userLogout"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>
