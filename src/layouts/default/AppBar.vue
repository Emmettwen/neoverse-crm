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
          ID: {{ store.user.id }}
        </v-list-item>
        <v-divider />
        <v-list-item
          append-icon="mdi-logout"
          link
          @click="store.userLogout"
        >退出登录
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
  // @ts-ignore
  import type { BreadcrumbItem } from 'vuetify/lib/components/VBreadcrumbs/VBreadcrumbs'
  import type { Rate } from '@/utils/interface'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAppStore } from '@/store/app'
  import { useHelperStore } from '@/store/helper'
  import { getCurrencySymbol } from '@/utils/helper'

  const store = useAppStore()
  const helperStore = useHelperStore()

  const setDisplayRate = (target: Rate | any) => {
    switch (target.to) {
      case 'CNY': {
        helperStore.displayRate = {
          locale: 'zh-CN',
          currency: target.to,
          rate: target.rate,
        }

        break
      }
      case 'USD': {
        helperStore.displayRate = {
          locale: 'en-US',
          currency: target.to,
          rate: target.rate,
        }

        break
      }
      case 'EUR': {
        helperStore.displayRate = {
          locale: 'de-DE',
          currency: target.to,
          rate: target.rate,
        }

        break
      }
      default: {
        helperStore.displayRate = {
          locale: 'ru-RU',
          currency: 'RUB',
          rate: 1,
        }
      }
    }
  }

  const title = ref('EA CRM 系统')
  const route = useRoute()

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
