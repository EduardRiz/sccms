import Vue from 'vue'
import VueRouter from 'vue-router'

import api from "@/api.js";
import store from "@/store/index.js"

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/Clients.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/clserv',
    name: 'Services',
    component: () => import('@/views/Services.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/views/Rooms.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/coachs',
    name: 'Coachs',
    component: () => import('@/views/Coachs.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/abonements',
    name: 'Abonements',
    component: () => import('@/views/Abonements.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: () => import('@/views/Workouts.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/soldabonements',
    name: 'SoldAbonements',
    component: () => import('@/views/SoldAbonements.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/regservs',
    name: 'RegisteredServices',
    component: () => import('@/views/RegisteredServices.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/regvis',
    name: 'RegisteredVisits',
    component: () => import('@/views/RegisteredVisits.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/dicts',
    name: 'Dictionaries',
    component: () => import('@/views/Dictionaries.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/logs',
    name: 'Logs',
    component: () => import("@/views/Logs.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/Login.vue"),
    meta: {
      auth: false,
    },
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(function (to, from, next) {
  if (to.meta.auth) {
    if (store.state.user.sessionData == null) {
      api.ping().then(response => {
        if (!response.user || !response.user.name) {
          next('/login');
        } else {
          try {
            if (store.state.user.sessionData.role || to.meta.user) next();
          } catch (error) {
            console.log(error)
          }
        }
      }).catch(() => {
        if (from != "/login") next('/login');
      });
    } else {
      try {
        if (store.state.user.sessionData.role || to.meta.user) next();
      } catch (error) {
        console.log(error)
      }
    }
  } else {
    next();
  }
})

export default router