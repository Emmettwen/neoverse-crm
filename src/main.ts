/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


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

const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
})

const app = createApp(App)

registerPlugins(app)

app.use(vPhoneInput)
app.component('VueSignaturePad', VueSignaturePad)

const store = useAppStore()
store.initCart()

app.mount('#app')
