<script setup lang="ts">
  import type { Contract } from '@/utils/interface'
  import Editor from '@tinymce/tinymce-vue'
  import dayjs from 'dayjs'
  import { saveAs } from 'file-saver'
  import PDF from 'pdf-vue3'
  import { computed, ref } from 'vue'
  import api from '@/utils/api'
  import { dataURItoBlob, message } from '@/utils/helper'
  import { useTableServer } from '@/utils/hooks'
  import request from '@/utils/request'
  import { tp } from '@/utils/template'

  const props = defineProps({
    orderId: String,
    orderName: String,
    customerName: String,
  })
  const emit = defineEmits(['reloadOrder'])
  const filters = computed(() => {
    return { order: { documentId: props.orderId } }
  })
  const {
    items,
    pageSize,
    loading,
    totalItems,
    loadItems,
  } = useTableServer<Contract>('contract', [], filters)
  let temp = tp
  const templates = ref([
    { id: 1, name: '标准合同' },
  ])
  const template = ref(null)
  const customerAddress = ref('')
  const customerEmail = ref('')
  const dateModal = ref(false)
  const contractDate = ref()
  const contractContent = ref('')
  const previewContent = ref('')
  const previewDialog = ref(false)
  const initConfigData = ref<any>({
    height: 800,
    license_key: 'gpl',
    plugins: 'image lists advlist table template',
    toolbar: 'fontsizeselect fontselect | undo redo | table | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link template',
    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    style_formats: [
      {
        title: 'first line indent',
        selector: 'p',
        styles: { 'text-indent': '2em' },
      },
    ],
    table_default_styles: {
      width: '100%',
      border: '1',
    },
    templates: [],
  })
  initConfigData.value.templates = [{ title: '基础模板', description: '基础模板', content: tp }]
  const editorKey = ref(1)
  const templateEditor = ref(null)
  const headers = ref([
    { title: '名称', key: 'filename', sortable: false },
    { title: '客户邮箱', key: 'customer_email', sortable: false },
    { title: '日期', key: 'createdAt', sortable: false },
    { title: '操作', key: 'actions', sortable: false },
  ])
  const contractDateDisplay = computed(() => {
    return contractDate.value ? dayjs(contractDate.value).format('YYYY-MM-DD') : null
  })

  const canAddNew = computed(() => {
    let can = true
    for (const item of items.value) {
      if (!item.deprecated) {
        can = false
      }
    }
    return can
  })
  const applyTemplate = () => {
    temp = temp.replaceAll(new RegExp(String.raw`\{\$customer_name\}`, 'g'), props.customerName as string)
    temp = temp.replaceAll(new RegExp(String.raw`\{\$customer_address\}`, 'g'), customerAddress.value)
    temp = temp.replaceAll(new RegExp(String.raw`\{\$date\}`, 'g'), contractDateDisplay.value as string)
    // templateEditor.value.setContent(temp);
    contractContent.value = temp
    editorKey.value++
  }
  const pdfData = ref('')
  const generatePreview = () => {
    request({
      ...api.contract.preview,
      data: {
        html: contractContent.value,
        name: props.customerName,
      },
    }).then(res => {
      // @ts-ignore
      previewContent.value = 'data:application/pdf;base64,' + res.ok
      pdfData.value = previewContent.value
      previewDialog.value = true
    }).finally(() => {})
  }
  const exportPDF = () => {
    const fileBlob = dataURItoBlob(pdfData.value)
    saveAs(fileBlob, 'preview.pdf')
  }
  const saveAndSend = async () => {
    try {
      const result = await request({
        ...api.contract.create,
        data: {
          data: {
            signed: false,
            content: contractContent.value,
            order: props.orderId,
            filename: props.orderName + '-' + Date.now(),
          },
        },
      })
      await loadItems({})
    } catch {
      message.error('创建错误')
    }
  }

  const download = (id: string) => {
    request({
      // @ts-ignore
      ...api.contract.download(id),
    }).then(res => {
      // @ts-ignore
      previewContent.value = 'data:application/pdf;base64,' + res.fileData
      pdfData.value = previewContent.value
      exportPDF()
    })
  }

  const discardContract = (id: string) => {
    if (confirm('您确认要作废此份合同吗？')) {
      request({
        // @ts-ignore
        ...api.contract.discard(id),
      }).then(() => {
        message.success('合同作废成功')
        loadItems({})
      })
    }
  }
