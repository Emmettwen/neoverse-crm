import type { Address } from '@/utils/interface'
import api from '@/utils/api'
import request from '@/utils/request'

export const createAddress = async (address: Address) => {
  return await request({
    ...api.address.create,
    data: {
      data: address,
    },
  })
}
