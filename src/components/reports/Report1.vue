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
    <v-row align="center" align-content="center" v-if="items.length">
      <v-select
        v-model="filter.sportclub"
        :items="sportclubs"
        class="px-2 filter-select"
        clearable
        :label="$t('report.filterBySportclub')"
      ></v-select>
      <v-select
        v-model="filter.sale"
        :items="sales"
        class="px-2 filter-select"
        clearable
        :label="$t('report.filterBySale')"
      ></v-select>
      <v-select
        v-model="filter.tariff"
        :items="tariffs"
        class="px-2 filter-select"
        clearable
        :label="$t('report.filterByTariff')"
      ></v-select>
      <!-- <v-btn rounded @click.stop="filterData" small>
        <v-icon left>{{!isFiltered?"mdi-filter":"mdi-filter-off"}}</v-icon>
        <i18n :path="!isFiltered?'button.filter':'button.unfilter'" />
      </v-btn>-->
      <v-spacer></v-spacer>
      <v-btn icon :disabled="data.length==0" @click.prevent="d_print=true">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <export-excel :data="data" :fields="excel_fields" :title="excel_title" :footer="excel_footer">
        <v-btn icon :disabled="data.length==0">
          <v-icon>mdi-microsoft-excel</v-icon>
        </v-btn>
      </export-excel>
      <!-- <export-excel :data="data" :fields="excel_fields" :title="excel_title" :footer="excel_footer" type="csv">
        <v-btn icon :disabled="data.length==0">
          <v-icon>mdi-file-csv</v-icon>
        </v-btn>
      </export-excel>-->
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
        <template #item.price="{ item }">
          <span>{{item.price | currency}}</span>
        </template>
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
                <template #total>{{total | currency}}</template>
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
              <template #total>{{total | currency}}</template>
            </i18n>
          </td>
        </tr>
      </template>
    </sc-printdata-dialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
//import printserv from "@/printserv.js";

export default {
  name: "Report1",
  mixins: [commonmixin],
  props: { value: Boolean, item: Object },
  data() {
    return {
      range: [],
      allTotal: 0,
      filteredTotal: 0,
      d_print: false,
      //filter supp
      sportclubs: [],
      filtered: [],
      sales: [],
      tariffs: [],
      filter: { sportclub: null, sale: null, tariff: null },

      headers: [
        {
          text: "#",
          excelIgnore: true,
          value: "position",
          align: "right",
          width: "50",
        },
        {
          text: this.$t("fields.dsales"),
          value: "created",
        },
        {
          text: this.$t("fields.cmsuser"),
          value: "cmsuser",
        },
        {
          text: this.$t("fields.club"),
          value: "sportclub",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.sale"),
          value: "sale",
        },
        // {
        //   text: this.$t("fields.tariff_type"),
        //   value: "ttype",
        // },
        {
          text: this.$t("fields.tariff"),
          value: "tariff",
        },
        {
          text: this.$t("fields.fromDate"),
          value: "from_date",
        },
        {
          text: this.$t("fields.toDate"),
          value: "to_date",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
          align: "right",
          pfilter: "currency",
        },
      ],
    };
  },
  computed: {
    excel_fields() {
      let f = {};
      this.headers.forEach((e) => {
        if (e.excelIgnore) return;
        if (e.value == "price") {
          f.price = {
            field: "price",
            callback: (value) => {
              return value / 100;
            },
          };
        } else {
          f[e.text] = e.value;
        }
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
  filters: {
    toshow(v) {
      console.dir(v);
    },
  },
  methods: {
    filterData() {
      // if (!this.isFiltered) {
      //   this.filtered = [];
      //   for (const k in this.filter) {
      //     this.filter[k] = null;
      //   }
      //   return;
      // }
      this.filteredTotal = 0;
      this.filtered = this.items.filter((i) => {
        let tofilter = true;
        for (const k in this.filter) {
          if (this.filter[k]) {
            tofilter =
              tofilter &&
              i[k] + (k == "sportclub" ? "" : ", " + i.ttype) == this.filter[k];
          }
        }
        if (tofilter) this.filteredTotal += i.price;
        return tofilter;
      });
    },
    loadData() {
      this.allTotal = 0;
      this.sportclubs = [];
      this.sales = [];
      this.tariffs = [];
      this.filter = {};
      this.$api
        .apiGetRequest("/cms/reports/1", { range: this.range.join("~") })
        .then((data) => {
          this.items = [...data];
          this.items.forEach((e) => {
            if (!this.sportclubs.includes(e.sportclub))
              this.sportclubs.push(e.sportclub);
            if (!this.sales.includes(e.sale + ", " + e.ttype))
              this.sales.push(e.sale + ", " + e.ttype);
            if (!this.tariffs.includes(e.tariff + ", " + e.ttype))
              this.tariffs.push(e.tariff + ", " + e.ttype);
            this.allTotal += e.price;
          });
        });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>
<style scoped>
.filter-select {
  width: 150px;
}
</style>

