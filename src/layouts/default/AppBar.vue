<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon
      v-if="store.isUserLogin"
      variant="text"
      @click.stop="store.drawer = !store.drawer"
    />
    <div class="d-flex flex-column">
      <v-breadcrumbs
        v-if="route.meta.showBreadcrumbs ?? true"
        class="text-subtitle-2"
        :items="breadcrumbs as BreadcrumbItem[]"
      >
        <template #item="{item}">
          <v-breadcrumbs-item :disabled="item.disabled" :to="item.to">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <h4 class="page-title">{{ route.meta.title ?? title }}</h4>
    </div>
    <v-spacer />

    <v-select
      v-if="mdAndUp"
      v-model="currentLanguage"
      class="vertical-center"
      density="compact"
      hide-details
      item-title="text"
      item-value="value"
      :items="langOptions"
      :label="t('language')"
      max-width="140px"
      variant="plain"
    >
      <template #prepend>
        <v-icon class="opacity-100 mt-1" size="18px">
          mdi-web
        </v-icon>
      </template>
      <template #item="{ props }">
        <v-list-item v-bind="props" density="compact" />
      </template>
    </v-select>
    <v-menu open-on-hover>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          append-icon="mdi-chevron-down"
        >{{ store.user.username }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item append-icon="mdi-content-copy">
          ID: {{ store.user.documentId }}
        </v-list-item>
        <v-divider />
        <v-list-item
          append-icon="mdi-logout"
          link
          @click="store.userLogout"
        >{{ t('logout') }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
  // @ts-ignore
  import type { BreadcrumbItem } from 'vuetify/lib/components/VBreadcrumbs/VBreadcrumbs'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { useAppStore } from '@/store/app'

  const { locale, t } = useI18n()

  const store = useAppStore()
  const { mdAndUp } = useDisplay()

  const langOptions = [
    { text: 'English', value: 'en' },
    { text: '简体中文', value: 'zhHans' },
  ]

  const title = ref('EA CRM 系统')
  const route = useRoute()

  const currentLanguage = computed({
    get () {
      return locale.value
    },
    set (val) {
      locale.value = val
      localStorage.setItem('lang', val)
    },
  })

  const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched.filter(route => route.name)
    const breadcrumbs = matchedRoutes.map((r, index) => {
      let path = r.path
      for (const param in route.params) {
        // @ts-ignore
        path = path.replace(`:${param}`, route.params[param])
      }
      return {
        title: r.name,
        disabled: path === route.path,
        to: r.path,
      }
    })

    if (breadcrumbs.length > 0) {
      // @ts-ignore
      breadcrumbs.unshift({ title: '首页', disabled: false, to: { path: '/' } })
    }
    return breadcrumbs
  })

</script>
<style scoped>
.page-title {
    padding-left: 4px;
    font-weight: 700;
}
</style>
