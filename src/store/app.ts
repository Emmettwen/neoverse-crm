import _ from 'lodash'
// Utilities
import { defineStore } from 'pinia'
import router from '@/router'
import api from '@/utils/api'
import { baseApiUrl, TokenKey } from '@/utils/config'
import { message } from '@/utils/helper'
import request from '@/utils/request'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
    token: '',
    baseApiUrl,
    user: {
      id: null,
      username: '',
      email: '',
      avatar: '',
      locations: [],
      phone: '',
      role: <any>undefined,
      customer: undefined,
    },
    snackbar: {
      visible: false,
      text: null,
      timeout: 3000,
      multiline: false,
      color: 'primary',
    },
    fullscreenLoading: false,
    drawer: false,
    cartItems: {},
  }),
  getters: {
    isUserLogin: state => {
      return !!state.user.id
    },
    isAdmin: state => {
      return state.user.role?.name === 'Admin'
    },
  },
  actions: {
    updateUser (payload: any) {
      this.token = localStorage.getItem(TokenKey) || ''
      this.user.username = payload.username
      this.user.email = payload.email
      this.user.id = payload.id
      if (payload.avatar) {
        this.user.avatar = payload.avatar.url
      }
      this.user.locations = payload.locations
      this.user.role = payload.role
      this.user.customer = payload.customer
    },
    showSnackbar (payload: any) {
      this.snackbar.text = payload.text
      this.snackbar.multiline = (payload.text.length > 50)
      if (payload.multiline) {
        this.snackbar.multiline = payload.multiline
      }
      if (payload.timeout) {
        this.snackbar.timeout = payload.timeout
      }
      if (payload.color) {
        this.snackbar.color = payload.color
      }
      this.snackbar.visible = true
    },
    closeSnackbar () {
      this.snackbar.visible = false
      this.snackbar.multiline = false
      this.snackbar.timeout = 5000
      this.snackbar.text = null
      this.snackbar.color = 'primary'
    },
    userReset () {
      this.token = ''
      localStorage.removeItem(TokenKey)
      this.user.id = null
      this.user.username = ''
      this.user.email = ''
      this.user.avatar = ''
      this.user.locations = []
      this.user.role = undefined
      this.user.customer = undefined
    },
    userLogout () {
      this.userReset()
      router.replace('/login')
      this.showSnackbar({ text: '账户登出成功', color: 'success' })
    },
    userRegister (payload: any) {
      request({
        ...api.USER_SIGNUP,
        data: {
          email: payload.email,
          username: payload.username,
          password: payload.password,
        },
      }).then(res => {
        this.userLoginSuccess(res)
        request({
          ...api.USER_INFO_ME,
          params: { populate: ['role'] },
        }).then(res2 => {
          this.updateUser(res2)
        })
      }).catch(() => {
        this.showSnackbar({ text: '注册失败', color: 'error' })
      })
    },
    userLogin (payload: any) {
      request({
        ...api.USER_LOGIN,
        data: {
          identifier: payload.identifier,
          password: payload.password,
        },
      }).then(res => {
        this.userLoginSuccess(res)
        request({
          ...api.USER_INFO_ME,
          params: { populate: ['role'] },
        }).then(res2 => {
          this.updateUser(res2)
        })
      }).catch(() => {
        this.showSnackbar({ text: '登录失败', color: 'error' })
      })
    },
    userChangePassword (payload: any) {
      request({
        ...api.CHANGE_PASSWORD,
        data: {
          currentPassword: payload.currentPassword,
          password: payload.password,
          passwordConfirmation: payload.passwordConfirmation,
        },
      }).then(res => {
        message.success('修改密码成功！')
        this.userLoginSuccess(res)
      })
    },
    userLoginSuccess (payload: any) {
      this.token = payload.jwt
      this.user.id = payload.user.id
      this.user.username = payload.user.username
      this.user.email = payload.user.email
      if (payload.user.avatar) {
        this.user.avatar = payload.user.avatar.url
      }
      this.user.locations = payload.user.locations
      this.user.role = payload.user.role
      this.user.customer = payload.customer
      localStorage.setItem(TokenKey, payload.jwt)
      router.replace('/')
      console.log('登录成功')
      this.showSnackbar({ text: '登录成功', color: 'success' })
    },
    async uploadFile (files: File | File[]) {
      const formData = new FormData()
      if (_.isArray(files)) {
        for (const file of files) {
          formData.append('files', file)
        }
      } else {
        formData.append('files', files)
      }
      try {
        return await request({
          ...api.UPLOAD,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          message.error(error.message)
        } else {
          message.error('Unexpected error')
        }
      }
    },
    initCart () {
      const saved = localStorage.getItem('cartItems')
      if (saved) {
        this.cartItems = JSON.parse(saved)
      }
    },
    clearCart () {
      this.cartItems = {}
      localStorage.removeItem('cartItems')
    },
    updateCartItems (payload: any) {
      this.cartItems = payload
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems))
    },
  },
})
