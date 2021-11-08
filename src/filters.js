import moment from 'moment'
import api from "@/api.js";

const filters = [{
        name: "capitalize",
        func: (val) => {
            return val;
        }
    },
    {
        name: "percent",
        func: (val) => {
            return val + "%";
        }
    },
    {
        name: "phone",
        func: (phone) => {
            return phone ? ("" + phone).replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : "";
        }
    },
    {
        name: "currency",
        func: (val) => {
            let v = parseInt(val);
            if (isNaN(v)) return "";
            let nStr = (v / 100).toString();
            let x = nStr.split('.');
            let x1 = x[0];
            let x2 = x.length > 1 ? ('.' + x[1] + (x[1].length == 1 ? '0' : '')) : '';
            let rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ' ' + '$2');
            }
            return x1 + x2 + " €";
        }
    },
    {
        name: "currency4",
        func: (val) => {
            let v = parseInt(val);
            if (isNaN(v)) return "";
            let nStr = (v / 10000).toString();
            let x = nStr.split('.');
            let x1 = x[0];
            let x2 = x.length > 1 ? ('.' + x[1] + (x[1].length == 1 ? '0' : '')) : '';
            let rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ' ' + '$2');
            }
            return x1 + x2 + " €";
        }
    },
    {
        name: "cent2",
        func: (val) => {
            let v = parseInt(val);
            if (isNaN(v)) return "";
            let nStr = (v / 100).toString();
            let x = nStr.split('.');
            let x1 = x[0];
            let x2 = x.length > 1 ? ('.' + x[1] + (x[1].length == 1 ? '0' : '')) : '';
            let rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ' ' + '$2');
            }
            return x1 + x2 + " ¢";
        }
    },
    {
        name: "plusempty",
        func: (val) => {
            if (val == 'Y') return "+";
            return "";
        }
    },
    {
        name: "dt-time",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            if (val && val.constructor.name === 'Moment') return moment(val.toDate()).format("DD MMM YYYY");
            return moment(val).format("YYYY-MM-DD HH:mm");
        }
    },
    {
        name: "dt_time",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            if (val && val.constructor.name === 'Moment') return moment(val.toDate()).format("DD MMM YYYY");
            return moment(val).format("YYYY-MM-DD HH:mm");
        }
    },
    {
        name: "dt_time_jpa",
        func: (val) => {
            try {
                moment.locale(api.getSavedLocaleAsStr());
                val[6] = val[6] / 1000000;
                return moment(val).format("YYYY-MM-DD HH:mm");
            } catch (error) {
                return "";
            }
        }
    },
    {
        name: "dt-only",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            if (val && val.constructor.name === 'Moment') return moment(val.toDate()).format("DD MMM YYYY");
            return moment(val).format("DD MMM YYYY");
        }
    },
    {
        name: "time-only",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            return moment(val).format("HH:mm");
        }
    },
    {
        name: "dt-sec",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
        }
    },
    {
        name: "dt-month",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            return moment(val.toDate()).format("YYYY, MMMM");
        }
    },
    {
        name: "dt-month-short",
        func: (val) => {
            if (!val) return "";
            moment.locale(api.getSavedLocaleAsStr());
            return moment(val.toDate()).format("MMM, YYYY");
        }
    },
    {
        name: "dt-eet",
        func: (val) => {
            if (!val) return "";
            try {
                let tm = moment(val, ["ddd MMM DD HH:mm:ss EET YYYY", "ddd MMM DD HH:mm:ss EEST YYYY"], "en");
                moment.locale(api.getSavedLocaleAsStr());
                return moment(tm.toDate()).format("dddd, DD MMMM YYYY HH:mm");
            } catch (e) {
                console.log(e);
                return val;
            }
        }
    },
    {
        name: "time_interval",
        func: (hours) => {
            if (!hours) return "";
            let str = "";
            let it = [];
            for (let i = 0; i < 25; i++) {
                if (hours[i]) {
                    it.push(i);
                } else {
                    if (it.length) {
                        if (str) str += ", ";
                        str += it[0] + ":00-" + it[it.length - 1] + ":00";
                    }
                    it = [];
                }
            }
            if (it.length) {
                if (str) str += ", ";
                str += it[0] + ":00-" + it[it.length - 1] + ":00";
            }
            return str;
        },
    },
    {
        name: "duration_filter",
        func: (v) => {
            try {
                return v.value + " " + v.type;
            } catch (error) {
                return "";
            }
        },
    },


    {
        name: "days_interval",
        func: (days) => {
            try {
                let dd = days;
                return dd.sort().join();
                // let str = "";
                // let it = [];
                // days.sort().forEach(e => {
                //     console.log(e, it, str)
                //     if (!it.length) {
                //         it.push(e);
                //         it.push(e);
                //     } else if (it[1] == e - 1) {
                //         it[1] = e;
                //     } else {
                //         if (str) str += ", ";
                //         str += it[0] + "-" + it[it.length - 1];
                //         it = [];
                //     }
                // });
                // if (it.length) {
                //     if (str) str += ", ";
                //     str += it[0] + "-" + it[it.length - 1];
                // }
                // return str;

            } catch (error) {
                return "";
            }
        },
    },

    {
        name: "removeCoding",
        func: (val) => {
            try {
                return val.trim().split("=")[0];
            } catch (error) {
                return val;
            }
        }
    },
    {
        name: "refcard",
        func: (val) => {
            try {
                let ret = /<ref>(.+)<\/ref>/g.exec(val)
                return ret != null ? ret[1] : null;
            } catch (error) {
                return null;
            }
        }
    },
    {
        name: "realdate",
        func: (val) => {
            try {
                let ret = /<rdt>(.+)<\/rdt>/g.exec(val)
                return ret != null ? ret[1] : null;
            } catch (error) {
                return val;
            }
        }
    }
]

export default filters;