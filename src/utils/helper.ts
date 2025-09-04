import type { Car, Media, Trim } from '@/utils/interface'
/**
 * Created by Emmett Wen on 2023/12/3.
 */
import axios from 'axios'
import i18n from '@/plugins/i18n.ts'
import { useAppStore } from '@/store/app'
import { baseUrl, orderStatus } from '@/utils/config'

function downloadFile (url: string) {
  axios.get(url, {
    responseType: 'blob',
  }).then(function (res) {
    const blob = res.data
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.addEventListener('load', function (e) {
      const a = document.createElement('a')
      let fileName = res.headers['content-disposition'].split('=')
      fileName = fileName.at(-1)
      fileName = fileName.replace(/"/g, '')
      a.download = fileName
      if (e.target && typeof e.target.result === 'string') {
        a.href = e.target.result
      }
      document.body.append(a)
      a.click()
      a.remove()
    })
  })
}

const createMessage = (color: string) => {
  return (text: string) => {
    const store = useAppStore()
    store.showSnackbar({ text, color })
  }
}

const message = {
  success: createMessage('success'),
  error: createMessage('error'),
  warning: createMessage('warning'),
  info: createMessage('info'),
}

const getCurrencySymbol = (locale: string, currency: string) => {
  return (0).toLocaleString(
    locale,
    {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ).replace(/\d/g, '').trim()
}

export const formatCurrency = (car: Car, locale = { locale: 'ru-RU', currency: 'RUB', rate: 1 }) => {
  const amount = car.displayPrice ? car.displayPrice : car.price
  return new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: locale.currency,
  }).format(amount * locale.rate)
}

export const formatCurrencyAmount = (amount: number, locale = { locale: 'ru-RU', currency: 'RUB', rate: 1 }) => {
  return new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: locale.currency,
  }).format(amount * locale.rate)
}

function getImageUrl (media: Media | null) {
  if (!media) {
    return ''
  }
  return baseUrl + media.url
}

function getThumbnail (media: Media) {
  if (!media) {
    return ''
  }
  return baseUrl + media.formats.thumbnail.url
}

function dataURItoBlob (dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab])
}

function getOrderStatus (name: string) {
  return orderStatus.find(item => item.name === name) || { name: 'loading', title: '载入中', level: 0, color: 'info' }
}

function isVideo (mime: string) {
  return mime.includes('video')
}

function isFile (target: any) {
  return target instanceof File
}

function getCarName (trim: Trim) {
  if (!trim) {
    return ''
  }
  return trim.model.make.name + ' ' + trim.model.name + ' ' + trim.name
}

function getYears (): { title: number, value: number }[] {
  const currentYear = new Date().getFullYear() // 获取当前年份
  return Array.from({ length: 31 }, (_, i) => {
    const year = currentYear - i // 从当前年份递减
    return { title: year, value: year }
  })
}

function getCountryName (country = 'CN', locale = 'zh-Hans') {
  const countryName = new Intl.DisplayNames([locale], { type: 'region' })
  return countryName.of(country)
}

function copyText (target: string) {
  const tempTextarea = document.createElement('textarea')

  // 设置样式以确保 textarea 不会在页面上显示
  tempTextarea.style.position = 'absolute'
  tempTextarea.style.left = '-9999px'
  tempTextarea.style.top = '0'

  // 将需要复制的文本设置到 textarea 中
  tempTextarea.value = target

  // 将 textarea 添加到文档中
  document.body.append(tempTextarea)

  // 选中 textarea 中的文本
  tempTextarea.select()
  tempTextarea.setSelectionRange(0, 99_999) // 对于移动设备，这确保了文本的全选

  // 执行复制操作
  try {
    const successful = document.execCommand('copy')
    message.success('Copy successfully!')
    const msg = successful ? '成功' : '失败'
    console.log(`复制文本 ${msg}`)
    // 可选：在这里可以弹出通知或消息提示用户复制成功或失败
  } catch (error) {
    console.error('复制失败', error)
    // 可选：在这里可以处理复制操作失败的情况，比如弹出错误消息
  }

  // 移除临时创建的 textarea
  tempTextarea.remove()
}
function t (key: string, params?: any) {
  return i18n.global.t(key, params)
}

export {
  copyText,
  dataURItoBlob,
  downloadFile,
  getCarName,
  getCountryName,
  getCurrencySymbol,
  getImageUrl,
  getOrderStatus,
  getThumbnail,
  getYears,
  isFile,
  isVideo,
  message,
  t,
}
