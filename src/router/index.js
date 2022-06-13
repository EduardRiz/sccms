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
    path: '/chome/:idx',
    name: 'ClientHome',
    component: () => import('../views/ClientHome.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/anonymhome',
    name: 'AnonymClientHome',
    component: () => import('../views/AnonymClientHome.vue'),
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
      role: "ADMIN",
      auth: true,
    },
  },
  {
    path: '/actlog',
    name: 'Activity',
    component: () => import('../views/ActivityLog.vue'),
    meta: {
      role: "ADMIN",
      auth: true,
    },
  },
  {
    path: '/workstations',
    name: 'Workstations',
    component: () => import('../views/Workstations.vue'),
    meta: {
      role: "ADMIN",
      auth: true,
    },
  },
  {
    path: '/groups',
    name: 'Groups',
    component: () => import('../views/Groups.vue'),
    meta: {
      role: "ADMIN",
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
    path: '/keys/free',
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
    path: '/todaywo',
    name: 'TodayWo',
    component: () => import('@/views/TodayWo.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/soldabonements',
    name: 'SoldAbonements',
    component: () => import('@/views/Sales.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/regservs',
    name: 'regservs',
    component: () => import('@/views/ClientServices.vue'),
    meta: {
      role: "USER",
      auth: true,
    },
  },
  {
    path: '/regvis',
    name: 'regvis',
    component: () => import('@/views/UsedServices.vue'),
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
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
    meta: {
      role: "POWERUSER",
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
    name: 'Dicts',
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
      role: "ADMIN",
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
    if (!api.isLogged()) {
      api.ping().then(response => {
        store.state.session.sessionData = response;
        if (!api.isLogged()) {
          if (from != "/login") next('/login');
        } else {
          try {
            //console.log(store.state.user.sessionData.group.role, to.meta.role)
            if (api.testRoles(to.meta.role)) next();
          } catch (error) {
            console.log(error)
            if (from != "/login") next('/login');
          }
        }
      }).catch((error) => {
        console.log(error)
        if (from != "/login") next('/login');
      });
    } else {
      try {
        //console.log(store.state.session.sessionData.group.role, to.meta.role)
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