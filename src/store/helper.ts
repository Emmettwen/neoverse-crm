import type { Rate } from '@/utils/interface'
import { defineStore } from 'pinia'
import api from '@/utils/api'
import request from '@/utils/request'

export const useHelperStore = defineStore('helper', {
  state: () => ({
    currencyRate: [] as Rate[],
    displayRate: {
      locale: 'ru-RU',
      currency: 'RUB',
      rate: 1,
    },
  }),
  getters: {
    getMainRate: state => {
      return state.currencyRate.filter(rate => {
        return rate.to === 'CNY' || rate.to === 'USD' || rate.to === 'EUR'
      })
    },
  },
  actions: {
    loadCurrency () {
      request({
        ...api.exchange.list,
        params: {
          filters: {
            from: 'RUB',
            to: {
              $in: ['USD', 'CNY', 'EUR'],
            },
          },
          pagination: {
            pageSize: 50,
          },
        },
      }).then(res => {
        this.currencyRate = res.data
      })
    },
  },
})
