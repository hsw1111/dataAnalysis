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
import vuescroll from 'vue-scroll'
import 'minireset.css'
import 'iview/dist/styles/iview.css';
import router from './router/index.js'
import './my-theme/index.less';
import * as types from './store/types'
Vue.use(iView)
Vue.use(vuescroll)
Vue.prototype.axios = axios
let token = window.localStorage.getItem('token')
let userInfo = window.localStorage.getItem('userInfo')
let authList = window.localStorage.getItem('authList')
//页面刷新时，重新赋值token
if (token) {
    store.commit(types.LOGIN, token)
    store.commit(types.ADD_MENU, authList)
    store.commit(types.GET_USER,JSON.parse(userInfo))
    router.addRoutes(store.state.menus.items)
}

router.beforeEach((route,redirect,next) => {
    if(route.path === '/login'){
        window.localStorage.clear()
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('userInfo')
        store.commit(types.GET_USER,{})
        store.commit(types.LOGIN,'')
        store.commit(types.ADD_MENU, null)
    }
    let accessToken = window.localStorage.getItem('token')
    if(!accessToken&&route.path!=='/login'){
        next({path:'/login'})
    }else{
        if(route.name){
            next()
        }else{
            next({
                path:'/index/orderAllData'
            })
        }
    }
})
var vm = new Vue({
    el:"#app",
    store,
    router,
    render: h => h(app),
    methods:{
       checkoutSession(){
        this.axios.get('/beefly/user/api/v1/mycenter', {
            params: {
                accessToken: this.$store.state.token
            }
        })
        .then( (res) => {
            console.log('checkoutSession---------------',res)
            var message = (res.data).message
            if (message == '用户登录超时') {
              this.$router.push('/login')
            } else {
              return
            }
        })
        .catch( (err) => {
            console.log('11111111111111111111111',err)
        })
      }
    },
    mounted:function(){
      //  window.addEventlistener('beforeunload',this.closeWin())
     
    },
    watch: {
        '$route': 'checkoutSession'
      }
})
