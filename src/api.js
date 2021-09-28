import axios from "axios";
const API = process.env.NODE_ENV == "development" ? "http://192.168.112.114:5678/scapi" : "https://service.elektroniskaskartes.lv/scapi";
//const API = process.env.NODE_ENV == "development" ? "https://service.elektroniskaskartes.lv/vcapi" : "https://service.elektroniskaskartes.lv/vcapi";
//const API = process.env.NODE_ENV == "development" ? "http://159.148.124.12:4567/vcapi" : "https://service.elektroniskaskartes.lv/vcapi";
//axios.defaults.withCredentials = true;

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
    login(data) {
        return this.apiPostRequest("login", data);
    },
    logout() {
        return this.apiPostRequest("logout");
    },
    // USERS
    getUsers() {
        return this.apiGetRequest("cms/users/select");
    },
    updateUser(data) {
        return this.apiPostRequest("cms/users/save", data);
    },
    deleteUser(username) {
        return this.apiPostRequest("cms/users/delete/" + username);
    },
    // USER GROUPS
    getGroups() {
        return this.apiGetRequest("cms/groups/select");
    },
    updateGroup(data) {
        return this.apiPostRequest("cms/groups/save", data);
    },
    deleteGroup(username) {
        return this.apiPostRequest("cms/groups/delete/" + username);
    },
    // VIRTUAL CARDS
    getVirtualCards(data) {
        return this.apiGetRequest("cms/vcards/select", data);
    },
    saveVirtualCard(data) {
        return this.apiPostRequest("cms/vcards/save", data);
    },
    delVirtualCard(data) {
        return this.apiPostRequest("cms/vcards/delete/" + data.idx);
    },
    addCardsToMerchant(data){
        return this.apiPostRequest("cms/vcards/add", data);
    },
    // EVENTS
    getEvents(data) {
        return this.apiGetRequest("cms/events/select", data);
    },
    // DEVICES
    getDevices(data) {
        return this.apiGetRequest("cms/devices/select", data);
    },
    cleanPushToken(serial, device, passtype) {
        return this.apiPostRequest("cms/devices/unbind/device/" + serial + "/" + device + "/" + passtype);
    },
    freeDeviceCard(item) {
        return this.apiPostRequest("cms/devices/unbind/card/" + item.idx, {
            deviceid: item.deviceid,
            passtype: item.passtype
        });
    },
    cleanDeviceCustomData(idx){
        return this.apiPostRequest("cms/devices/clear/" + idx);
    },
    removeDevice(idx){
        return this.apiPostRequest("cms/devices/delete/" + idx);
    },
    sendPushNotification(idx) {
        return this.apiPostRequest("cms/devices/notify/" + idx);
    },
    getSerialQrCodeLink(idx){
        return this.apiPostRequest("cms/devices/pkpass/" + idx);
    },
    // MERCHANTS
    getMerchs(data) {
        return this.apiGetRequest("cms/merchs/select", data);
    },
    saveMerch(data) {
        return this.apiPostRequest("cms/merchs/save", data);
    },
    deleteMerch(idx) {
        return this.apiPostRequest("cms/merchs/delete/" + idx);
    },

    //LOG FUNCTIONAL
    getServerLog(file) {
        return this.apiGetRequest("cms/log/load", {
            file: file
        });
    },
    loadLogsFiles() {
        return this.apiGetRequest("cms/log/files");
    },

    //PKPASS FUNCTIONAL
    loadPkpassDirs() {
        return this.apiGetRequest("cms/pkpass/dirs");
    },
    pkpassCopy(from, to) {
        return this.apiPostRequest("cms/pkpass/bin/copy", {
            from: from,
            to: to
        });
    },
    pkpassCriterionImgLink(alias, img) {
        return API + "/cms/criterions/img/get/" + alias + "?img=" + img;
    },
    savePkpassCriterionImage(alias, file) {
        return this.apiMultipartManyPostRequest("cms/criterions/img/set/" + alias, null, file);
    },

    pkpassImgLink(alias, img) {
        return API + "/cms/pkpass/img/get/" + alias + "?img=" + img;
    },
    savePkpassImage(alias, file) {
        return this.apiMultipartManyPostRequest("cms/pkpass/img/set/" + alias, null, file);
    },
    getPkpassTemplate(alias) {
        return this.apiGetRequest("cms/pkpass/template/get/" + alias);
    },
    setPkpassTemplate(alias, data) {
        return this.apiPostRequest("cms/pkpass/template/set/" + alias, data);
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
    upper_menu: [{
            text: "configs",
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
            icon: "mdi-users"
        }, {
            text: "services",
            route: "/services",
            icon: "mdi-table-cog"
        }, {
            text: "abonemets",
            route: "/abonements",
            icon: "mdi-calendar-outline",
            role: 0
        },
    ],
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