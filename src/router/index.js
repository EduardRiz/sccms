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
        if (!response.user || !response.user.username) {
          next('/login');
        } else {
          try {
            if (store.state.user.sessionData.rules.role || to.meta.user) next();
          } catch (error) {
            console.log(error)
          }
        }
      }).catch(() => {
        if (from != "/login") next('/login');
      });
    } else {
      try {
        if (store.state.user.sessionData.rules.role || to.meta.user) next();
      } catch (error) {
        console.log(error)
      }
    }
  } else {
    next();
  }
})

export default router