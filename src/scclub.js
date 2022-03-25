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
    filters.forEach(f => {
        Vue.filter(f.name, f.func)
    })
}
export default scclub;