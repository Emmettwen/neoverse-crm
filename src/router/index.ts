// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/layouts/login/Login.vue'
import { useAppStore } from '@/store/app'
import api from '@/utils/api'
import { getToken } from '@/utils/auth'

import request from '@/utils/request'

import NotFound from '@/views/404Page.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import Checkout from '@/views/Checkout.vue'
import Items from '@/views/items/Index.vue'
import Orders from '@/views/orders/Index.vue'
import PaymentHistory from '@/views/PaymentHistory.vue'
import Products from '@/views/product/Index.vue'
import Setting from "@/views/Setting.vue";

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: '仪表盘',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        meta: {
          requireAuth: true,
          title: '首页',
        },
      }, {
        path: '/items',
        name: '产品管理',
        component: Items,
        meta: {
          requireAuth: true,
          title: '产品管理',
        },
      }, {
        path: '/products',
        name: '产品',
        component: Products,
        meta: {
          requireAuth: true,
          title: '产品',
        },
      }, {
        path: '/checkout',
        name: '付款',
        component: Checkout,
        meta: {
          requireAuth: true,
          title: '付款',
        },
      }, {
        path: 'orders',
        name: '订单管理',
        children: [
          { path: '', component: Orders, meta: { requireAuth: true, title: '订单' } },
        ],
      }, {
        path: '/payment-history',
        name: '购买记录',
        component: PaymentHistory,
        meta: { requireAuth: true, title: '订单' },
      }, {
        path: '/settings',
        name: '设置',
        component: Setting,
        meta: { requireAuth: true, title: '设置' },
      }, {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: {
          showHeader: false,
          showBreadcrumbs: false,
          title: '登录',
        },
      }, {
        path: 'change-password',
        name: '修改密码',
        component: ChangePassword,
        meta: {
          requireAuth: true,
          title: '修改密码',
        },
      }, {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: NotFound,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAppStore()
  if (to.matched.some(record => record.meta.requireAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (getToken()) {
      if (store.isUserLogin) {
        next()
      } else {
        request({
          ...api.USER_INFO_ME,
          params: { populate: ['role'] },
        }).then(res => {
          store.updateUser(res)
          next()
        })
      }
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
  } else {
    if (store) {
      next()
    } // 确保一定要调用 next()
  }
})

export default router
