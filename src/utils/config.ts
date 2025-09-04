import type { MenuItem, UserRole } from '@/utils/interface.ts'
import { t } from '@/utils/helper'

/**
 * Created by Emmett Wen on 2023/12/1.
 */
export const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
export const baseApiUrl = baseUrl + '/api'
export const TokenKey = import.meta.env.VITE_APP_TOKEN || ''
export const adminMenu = [
  { title: '主页', link: '/', icon: 'mdi-monitor-dashboard' },
  { title: '产品管理', link: '/items', icon: 'mdi-license' },
  { title: '订单审核和管理', link: '/orders', icon: 'mdi-order-bool-descending-variant' },
  { title: '系统设置', link: '/settings', icon: 'mdi-cog' },
  { title: '修改密码', link: '/change-password', icon: 'mdi-lock-reset' },
]
const defaultMenu = [
  { title: t('menu.home'), link: '/', icon: 'mdi-monitor-dashboard' },
  { title: t('menu.buy'), link: '/products', icon: 'mdi-license' },
  { title: t('menu.paymentHistory'), link: '/payment-history', icon: 'mdi-account-credit-card' },
  { title: t('changePassword'), link: '/change-password', icon: 'mdi-lock-reset' },
]
export const getMenu = (role: UserRole): MenuItem[] => {
  switch (role?.name) {
    case 'Admin': { return adminMenu as MenuItem[]
    }
    default: {
      return defaultMenu as MenuItem[]
    }
  }
}

export const orderStatus = [
  { name: 'open', title: '订单已创建', level: 1, color: 'success' },
  { name: 'quotation rejected', title: '报价驳回', level: 10, color: 'warning' },
  { name: 'pending quotation', title: '等待报价', level: 15, color: 'info' },
  { name: 'quotation approved', title: '报价通过', level: 17, color: 'success' },
  { name: 'pending contract', title: '等待生成合同', level: 20, color: 'info' },
  { name: 'pending signature', title: '等待签名', level: 25, color: 'info' },
  { name: 'pending deposit payment', title: '等待支付定金', level: 30, color: 'info' },
  { name: 'pending car purchase', title: '等待采购', level: 40, color: 'info' },
  { name: 'pending full payment', title: '等待支付全款', level: 45, color: 'info' },
  { name: 'in transit china', title: '中国运输中', level: 50, color: 'info' },
  { name: 'the custom documentation', title: '海关清关中', level: 55, color: 'info' },
  { name: 'in transit international', title: '国际运输中', level: 60, color: 'info' },
  { name: 'delivered', title: '交付中', level: 70, color: 'info' },
  { name: 'tax refunded', title: '退税中', level: 80, color: 'info' },
  { name: 'order completed', title: '订单已完成', level: 100, color: 'success' },
  { name: 'order canceled', title: '订单已取消', level: -1, color: 'info' },
]

export const engineType = {
  gasoline: '汽油',
  diesel: '柴油',
  hybrid: '混动',
  electric: '纯电',
}

export const driveType = {
  'AWD/4WD': '四驱',
  'Front Wheel Drive': '前驱',
  'Rear Wheel Drive': '后驱',
}

const config = {
  baseUrl,
  TokenKey: TokenKey || '',
}

export default config
