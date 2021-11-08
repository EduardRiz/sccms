import axios from "axios";
import store from "@/store/index.js"
const API = process.env.NODE_ENV == "development" ? "https://192.168.112.114:5678/scapi" : "https://service.elektroniskaskartes.lv/scapi";

const posapi = axios.create({
    crossDomain: true,
    withCredentials: true,
    baseURL: API,
});
const api = {
    api: API,
    ping() {
        return new Promise((resolve, reject) => {
            this.apiGetRequest("ping").then(response => {
                this.$vm.$store.commit("session/setUser", response)
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    publicImgLink(img, def) {
        return this.api + '/img/' + (!img && def ? "default-avatar.jpg" : img);
    },
    imageClientLink(idx) {
        return this.api + '/operator/image?path=images/client&idx=' + idx + '.jpg';
    },
    login(data) {
        return this.apiPostRequest("login", data);
    },
    logout() {
        return this.apiPostRequest("logout");
    },
    // HOME PAGE
    addService2client(data) {
        return this.apiPostRequest("operator/buy/service", data);
    },
    addAbonement2client(data) {
        return this.apiPostRequest("operator/buy/abonement", data);
    },
    registerVisit2client(idx, key, data) {
        return this.apiPostRequest("operator/client/visit/" + idx, {
            services: data,
            key: key
        });
    },
    registerClientOut(client, key) {
        return this.apiPostRequest("operator/client/out", {
            client: client,
            key: key
        });
    },
    getClientById(idx) {
        return this.apiGetRequest("operator/client/id/" + idx);
    },
    getClientServices(idx) {
        return this.apiGetRequest("operator/client/services/" + idx);
    },
    getRegisteredClientServices(idx) {
        return this.apiGetRequest("operator/client/regservs/" + idx);
    },
    getAvailableWorkouts(service) {
        return this.apiGetRequest("operator/client/workouts/" + service);
    },
    getAvailableKeys() {
        return this.apiGetRequest("operator/boxkey/available");
    },
    searchOpenedVisitsByBoxKey(pattern) {
        return this.apiGetRequest("operator/visits/opened/", {
            pattern: pattern
        });
    },
    loadVisits() {
        return this.apiGetRequest("operator/visits/select");
    },
    closeVisit(idx) {
        return this.apiPostRequest("operator/visits/close/" + idx);
    },
    searchClient(pattern) {
        return this.apiGetRequest("operator/client/search", {
            pattern: pattern
        });
    },
    saveImage(data, file) {
        return this.apiMultipartPostRequest("operator/file/save/" + data.idx, data, file);
    },
    getImage(dir, idx) {
        return this.apiGetRequest("operator/image", {
            path: dir,
            idx: idx + ".jpg"
        });
    },
    //USERS
    // getUsers() {
    //     return this.apiGetRequest("cms/users/select");
    // },
    // updateUser(data) {
    //     return this.apiPostRequest("cms/users/save", data);
    // },
    // deleteUser(username) {
    //     return this.apiPostRequest("cms/users/delete/" + username);
    // },
    // USER GROUPS
    // getGroups() {
    //     return this.apiGetRequest("cms/groups/select");
    // },
    // updateGroup(data) {
    //     return this.apiPostRequest("cms/groups/save", data);
    // },
    // deleteGroup(username) {
    //     return this.apiPostRequest("cms/groups/delete/" + username);
    // },

    //LOG FUNCTIONAL
    getServerLog(file) {
        return this.apiGetRequest("cms/log/load", {
            file: file
        });
    },
    loadLogsFiles() {
        return this.apiGetRequest("cms/log/files");
    },


    apiMultipartManyPostRequest(uri, data, file, pars) {
        if (typeof pars == "undefined" || pars == null) pars = {};
        if (typeof data == "undefined") data = null;
        let formdata = new FormData();
        formdata.append("data", JSON.stringify(data));
        if (file) {
            for (let k in file) {
                formdata.append("file", file[k], k);
            }
        }
        pars.prevcache = new Date().getTime();
        return new Promise((resolve, reject) => {
            posapi.post(uri, formdata, {
                params: pars,
                withCredentials: true,
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.baseReject(error);
                reject(error);
            });
        })
    },
    apiMultipartPostRequest(uri, data, file, pars) {
        if (typeof pars == "undefined" || pars == null) pars = {};
        if (typeof data == "undefined") data = null;
        let formdata = new FormData();
        formdata.append("data", encodeURIComponent(JSON.stringify(data)));
        if (file) {
            formdata.append("file", file);
        }
        console.log(formdata)
        pars.prevcache = new Date().getTime();
        return new Promise((resolve, reject) => {
            posapi.post(uri, formdata, {
                params: pars,
                withCredentials: true,
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.baseReject(error);
                reject(error);
            });
        })
    },
    apiPostRequest(uri, data, pars) {
        if (typeof pars == "undefined" || pars == null) pars = {};
        if (typeof data == "undefined") data = null;
        pars.prevcache = new Date().getTime();
        return new Promise((resolve, reject) => {
            posapi.post(uri, data, {
                params: pars,
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.baseReject(error);
                reject(error);
            });
        })
    },
    apiGetRequest(uri, pars, cache = false) {
        if (typeof pars == "undefined" || pars == null) pars = {};
        if (!cache) pars.prevcache = new Date().getTime();
        return new Promise((resolve, reject) => {
            posapi.get(uri, {
                params: pars,
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.$vm.$store.commit("session/clearUser");
                this.$vm.$router.push("/login");
                this.baseReject(error);
                reject(error);
            });
        })
    },
    apiDeleteRequest(uri, data, pars) {
        if (typeof pars == "undefined" || pars == null) pars = {};
        if (typeof data == "undefined") data = null;
        pars.prevcache = new Date().getTime();
        return new Promise((resolve, reject) => {
            posapi.delete(uri, {
                data: data,
                params: pars,
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.$vm.$store.commit("session/clearUser");
                this.$vm.$router.push("/login");
                this.baseReject(error);
                reject(error);
            });
        })
    },
    upper_menu: [{
            text: "clients",
            fmenu: false,
            role: "USER",
            menu: [{
                text: "clients",
                role: "USER",
                route: "/clients",
            }, {
                text: "keys",
                role: "USER",
                route: "/keys",
            }],
        }, {
            text: "abnmnt",
            fmenu: false,
            role: "USER",
            menu: [{
                text: "services",
                role: "USER",
                route: "/clserv",
            }, {
                text: "abonements",
                role: "USER",
                route: "/abonements",
            }, {
                text: "tariffs",
                role: "USER",
                route: "/tariffs",
            }, {
                text: "dicts",
                role: "USER",
                route: "/dicts",
            }],
        }, {
            text: "clubsett",
            role: "USER",
            fmenu: false,
            menu: [{
                text: "rooms",
                role: "USER",
                route: "/rooms",
            }, {
                text: "coachs",
                role: "USER",
                route: "/coachs",
            }, {
                text: "workouts",
                role: "USER",
                route: "/workouts",
            }],
        }, {
            text: "reports",
            role: "USER",
            fmenu: false,
            menu: [{
                text: "soldabonements",
                role: "USER",
                route: "/soldabonements",
            }, {
                text: "regvis",
                role: "USER",
                route: "/regvis",
            }, {
                text: "regservs",
                role: "USER",
                route: "/regservs",
            }, {
                text: "visits",
                role: "USER",
                route: "/visits",
            }],
        },
        {
            text: "clubs",
            role: "USER",
            route: "/clubs",
            side: true,
        }, {
            divider: true,
        }, {
            text: "users",
            route: "/users",
            role: "USER",
            side: true,
        },
        {
            text: "groups",
            route: "/groups",
            role: "USER",
            side: true,
        }, {
            divider: true,
        }, {
            text: "events",
            route: "/events",
            role: "ADMIN",
            side: true,
        }, {
            text: "logs",
            route: "/logs",
            role: "USER",
            side: true,
        }, {
            divider: true,
        }
    ],
    //TAG supprot for store

    updateTags(state, inInfo = true) {
        try {
            state.items.forEach((e) => {
                if (inInfo && e.info.tags) {
                    state.tags = state.tags.concat(e.info.tags);
                } else if (e.tags) {
                    state.tags = state.tags.concat(e.tags);
                }
            });
        } catch (error) {
            console.log(error);
        }
        state.tags = state.tags.filter((value, index, self) => {
            return self.indexOf(value) === index;
        }).sort();
    },

    updateTag(state, item) {
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
    },
    // security 
    testRoles(roles) {
        try {
            return roles.split(",").indexOf(store.state.session.sessionData.group.role) != -1;
        } catch (error) {
            console.log("access error: " + store.state.session.sessionData.group.role, roles)
            return false;
        }
    },
    // api ui functions
    copy(i, def) {
        try {
            return JSON.parse(JSON.stringify((i && i.idx) ? {
                ...i
            } : {
                ...def
            }));
        } catch (error) {
            return {};
        }
    },
    getSavedLocaleAsStr() {
        return localStorage.getItem("lang");
    },
    baseReject(error) {
        let m = error;
        if (error.response && error.response.data) m = error.response.data;
        this.showMessage(m, true);
    },
    showMessage(text, isError = true) {
        this.$vm.$root.$emit("showmsg", {
            msg: text,
            color: isError ? "error" : "success"
        });
    },
    setLocale(v) {
        localStorage.setItem("lang", v);
        this.$vm.$i18n.locale = v;
    },
    setVm(vm) {
        this.$vm = vm;
        this.$vm.$i18n.locale = this.getSavedLocaleAsStr();
    },
}
export default api;