import api from '@/api.js'

const state = {
    sessionData: null,
    connected: false,
    socket: null,
}

const getters = {
    // SESSSION 
    isLogged: state => {
        try {
            return state.sessionData.group.role && state.sessionData.club.idx;
        } catch (error) {
            return false;
        }
    },
    isConnected: state => {
        try {
            return state.connected;
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
    services: state => {
        try {
            return state.sessionData.club.services;
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
    scidx: state => {
        try {
            return state.sessionData.club.idx;
        } catch (error) {
            return null;
        }
    },
    role: state => {
        try {
            return state.sessionData.group.role;
        } catch (error) {
            return null;
        }
    },
    testUser: state => {
        return (idx) => {
            try {
                return state.sessionData.user.idx == idx;
            } catch (error) {
                return false;
            }
        }
    },
    testPowerUser: state => {
        try {
            return ["ADMIN", "POWERUSER"].indexOf(state.sessionData.group.role) != -1;
        } catch (error) {
            return false;
        }
    },
    testAdmin: state => {
        try {
            return state.sessionData.group.role == "ADMIN";
        } catch (error) {
            return false;
        }
    },
    testClub: state => {
        return (idx) => {
            try {
                return state.sessionData.club.idx == idx;
            } catch (error) {
                return false;
            }
        }
    },
    testWsid: state => {
        return (idx) => {
            try {
                return state.sessionData.ws.wsid == idx;
            } catch (error) {
                return false;
            }
        }
    },
    testClubService: state => {
        return (idx) => {
            try {
                return state.sessionData.club.services.indexOf(idx) != -1;
            } catch (error) {
                return false;
            }
        }
    },
    isAutocard: state => {
        try {
            return state.sessionData.ws.card;
        } catch (error) {
            return false;
        }
    },
    testAutocard: state => {
        return (card) => {
            try {
                return state.sessionData.ws.card == card;
            } catch (error) {
                return false;
            }
        }
    }
}
const actions = {
    LOGIN: async function (context, payload) {
        let vm = payload.__vm;
        payload.pars.pass = vm.$CryptoJS.enc.Base64.stringify(vm.$CryptoJS.SHA256(payload.pars.pass));
        try {
            const result = await api.login(payload.pars);
            if (result.user) {
                context.commit('setUser', {
                    ...result
                });
                return true;
            }
        } catch (e) {
            if (e.response && e.response.status == 511) throw vm.$t("error.accessToken");
        }
        context.commit('clearUser');
        throw vm.$t("error.login");
    },
    LOGOUT: async function (context, vm) {
        try {
            await api.logout();
            context.commit('clearUser');
            vm.$router.push("login", () => {
                //location.reload();
            });
        } catch (e) {
            console.log(e);
        }
    },
    REFRESHCLUB: function (context) {
        try {
            api.refreshSessionClub().then(r => {
                context.commit('setClub', r);
            });
        } catch (e) {
            console.log(e);
        }

    }
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
    setClub: (state, payload) => {
        try {
            state.sessionData.club = {
                ...payload
            };
        } catch (e) {
            console.log(e)
            state.sessionData = null;
        }

    },
    clearUser: (state) => {
        state.sessionData = null;
    },
    setConnected: (state, payload) => {
        state.connected = payload
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