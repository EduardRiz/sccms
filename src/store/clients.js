import api from '@/api.js'

function updateTags(state) {
    try {
        state.items.forEach((e) => {
            if (e.info.tags) {
                state.tags = state.tags.concat(e.info.tags);
            }
        });
    } catch (error) {
        console.log(error);
    }
    state.tags = state.tags.filter((value, index, self) => {
        return self.indexOf(value) === index;
    }).sort();
}

function updateTag(state, item) {
    try {
        if (!item.info.tags) return;
        item.info.tags.forEach((e) => {
            if (state.tags.indexOf(e) != -1) return;
            state.tags.push(e);
        });
    } catch (error) {
        console.log(error);
    }
    state.tags = state.tags.filter((value, index, self) => {
        return self.indexOf(value) === index;
    }).sort();
}


const apiBase = "cms/clients";
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
        return new Promise((resolve) =>{
            api.apiPostRequest(apiBase, payload).then(response => {
                if (response) {
                    // for transit created
                    response.audit.created = response.audit.created ? response.audit.created : payload.audit.created;
                    context.commit("saveItem", response);
                    resolve(response)
                }
            });
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
        } else if(!payload.empty) {
            state.items = [...payload.content];
            updateTags(state);
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
        updateTag(state, payload);
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