import type { ApiNamespace } from '@/utils/api'
import type { ApiResourceConfig } from '@/utils/interface'
import _ from 'lodash'
import { onMounted, ref } from 'vue'
import api from '@/utils/api'
import { message } from '@/utils/helper.ts'
import request from '@/utils/request'

export function useTableServer<T> (namespace: ApiNamespace, populate?: string[], filters: any = ref()) {
  const items = ref<T[]>([])
  const pageSize = ref(10)
  const pageCount = ref(1)
  const search = ref('')
  const loading = ref(false)
  const totalItems = ref(0)
  const tmp = ref<any>({})
  const currentPage = ref(1)

  const loadItems = async ({ page = 1, itemsPerPage = 10, sortBy = [] } = {}) => {
    loading.value = true
    if (filters.value === undefined) {
      filters.value = {}
    }
    tmp.value = filters.value
    if (search.value.length > 0) {
      tmp.value.$or = [
        { trim: { name: { $contains: search.value } } },
        { trim: { chinese: { $contains: search.value } } },
        { trim: { model: { name: { $contains: search.value } } } },
        { trim: { model: { chinese: { $contains: search.value } } } },
        { trim: { model: { make: { name: { $contains: search.value } } } } },
        { trim: { model: { make: { chinese: { $contains: search.value } } } } },
      ]
    } else {
      delete tmp.value.$or
    }
    request({
      ...(api[namespace] as ApiResourceConfig).list,
      params: {
        populate,
        pagination: {
          page,
          pageSize: itemsPerPage,
        },
        sort: sortBy.map((sort: any) => {
          return sort.key + ':' + sort.order
        }),
        filters: tmp.value,
      },
    }).then(res => {
      if (!_.isNil(totalItems)) {
        // @ts-ignore
        totalItems.value = res.meta.pagination.total
        // @ts-ignore
        currentPage.value = res.meta.pagination.page
        // @ts-ignore
        pageCount.value = res.meta.pagination.pageCount
      }
      items.value = res.data
    }).finally(() => {
      loading.value = false
    })
  }

  const deleteItem = async (documentId: string) => {
    if (confirm('确认要删除吗？')) {
      loading.value = true
      request({
        ...(api[namespace] as ApiResourceConfig).delete(documentId),
      }).then(() => {
        message.info('删除成功')
        loadItems()
      }).finally(() => {
        loading.value = false
      })
    }
  }

  onMounted(() => loadItems({}))

  return {
    deleteItem,
    items,
    pageSize,
    search,
    loading,
    totalItems,
    loadItems,
    pageCount,
    currentPage,
  }
}
