import type { ApiResourceConfig, CustomConfig } from '@/utils/interface'

export type ApiNamespace = keyof typeof api
const createApiConfig = (resource: string, options?: Partial<ApiResourceConfig>): ApiResourceConfig => {
  const defaultConfig: ApiResourceConfig = {
    list: <CustomConfig>{ url: `/${resource}`, method: 'get', list: true, loading: true },
    find: (id: string | number) => <CustomConfig>({ url: `/${resource}/${id}`, method: 'get', loading: true }),
    create: <CustomConfig>{ url: `/${resource}`, method: 'post', loading: true },
    update: (id: string | number) => <CustomConfig>({ url: `/${resource}/${id}`, method: 'put', loading: true }),
    delete: (id: string | number) => <CustomConfig>({ url: `/${resource}/${id}`, method: 'delete', loading: true }),
  }

  // Apply custom options
  if (options) {
    for (const key of Object.keys(options)) {
      const optionKey = key as keyof ApiResourceConfig
      const optionValue = options[optionKey]

      if (optionValue) {
        defaultConfig[optionKey] = typeof optionValue === 'function' ? optionValue : { ...defaultConfig[optionKey], ...optionValue }
      }
    }
  }

  return defaultConfig
}
const api = {
  address: createApiConfig('addresses'),
  car: createApiConfig('cars'),
  contact: createApiConfig('contacts'),
  color: createApiConfig('colors'),
  customer: createApiConfig('customers'),
  exchange: createApiConfig('exchanges'),
  key: createApiConfig('keys', {
    unbind: id => ({
      url: `/keys/${id}/unbind`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    customerUnbind: id => ({
      url: `/keys/${id}/customer-unbind`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    bind: id => ({
      url: `/keys/${id}/bind`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    verify: { url: '/keys/verify', method: 'post', loading: true } as CustomConfig,
  }),
  location: createApiConfig('locations'),
  make: createApiConfig('makes'),
  model: createApiConfig('models'),
  order: createApiConfig('orders', {
    details: (id: string | number) => ({
      url: `/orders/${id}/details`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    place: { url: '/orders/place', method: 'post', loading: true } as CustomConfig,
    approve: id => ({
      url: `/orders/${id}/approve`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    bind: id => ({
      url: `/orders/${id}/bind`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    unbind: id => ({
      url: `/orders/${id}/unbind`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
    customerUnbind: id => ({
      url: `/orders/${id}/customer-unbind`,
      method: 'post',
      loading: true,
    }) as CustomConfig,
  }),
  orderDetail: createApiConfig('order-details'),
  product: createApiConfig('products'),
  quoteItem: createApiConfig('quote-items'),
  stock: createApiConfig('stocks', {
    translate: { url: '/stocks/translate', method: 'post', loading: true } as CustomConfig,
  }),

  USER_LOGIN: { url: '/auth/local', method: 'post', public: true, loading: true },
  USER_SIGNUP: { url: '/auth/local/register', method: 'post', public: true, loading: true },
  FORGET_PASSWORD: { url: '/auth/forgot-password', method: 'post', public: true, loading: true },
  USER_INFO_ME: { url: '/users/me', method: 'get', loading: true },
  RESET_PASSWORD: { url: '/auth/reset-password', method: 'post', public: true, loading: true },
  CHANGE_PASSWORD: { url: '/auth/change-password', method: 'post', loading: true },
  UPLOAD: { url: '/upload', method: 'post', loading: true },
  DELETE_FILE: (id: number) => ({ url: '/upload/files/' + id, method: 'delete', loading: true }),
  SETTINGS: { url: '/setting', method: 'get', loading: true },
  SETTINGS_UPDATE: { url: '/setting', method: 'put', loading: true },
}

export default api
