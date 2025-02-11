import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '../views/Home.vue'
import Product from '@/views/Product.vue'
import Search from '@/views/Search.vue'
import Cart from '@/views/Cart.vue'
import SignUp from '@/views/SignUp.vue'
import LogIn from '@/views/LogIn.vue'
import MyAccount from '@/views/MyAccount.vue'
import Checkout from '@/views/Checkout.vue'
import Success from '@/views/Success.vue'


const routes = [

  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/:category_slug/:product_slug/',
    name: 'Product',
    component: Product
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/cart/checkout',
    name: 'Checkout',
    component: Checkout,
    meta:{
        requireAuth: true
    }
  },
  {
    path: '/my-account',
    name: 'MyAccount',
    component: MyAccount,
    meta:{
        requiresAuth: true
    }
  },
  {
    path: '/cart/success',
    name: 'Success',
    component: Success
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next)=>{
    // if (to.matched.some(record => record.meta.requiredLogin) && !store.state.isAuthenticated){
    const isAuthenticated = store.getters.isAuthenticated;
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({name: 'Login', query: {to: to.path}});
    } else{
        next()
    }
})

export default router
