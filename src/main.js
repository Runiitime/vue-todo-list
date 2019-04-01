import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/css/style.css'

import Components from '@/components/index.js'

Vue.use(BootstrapVue)

Components.forEach(component => {
	Vue.component(component.name, component)
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
