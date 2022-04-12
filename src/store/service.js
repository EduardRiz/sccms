import api from '@/api.js'

const apiBase = "cms/clservs";
const state = {
    items: [],
    tags: []
}

const getters = {
    items: state => {
        return state.items;
    },
    tags: state => {
        return state.tags;
    },
    tariffed: state => {
        return state.items.filter(e => e.tariffs != null && e.tariffs.length && e.info.status == "OK");
    },
    isItems: state => {
        return state.items.length;
    },
    list: state => {
        return (idxlist) => {
            const o = state.items.filter(e => {
                return idxlist.indexOf(e.idx) != -1
            });
            return o ? o : [];
        }
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
        const item = payload.item;
        const tags = item.info.tags;
        if (tags && tags.length) item.tagsStr = tags.join(",");
        api.apiPostRequest(apiBase, item).then(response => {
            if (response) {
                response.audit.created = response.audit.created ? response.audit.created : item.audit.created;
                context.commit("saveItem", response);
                if(payload.isChanged){
                    context.commit("clubs/updateClubsServices", item, { root: true });
                    payload.vm.$store.dispatch("session/REFRESHCLUB");
                } 
            }
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