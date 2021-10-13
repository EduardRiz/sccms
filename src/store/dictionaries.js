import api from '@/api.js'

const apiBase = "cms/dicts";
const state = {
    items: [],
    tags: []
}

const getters = {
    items: state => {
        return state.items;
    },
    isItems: state => {
        return state.items.length;
    },
    item: state => {
        return (id) => {
            const o = state.items.find(e => {
                return e.idx == id
            });
            return o ? o : {};
        }
    },
}
const actions = {
    LOAD: function (context) {
        api.apiGetRequest(apiBase).then(response => {
            context.commit("setItems", response);
        });
    },
    LOAD_BY_ID: function (context, payload) {
        api.apiGetRequest(apiBase + "/" + payload).then(response => {
            context.commit("setItems", response);
        });
    },
    SAVE: function (context, payload) {
        return new Promise((resolve) => {
            api.apiPostRequest(apiBase, payload).then(response => {
                if (response) {
                    context.commit("saveItem", response);
                    resolve(response)
                }
            });
        });
    },
    DELETE: function (context, payload) {
        api.apiDeleteRequest(apiBase + "/" + payload).then(response => {
            if (response) context.commit("deleteItem", payload);
        });
    },
}
const mutations = {
    setItems: (state, payload) => {
        if (payload.cause) {
            state.items = [];
            api.showMessage(payload.message, true);
        } else {
            state.items = [...payload];
        }
    },
    saveItem: (state, payload) => {
        const index = state.items.findIndex(e => e.idx == payload.idx);
        if (index == -1) {
            state.items.push({
                ...payload
            });
        } else {
            Object.assign(state.items[index], payload);
        }
    },
    deleteItem: (state, payload) => {
        const index = state.items.findIndex(e => e.idx == payload);
        if (index == -1) return;
        state.items.splice(index, 1)
    },
}

const Data = {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
}

export default Data;