//import index from '../view/index/index.vue'

//import Login from '../view/login/index.vue'
const Login = resolve => require.ensure([], () => resolve(require('../view/login/index.vue')), 'Login')
//import NotFoundPage from '../view/nofound/index.vue'
import MenuModule from '../store/modules/menuModule.js'
let routes = [
    {
        path:'/login',
        component:Login,
        name:'登录'
    },
    // {
    //     path: '/',
    //     component: index,
    //     children:[
    //         {
    //             path: '/nofound',
    //             component: NotFoundPage,
    //             name:'notfound'
    //         }
    //     ]
    // },
    // ...generateRoutesFromMenu(MenuModule.state.items)
]

function generateRoutesFromMenu(menu = [], routes = []){
    // console.log("menu", menu)
    // console.log("routes", routes)
    return routes
 }
 
export default routes;
