import axios from "axios";
import store from "@/store/index.js"
const API = process.env.NODE_ENV == "development" ? "https://192.168.112.114:5678/scapi" : "/scapi";

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
                this.$vm.$store.commit("session/setUser", response);
                this.$vm.$root.$emit("heartbeat", response.user && response.group && response.club);
                if (!(this.isLogged())) {
                    this.$vm.$store.dispatch("session/LOGOUT", this.$vm);
                } else
                    resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    publicImgLink(img, def) {
        return this.api + '/photos/' + (!img && def ? "default-avatar.jpg" : img);
    },
    imageClientLink(idx) {
        return this.api + '/operator/image?path=images/client&idx=' + idx + '.jpg';
    },
    login(data) {
        return new Promise((resolve, reject) => {
            this.apiPostRequest("login", data, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                }
            }).then(response => {
                this.$vm.$root.$emit("heartbeat", response.user && response.group && response.club);
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    logout() {
        return new Promise((resolve, reject) => {
            this.apiPostRequest("logout").then(response => {
                this.$vm.$root.$emit("heartbeat", false);
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
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
    registerAnonymVisit(idx, key, boxkey, data) {
        return this.apiPostRequest("operator/client/anonymvisit/" + idx, {
            services: data,
            key: key,
            boxkey: boxkey
        });
    },

    getTodaysWorkouts() {
        return this.apiGetRequest("operator/todaywo");
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
    refreshSessionClub() {
        return this.apiPostRequest("operator/session/refresh/club");
    },
    loadClientHistory(client) {
        return this.apiGetRequest("operator/client/history/" + client);
    },
    loadClientPurchases(client) {
        return this.apiGetRequest("operator/client/purchases/" + client);
    },
    loadVisits(data) {
        return this.apiGetRequest("operator/visits/select", data);
    },
    closeVisit(idx) {
        return this.apiPostRequest("operator/visits/close/" + idx);
    },
    globalSearchClient(pattern) {
        return this.apiGetRequest("operator/gsearch", {
            pattern: pattern
        });
    },
    reversalSale(sale) {
        return this.apiPostRequest("operator/client/purchase/remove/" + sale);
    },
    reversalServiceBuy(us, sale) {
        return this.apiPostRequest("operator/reversal/service", {
            service: us,
            sale: sale
        });
    },
    getAnonymousClient(boxkey) {
        return this.apiPostRequest("operator/client/anonym", {
            boxkey: boxkey
        });
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
    getInOutInfo() {
        return this.apiGetRequest("operator/counters");
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
                // headers: this.$vm.$store.getters["session/bearer"]
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
                // headers: this.$vm.$store.getters["session/bearer"]
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
            posapi.post(uri, data, pars).then(response => {
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
                // headers: this.$vm.$store.getters["session/bearer"]
            }, ).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.baseReject(error);
                // this.$vm.$store.commit("session/clearUser");
                // this.$vm.$router.push("/login");
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
                // headers: this.$vm.$store.getters["session/bearer"]
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                this.baseReject(error);
                // this.$vm.$store.commit("session/clearUser");
                // this.$vm.$router.push("/login");
                reject(error);
            });
        })
    },
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

    updateTag(state, item, inInfo = true) {
        try {
            const tags = inInfo ? item.info.tags : item.tags;
            if (!tags) return;
            tags.forEach((e) => {
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
            if (store.state.session.sessionData.group.role == "ADMIN") return true;
            if (store.state.session.sessionData.group.role == "POWERUSER" && (roles == "USER" || roles == "POWERUSER")) return true;
            return roles == store.state.session.sessionData.group.role;
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
    isLogged() {
        try {
            return this.$vm.$store.getters["session/isLogged"]
        } catch (error) {
            return false;
        }
    },
    toDate(from, period) {
        try {
            const dt = this.$vm.$moment(from);
            switch (period.duration.type) {
                case "m":
                    return dt.add(period.duration.value, "month");
                case "d":
                    return dt.add(period.duration.value, "day");
                case "h":
                    return dt.add(period.duration.value, "hour");
                default:
                    return "";
            }
        } catch (error) {
            return "";
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