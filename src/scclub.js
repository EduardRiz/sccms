// import RecordStatus from "@/components/RecordStatus.vue";
// import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
// import DialogTitle from "@/components/DialogTitle.vue";
//import RecordAudit from "@/components/controls/RecordAudit.vue";
//import TagsEditor from "@/components/editors/TagsEditor.vue";
//import RecordInfoField from "@/components/controls/RecordInfoField.vue";
//import WeekForTime from "@/components/WeekForTime.vue";
//import ServicesAsList from "@/components/ServicesAsList.vue";
//import DateRanges from "@/components/controls/DateRanges.vue";
// Vue.component("sc-record-audit", () => import("@/components/controls/RecordAudit.vue"));
// Vue.component("sc-record-info", () => import("@/components/controls/RecordInfoField.vue"));
// Vue.component("sc-week-days", () => import("@/components/WeekForTime.vue"));
// Vue.component("sc-services-list", () => import("@/components/ServicesAsList.vue"));
// Vue.component("sc-dates-range", () => import("@/components/controls/DateRanges.vue"));

// Vue.component("TagsEditor", () => import('@/components/editors/TagsEditor.vue'));


//Vue.component("TagsEditor", TagsEditor);
import filters from './filters.js';

const settings = {
    reports: [{
        id: "Report-1",
        label: "purchases",
        groups: ["finances", "clients"]
    }, {
        id: "Report-2",
        label: "coachsact",
        groups: ["club"]
    }, {
        id: "Report-3",
        label: "clientsact",
        groups: ["clients"]
    }, {
        id: "Report-4",
        label: "clientsvis",
        groups: ["clients"]
    }, {
        id: "Chart-1",
        label: "chartvis",
        aclass:"green white--text",
        groups: ["chart", "clients"]
    }],
    groups: ["finances", "clients", "club", "chart"],
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
            side: false,
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
            text: "reportsm",
            role: "USER",
            side: false,
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
        }, {
            text: "reports",
            role: "POWERUSER",
            side: false,
            route: "/reports",
        },
        {
            text: "clubs",
            role: "ADMIN",
            route: "/clubs",
            side: true,
        }, {
            divider: true,
        }, {
            text: "users",
            route: "/users",
            role: "ADMIN",
            side: true,
        },
        {
            text: "groups",
            route: "/groups",
            role: "ADMIN",
            side: true,
        }, {
            text: "workstations",
            route: "/workstations",
            role: "ADMIN",
            side: true,
        }, {
            divider: true,
        }, {
            text: "events",
            route: "/events",
            role: "ADMIN",
            side: true,
        }, {
            text: "activity",
            route: "/actlog",
            role: "ADMIN",
            side: true,
        }, {
            text: "logs",
            route: "/logs",
            role: "ADMIN",
            side: true,
        }, {
            divider: true,
        }
    ],

}

const scclub = {}
scclub.install = function (Vue) {
    Vue.component("sc-record-audit", () => import("@/components/controls/RecordAudit.vue"));
    Vue.component("sc-record-info", () => import("@/components/controls/RecordInfoField.vue"));
    Vue.component("sc-week-days", () => import("@/components/WeekForTime.vue"));
    Vue.component("sc-services-list", () => import("@/components/ServicesAsList.vue"));
    Vue.component("sc-dates-range", () => import("@/components/controls/DateRanges.vue"));
    Vue.component("TagsEditor", () => import('@/components/editors/TagsEditor.vue'));
    Vue.component("sc-record-status", () => import("@/components/RecordStatus.vue"));
    Vue.component("sc-dialog-title", () => import("@/components/DialogTitle.vue"));
    Vue.component("sc-confirm-dialog", () => import("@/components/dialogs/ConfirmDialog.vue"));
    Vue.component("sc-printdata-dialog", () => import("@/components/dialogs/PrintDataDialog.vue"));
    filters.forEach(f => {
        Vue.filter(f.name, f.func)
    })
    Vue.prototype.$scclub = settings;
}
export default scclub;