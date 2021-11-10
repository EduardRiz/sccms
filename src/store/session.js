import api from '@/api.js'

const state = {
    sessionData: null,
}

const getters = {
    // SESSSION 
    isLogged: state => {
        try {
            return state.sessionData.group && state.sessionData.user;
        } catch (error) {
            return false;
        }
    },
    username: state => {
        try {
            return state.sessionData.user.user;
        } catch (error) {
            return "anonim";
        }
    },
    name: state => {
        try {
            return state.sessionData.user.info.name;
        } catch (error) {
            return "noname";
        }
    },
    scname: state => {
        try {
            return state.sessionData.club.info.name;
        } catch (error) {
            return "";
        }
    },
    role: state => {
        try {
            return state.sessionData.group.role;
        } catch (error) {
            return null;
        }
    },
}
const actions = {
    LOGIN: async function (context, payload) {
        let vm = payload.__vm;
        payload.pars.pass = vm.$CryptoJS.enc.Base64.stringify(vm.$CryptoJS.SHA256(payload.pars.pass));
        try {
            const result = await api.login(payload.pars);
            if (result.user) {
                context.commit('setUser', {
                    ...result,
                });
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        context.commit('clearUser');
        throw vm.$t("error.login");
    },
    LOGOUT: async function (context) {
        try {
            await api.logout();
            context.commit('clearUser');
        } catch (e) {
            console.log(e);
        }
    },
}
const mutations = {
    setUser: (state, payload) => {
        try {
            if (payload.user == undefined) {
                state.sessionData = null;
            } else {
                state.sessionData = payload;
            }
        } catch (e) {
            state.sessionData = null;
        }
    },
    clearUser: (state) => {
        state.sessionData = null;
    },
}

const User = {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
}

export default User;