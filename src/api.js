import axios from "axios";
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
                this.$vm.$store.commit("user/setUser", response.user)
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    imageClientLink(idx) {
        return this.api + '/operator/image?path=images/client&idx=' + idx + '.jpg'
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
    registerVisit2client(data) {
        return this.apiPostRequest("operator/client/visit", data);
    },
    getClientServices(idx) {
        return this.apiGetRequest("operator/client/services/" + idx);
    },
    getRegisteredClientServices(idx) {
        return this.apiGetRequest("operator/client/regservs/" + idx);
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
    apiGetRequest(uri, pars) {
        if (typeof pars == "undefined" || pars == null) pars = {};
        pars.prevcache = new Date().getTime();
        return new Promise((resolve, reject) => {
            posapi.get(uri, {
                params: pars,
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.$vm.$store.commit("user/clearUser");
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
                this.$vm.$store.commit("user/clearUser");
                this.$vm.$router.push("/login");
                this.baseReject(error);
                reject(error);
            });
        })
    },
    upper_menu: [{
            text: "config",
            route: "/configs",
            side: true,
            icon: "mdi-cogs",
        }, {
            divider: true,
        }, {
            text: "users",
            route: "/users",
            side: true,
            icon: "mdi-account",
        },
        {
            text: "groups",
            route: "/groups",
            side: true,
            icon: "mdi-account-multiple"
        }, {
            divider: true,
        }, {
            text: "events",
            route: "/events",
            side: true,
            icon: "mdi-notebook"
        }, {
            text: "logs",
            route: "/logs",
            side: true,
            icon: "mdi-notebook"
        }, {
            divider: true,
        }, {
            text: "clients",
            route: "/clients",
            side: true,
            icon: "mdi-account-group"
        }, {
            text: "services",
            route: "/clserv",
            side: true,
            icon: "mdi-human-scooter"
        }, {
            text: "abonements",
            route: "/abonements",
            side: true,
            icon: "mdi-table-multiple",
        }, {
            text: "rooms",
            route: "/rooms",
            side: true,
            icon: "mdi-greenhouse",
        }, {
            text: "coachs",
            route: "/coachs",
            side: true,
            icon: "mdi-weight-lifter",
        }, {
            text: "workouts",
            route: "/workouts",
            side: true,
            icon: "mdi-calendar-month",
        }, {
            text: "soldabonements",
            route: "/soldabonements",
            side: true,
            icon: "mdi-account-supervisor",
        }, {
            text: "regvis",
            route: "/regvis",
            side: true,
            icon: "mdi-star-check-outline",
        }, {
            text: "regservs",
            route: "/regservs",
            side: true,
            icon: "mdi-account-supervisor",
        }, {
            divider: true,
        }, {
            text: "dicts",
            route: "/dicts",
            side: true,
            icon: "mdi-notebook",
        }, {
            divider: true,
        },
    ],


    // api ui functions
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