</script>

<template>
  <h1>签署合同</h1>
  <template v-if="items.length > 0">
    <v-data-table-server
      v-model:items-per-page="pageSize"
      disable-sort
      :headers="headers"
      class="mb-2"
      hide-default-footer
      density="comfortable"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      @update:options="loadItems"
    >
      <template #[`item.filename`]="{item}">
        <span :class="item.deprecated?'text-decoration-line-through': ''">{{ item.filename }}</span>
      </template>
      <template #[`item.createdAt`]="{item}">
        {{ dayjs(item.createdAt).tz('Asia/Shanghai').format('DD/MM/YYYY HH:mm:ss') }}
      </template>
      <template #[`item.actions`]="{item}">
        <v-btn
          color="error"
          :disabled="item.deprecated"
          icon="mdi-delete"
          size="small"
          variant="text"
          @click="discardContract(item.documentId)"
        />
        <v-btn
          color="success"
          :disabled="item.deprecated"
          icon="mdi-check"
          size="small"
          variant="text"
        />
        <v-btn
          :disabled="item.deprecated"
          icon="mdi-download"
          size="small"
          variant="text"
          @click="download(item.documentId)"
        />
      </template>
    </v-data-table-server>
  </template>
  <template v-if="canAddNew">
    <v-select
      v-model="template"
      density="comfortable"
      item-title="name"
      item-value="id"
      :items="templates"
      label="选择模板"
      return-object
    />
    <v-row v-if="template" align="center">
      <v-col cols="12" lg="3" md="4" sm="6">
        <v-text-field
          dense
          density="comfortable"
          label="买方名称"
          :model-value="props.customerName"
          prepend-icon="mdi-account"
          required
        />
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-text-field
          v-model="customerAddress"
          dense
          density="comfortable"
          label="买方地址"
          prepend-icon="mdi-map-marker"
          required
        />
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-text-field
          v-model="contractDateDisplay"
          :active="dateModal"
          density="comfortable"
          :focused="dateModal"
          label="合同日期"
          outlined
          placeholder="请选择合同日期"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
        >
          <v-dialog
            v-model="dateModal"
            activator="parent"
            width="auto"
          >
            <v-date-picker
              v-if="dateModal"
              v-model="contractDate"
            />
          </v-dialog>
        </v-text-field>
      </v-col>
      <v-col class="text-right" cols="12">
        <v-btn color="primary" prepend-icon="mdi-file-sign" @click="applyTemplate">生成合同</v-btn>
        <v-btn class="ml-2" color="primary" prepend-icon="mdi-file-eye-outline" @click="generatePreview">
          生成预览
        </v-btn>
        <v-btn class="ml-2" color="primary" prepend-icon="mdi-email-fast-outline" @click="saveAndSend">
          发送合同
        </v-btn>
      </v-col>
      <v-col cols="12">
        <Editor
          :key="editorKey"
          v-model="contractContent"
          api-key="n3v708fx40vkcbi5mwwj46zb0nczzq9f5y42jhdxetdwxbhq"
          :init="initConfigData"
        />
        <v-dialog v-model="previewDialog" max-width="800" scrollable>
          <v-card>
            <v-toolbar>
              <v-toolbar-title>合同预览</v-toolbar-title>
              <v-spacer />
              <v-btn icon="mdi-download" @click="exportPDF" />
              <v-btn icon="mdi-close" @click="previewDialog = false;" />
            </v-toolbar>
            <v-card-text>
              <PDF :src="previewContent" />
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="previewDialog = false;">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </template>

</template>

<style scoped>

</style>
