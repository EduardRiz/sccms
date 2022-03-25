import Vue from 'vue'
import Vuex from 'vuex'
import User from './user.js'
import Session from './session.js'
import Group from './group.js'
//import Clients from './clients.js'
import Rooms from './rooms.js'
import Coachs from './coachs.js'
import Abonements from './abonements.js'
import Service from './service.js'
import Workouts from './workout.js'
//import SoldAbonements from './sold_abonements.js'
//import RegisteredServices from './registered_services.js'
//import RegisteredVisits from './registered_visits.js'
import Dicts from './dictionaries.js'
import Tariffs from './tariffs.js'
import SystemVars from './sysvars.js'
import Keys from './keys.js'
import Clubs from './clubs.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users: User,
    session: Session,
    groups: Group,
    //clients: Clients,
    rooms: Rooms,
    coachs: Coachs,
    abonements: Abonements,
    workouts: Workouts,
    //soldabonements: SoldAbonements,
    //regvisits: RegisteredVisits,
    //regservices: RegisteredServices,
    services: Service,
    dicts: Dicts,
    tariffs: Tariffs,
    clubs: Clubs,
    keys: Keys,
    sysvars: SystemVars
  }
})