/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap'

import VueAMapLoca from '@vuemap/vue-amap-loca'
import { createVPhoneInput } from 'v-phone-input'
// Composables
import { createApp } from 'vue'
// @ts-ignore
import { VueSignaturePad } from 'vue-signature-pad'
// Plugins
import { registerPlugins } from '@/plugins'
import { useAppStore } from '@/store/app'
// Components
import App from './App.vue'
// import VueAMapExtra from '@vuemap/vue-amap-extra';
import '@vuemap/vue-amap/dist/style.css'

import 'flag-icons/css/flag-icons.min.css'

import 'v-phone-input/dist/v-phone-input.css'

initAMapApiLoader({
  key: 'b8d83f0fc7e8dc1f0b1ce87cdc14211b',
  securityJsCode: '4fae6c4445f118687b36bdcc1b25e880', // 新版key需要配合安全密钥使用
  Loca: {
    version: '2.0.0',
  },
})

const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
})

const app = createApp(App)

registerPlugins(app)

app.use(vPhoneInput)
app.component('VueSignaturePad', VueSignaturePad)
app.use(VueAMap)
app.use(VueAMapLoca)

const store = useAppStore()
store.initCart()

app.mount('#app')
