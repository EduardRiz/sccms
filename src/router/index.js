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
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/groups',
    name: 'Groups',
    component: () => import('../views/Groups.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/Clients.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/clserv',
    name: 'Services',
    component: () => import('@/views/Services.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/views/Rooms.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/keys',
    name: 'Keys',
    component: () => import('@/views/BoxKeys.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/coachs',
    name: 'Coachs',
    component: () => import('@/views/Coachs.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/abonements',
    name: 'Abonements',
    component: () => import('@/views/Abonements.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: () => import('@/views/Workouts.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/soldabonements',
    name: 'SoldAbonements',
    component: () => import('@/views/SoldAbonements.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/regservs',
    name: 'RegisteredServices',
    component: () => import('@/views/RegisteredServices.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/regvis',
    name: 'regvis',
    component: () => import('@/views/RegisteredVisits.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/tariffs',
    name: 'Tariffs',
    component: () => import('@/views/Tariffs.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/visits',
    name: 'Visits',
    component: () => import('@/views/Visits.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/clubs',
    name: 'clubs',
    component: () => import('@/views/Clubs.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/dicts',
    name: 'Dictionaries',
    component: () => import('@/views/Dictionaries.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/logs',
    name: 'Logs',
    component: () => import("@/views/Logs.vue"),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/Login.vue"),
    meta: {
      auth: false,
      role: "USER"
    },
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(function (to, from, next) {
  if (to.meta.auth) {
    if (store.state.session.sessionData == null) {
      api.ping().then(response => {
        store.state.session.sessionData = response;
        if (!response.user) {
          next('/login');
        } else {
          try {
            //console.log(store.state.user.sessionData.group.role, to.meta.role)
            if (api.testRoles(to.meta.role)) next();
          } catch (error) {
            console.log(error)
          }
        }
      }).catch(() => {
        if (from != "/login") next('/login');
      });
    } else {
      try {
        //console.log(store.state.user.sessionData.group.role, to.meta.role)
        if (api.testRoles(to.meta.role)) next();
      } catch (error) {
        console.log(error)
      }
    }
  } else {
    next();
  }
})

export default router