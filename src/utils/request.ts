import type { CustomConfig } from '@/utils/interface'
/**
 * Created by Emmett Wen on 2023/12/1.
 */
import axios from 'axios'
import qs from 'qs'
import { useAppStore } from '@/store/app'
import { getToken } from '@/utils/auth'
import { baseApiUrl } from '@/utils/config'
import { message } from '@/utils/helper'

const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

service.interceptors.request.use((config: CustomConfig) => {
  const store = useAppStore()
  if (!config.public) {
    config.headers = config.headers || {} // Ensure headers exist
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  if (config.list) {
    config.paramsSerializer = params => {
      return qs.stringify(params, { encodeValuesOnly: true })
    }
  }
  if (config.loading) {
    store.fullscreenLoading = true
  }
  return config
}, error => {
  const store = useAppStore()
  store.fullscreenLoading = false
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const store = useAppStore()
    store.fullscreenLoading = false
    return response.status >= 200 && response.status < 300 ? Promise.resolve(response.data) : Promise.reject(response)
  },
  error => {
    const store = useAppStore()
    store.fullscreenLoading = false
    if (error.response) {
      if (error.response.status === 401) {
        message.error('Unauthorized: ' + (error.response.data.error?.message || ''))
        store.userLogout()
      } else {
        message.error(error.response.data.error?.message || 'An error occurred')
      }
    } else {
      message.error(error.response.data.error.message)
    }
    return Promise.reject(error)
  },
)

export default service
