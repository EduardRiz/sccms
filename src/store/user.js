import api from '@/api.js'

const state = {
    sessionData: null,
    users: [],
    groups: []
}

const getters = {
    // SESSSION 
    isLogged: state => {
        return state.sessionData !== null && state.sessionData.username;
    },
    name: state => {
        return state.sessionData !== null ? state.sessionData.username : "Anonymous";
    },
    role: state => {
        try {
            return state.sessionData.rules.role;
        } catch (error) {
            return null;
        }
    },
    // OPERATIONS
    users: state => {
        return state.users;
    },
    isUsers: state => {
        return state.users.length;
    },
    user: state => {
        return (id) => {
            const o = state.users.find(e => {
                return e.idx == id
            });
            return o ? o : {};
        }
    },
    groups: state => {
        return state.groups;
    },
    isGroups: state => {
        return state.groups.length;
    },

}
const actions = {
    LOGIN: async function (context, payload) {
        let vm = payload.__vm;
        payload.pars.pass = vm.$CryptoJS.enc.Base64.stringify(vm.$CryptoJS.SHA256(payload.pars.pass));
        try {
            let result = await api.login(payload.pars);
            if (result.username) {
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
    // USERS    
    LOAD_USERS: function (context) {
        api.getUsers().then(response => {
            context.commit("setUsers", response);
        });
    },
    UPDATE_USER: function (context, payload) {
        api.updateUser(payload).then(response => {
            if (response) context.commit("updateUser", payload);
        });
    },
    DELETE_USER: function (context, payload) {
        api.deleteUser(payload.username).then(response => {
            if (response) context.commit("deleteUser", payload);
        });
    },
    // USER GROUPS   
    LOAD_GROUPS: function (context) {
        api.getGroups().then(response => {
            context.commit("setGroups", response);
        });
    },
    UPDATE_GROUP: function (context, payload) {
        api.updateGroup(payload).then(response => {
            if (response) context.commit("updateGroup", payload);
        });
    },
    DELETE_GROUP: function (context, payload) {
        api.deleteGroup(payload.groupid).then(response => {
            if (response) context.commit("deleteGroup", payload);
        });
    },


}
const mutations = {
    setUser: (state, payload) => {
        try {
            if (payload.username == undefined) {
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
    // CMS USERS
    setUsers: (state, payload) => {
        state.users = payload;
    },
    updateUser: (state, payload) => {
        const index = state.users.findIndex(e => e.username == payload.username);
        if (index == -1) {
            state.users.push({
                ...payload
            });
        } else {
            Object.assign(state.users[index], payload);
        }
    },
    deleteUser: (state, payload) => {
        const index = state.users.findIndex(e => e.username == payload.username);
        if (index == -1) return;
        state.users.splice(index, 1)
    },
    // CMS GROUPS
    setGroups: (state, payload) => {
        state.groups = payload;
    },
    updateGroup: (state, payload) => {
        const index = state.groups.findIndex(e => e.groupid == payload.groupid);
        if (index == -1) {
            state.groups.push({
                ...payload
            });
        } else {
            Object.assign(state.groups[index], payload);
        }
    },
    deleteGroup: (state, payload) => {
        const index = state.groups.findIndex(e => e.groupid == payload.groupid);
        if (index == -1) return;
        state.groups.splice(index, 1)
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