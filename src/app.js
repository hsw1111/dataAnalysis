// import Vue from 'vue'
// import app from './app.vue'
// import iView from 'iview';
// import 'minireset.css'
// import 'iview/dist/styles/iview.css';
// import './my-theme/index.less';
// import router from './router/index.js'
// Vue.use(iView)
// var vm = new Vue({
//     el:"#app",
//     router,
//     render: h => h(app)
// })
import Vue from 'vue'
import app from './app.vue'
import axios from  './api/axios_api.js'
import store from './store/store.js'
import iView from 'iview';
import 'minireset.css'
import 'iview/dist/styles/iview.css';
import router from './router/index.js'
import './my-theme/index.less';
import * as types from './store/types'
Vue.use(iView)

Vue.prototype.axios = axios
let token = window.sessionStorage.getItem('token')

//页面刷新时，重新赋值token
if (token) {
    store.commit(types.LOGIN, token)
    store.commit(types.ADD_MENU, token)
    router.addRoutes(store.state.menus.items)
}

router.beforeEach((route,redirect,next) => {
    if(route.path === '/login'){
        window.sessionStorage.removeItem('token')
        store.commit(types.LOGIN,'')
        store.commit(types.ADD_MENU, null)
    }
    let accessToken = window.sessionStorage.getItem('token')
    if(!accessToken&&route.path!=='/login'){
        next({path:'/login'})
    }else{
        if(route.name){
            next()
        }else{
            next({
                path:'/nofound'
            })
        }
    }
})
var vm = new Vue({
    el:"#app",
    store,
    router,
    render: h => h(app)
})
