import axios from 'axios'
import Vue from 'vue'
import Vuetify from 'vuetify'

/* Import Vuetify css. */
import 'vuetify/dist/vuetify.min.css'

/* Import Material Design css. */
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import App from './App'
import router from './router'
import store from './store'

/* Initialize Electron. */
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* Initialize Vuetify. */
Vue.use(Vuetify, {
    // iconfont: ['fa', 'md', 'mdi']
    iconfont: 'fa'
    // iconfont: 'md'
})

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')
