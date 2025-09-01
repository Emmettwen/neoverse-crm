import router from '@/router'
/**
 * Created by Emmett Wen on 2023/12/1.
 */
import { useAppStore } from '@/store/app'
import { TokenKey } from '@/utils/config'

export function getToken (): string | false {
  const store = useAppStore()
  const token = store.token || localStorage.getItem(TokenKey) || ''
  if (token) {
    return token
  } else {
    router.push({ path: '/login' }).catch(error => {
      console.error('Navigation Error:', error)
    })
    return false
  }
}
