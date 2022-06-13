//import api from '@/api.js'

//const apiBase = "/";
const state = {
    colors: [],
}

const getters = {
    colors: state => {
        return state.colors;
    },
    isColors: state => {
        return state.colors.length;
    },
    nextcolor: state => () => {
        try {
            return state.colors[Math.floor(Math.random() * state.colors.length)];
        } catch (error) {
            console.log(error)
            return "";
        }
    }
}
const actions = {
    LOAD_COLORS: function (context) {
        fetch("/colors.json")
        .then((r) => r.json())
        .then((d) => {
            context.commit("setColors", d);
        });
    },
}
const mutations = {
    setColors: (state, payload) => {
        state.colors = [...payload];
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