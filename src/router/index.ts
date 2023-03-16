import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/authStore'

// dynamically load component when its needed, which will load a chunk file
const Home = () => import('@/views/Home.vue')
const Song = () => import('@/views/Song.vue') 
const About = () => import('@/views/About.vue')
const Manage = () => import('@/modules/manage/views/Manage.vue') 

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    // // route level code-splitting
    // // this generates a separate chunk (about.[hash].js) for this route
    // // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/manage',
    // alias: '/manage-music', // additional path
    name: 'manage',
    component: Manage,
    // beforeEnter(to, from, next) {
    //   console.log("Manage Route Guard");
    //   next();
    // },
    meta: {
      requiresAuth: true, // weather a route requires authentication
    }
  },
  // {
  //   path: '/manage-music',
  //   redirect: { name: 'manage' },
  // },
  {
    name: 'song',
    path: '/song/:id',
    component: Song
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'text-yellow-500',
})

// Navigation guard: check every request before responding
router.beforeEach((to, from, next) => {
  // check if the current route do not requires authentication
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const authStore = useAuthStore()

  if (authStore.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
