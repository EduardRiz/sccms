import api from '@/api.js'

const apiBase = "cms/abonements";
const state = {
    items: [],
    tags: []
}

const getters = {
    items: state => {
        return state.items;
    },
    tariffed: state => {
        return state.items.filter(e => e.tariffs!=null && e.tariffs.length && e.info.status=="OK");
    },
    tags: state => {
        return state.tags;
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
        const tags = payload.info.tags;
        if (tags && tags.length) payload.tagsStr = tags.join(",");
        api.apiPostRequest(apiBase, payload).then(response => {
            if (response) {
                // for transit created
                response.audit.created = response.audit.created ? response.audit.created : payload.audit.created;
                context.commit("saveItem", response);
            }
        });
    },
    DELETE: function (context, payload) {
        api.apiDeleteRequest(apiBase + "/" + payload).then(response => {
            console.log(response)
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
            api.updateTags(state);
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
        api.updateTag(state, payload);
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