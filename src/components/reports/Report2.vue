<template>
  <v-sheet class="radius-25">
    <v-row>
      <v-col align-self="center">
        <v-icon class="mr-4">{{$t("report.icons."+report.label)}}</v-icon>
        <span>{{$t("report.title."+report.label)}}</span>
      </v-col>
      <sc-dates-range v-model="range" class="ml-3" />
      <v-spacer></v-spacer>
      <v-btn @click="$emit('input',false)" icon color="primary">
        <v-icon>mdi-arrow-u-left-top-bold</v-icon>
      </v-btn>
    </v-row>
    <v-row align="center" align-content="center">
      <v-select
        v-model="filter.club"
        :items="sportclubs"
        class="px-2 filter-select"
        clearable
        :label="$t('report.filterBySportclub')"
      ></v-select>
      <v-select
        v-model="filter.coach"
        :items="coachs"
        class="px-2 filter-select"
        clearable
        :label="$t('report.filterByCoach')"
      ></v-select>
      <v-select
        v-model="filter.workout"
        :items="workouts"
        class="px-2 filter-select"
        clearable
        :label="$t('report.filterByWorkout')"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon :disabled="data.length==0" @click.prevent="d_print=true">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <export-excel :data="data" :fields="excel_fields" :title="excel_title" :footer="excel_footer">
        <v-btn icon :disabled="data.length==0">
          <v-icon>mdi-microsoft-excel</v-icon>
        </v-btn>
      </export-excel>
    </v-row>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="data"
        item-key="idx"
        class="idcs-fill-width"
        :footer-props="foot_props"
        :no-data-text="$t('label.nodata')"
      >
        <template #item.position="{ item }">
          <span>{{data.indexOf(item)+1}}</span>
        </template>
        <template #body.append="{headers, pagination}">
          <tr>
            <td :colspan="headers.length-1">
              <i18n path="report.rows">
                <template #rows>{{pagination.itemsLength}}</template>
              </i18n>
            </td>
            <td align="right">
              <i18n path="report.total">
                <template #total>{{total}}</template>
              </i18n>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-row>
    <sc-printdata-dialog
      :items="data"
      :headers="headers"
      v-model="d_print"
      :report="report"
      :range="range"
      :filter="filter"
    >
      <template #tablefooter>
        <tr>
          <td :colspan="headers.length"></td>
          <td align="right">
            <i18n path="report.total">
              <template #total>{{total}}</template>
            </i18n>
          </td>
        </tr>
      </template>
    </sc-printdata-dialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "Report2",
  mixins: [commonmixin],
  props: { value: Boolean, item: Object },
  data() {
    return {
      range: [],
      d_print: false,
      allTotal: 0,
      filteredTotal: 0,
      filtered: [],
      coachs: [],
      workouts: [],
      sportclubs: [],
      filter: { club: null, coach: null, workout: null },
      headers: [
        {
          text: "#",
          excelIgnore: true,
          value: "position",
          align: "right",
          width: "50",
        },
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.club"),
          value: "club",
        },
        {
          text: this.$t("fields.workout"),
          value: "workout",
        },
        {
          text: this.$t("fields.coach"),
          value: "coach",
        },
        {
          text: this.$t("fields.service"),
          value: "service",
        },
        {
          text: this.$t("fields.room"),
          value: "room",
        },
        {
          text: this.$t("fields.count"),
          value: "usedcount",
          align: "right",
        },
      ],
    };
  },
  computed: {
    excel_fields() {
      let f = {};
      this.headers.forEach((e) => {
        if (e.excelIgnore) return;
        f[e.text] = e.value;
      });
      return f;
    },
    excel_title() {
      let titles = [];
      titles.push(this.$t("report.title." + this.report.label));
      titles.push(
        this.$t("report.period", { st: this.range[0], ed: this.range[1] })
      );
      if (this.isFiltered) {
        titles.push(this.$t("report.filterby"));
        for (const k in this.filter) {
          if (this.filter[k]) {
            titles.push(this.$t("fields." + k) + ": " + this.filter[k]);
          }
        }
      }
      return titles;
    },
    excel_footer() {
      return this.$t("report.created", {
        ts: this.$moment().format("YYYY-MM-DD HH:mm"),
      });
    },
    isFiltered() {
      for (const k in this.filter) {
        if (this.filter[k]) return true;
      }
      return false;
    },
    total() {
      if (this.isFiltered) return this.filteredTotal;
      return this.allTotal;
    },
    data() {
      if (this.isFiltered) return this.filtered;
      return this.items;
    },
    report() {
      return this.item ? this.item : {};
    },
  },
  watch: {
    filter: {
      handler() {
        this.filterData();
      },
      deep: true,
    },
    range() {
      this.loadData();
    },
  },
  methods: {
    filterData() {
      this.filteredTotal = 0;
      this.filtered = this.items.filter((i) => {
        let tofilter = true;
        for (const k in this.filter) {
          if (this.filter[k]) {
            tofilter = tofilter && i[k] == this.filter[k];
          }
        }
        if (tofilter) this.filteredTotal += i.usedcount;
        return tofilter;
      });
    },
    loadData() {
      this.allTotal = 0;
      this.sportclubs = [];
      this.coachs = [];
      this.workouts = [];
      this.filter = {};
      this.$api
        .apiGetRequest("/cms/reports/2", { range: this.range.join("~") })
        .then((data) => {
          this.items = [...data];
          this.items.forEach((e) => {
            if (!this.sportclubs.includes(e.club)) this.sportclubs.push(e.club);
            if (!this.coachs.includes(e.coach)) this.coachs.push(e.coach);
            if (!this.workouts.includes(e.workout))
              this.workouts.push(e.workout);
            this.allTotal += e.usedcount;
          });
        });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style>
</style>