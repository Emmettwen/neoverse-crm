// composables/useUpload.ts
import { ref } from 'vue'
import api from '@/utils/api'
import request from '@/utils/request'

export function useUpload () {
  const progresses = ref<Record<string, number>>({})

  async function uploadFiles (
    files: File | File[],
    options?: { showProgress?: boolean },
  ) {
    const fileArray = Array.isArray(files) ? files : [files]
    if (options?.showProgress) {
      for (const file of fileArray) {
        (progresses.value[file.name] = 0)
      }
    }

    const promises = fileArray.map(file => {
      const formData = new FormData()
      formData.append('files', file)

      // @ts-ignore
      return request({
        ...api.UPLOAD,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: options?.showProgress
          ? (e: ProgressEvent) => {
              if (e.lengthComputable) {
                progresses.value[file.name] = Math.round((e.loaded / e.total) * 100)
              }
            }
          : undefined,
      }).then(res => ({
        name: file.name,
        // @ts-ignore
        result: res[0],
      }))
    })

    return await Promise.all(promises)
  }

  async function deleteFile (id: number) {
    return await request({
      ...api.DELETE_FILE(id),
    })
  }

  return { uploadFiles, progresses, deleteFile }
}
