<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2">
      <sc-dates-range v-model="valid" class="ml-3" />
      <v-spacer></v-spacer>
      <span width="300px">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          clearable
          @keydown.enter="loadData(2)"
          @keydown.escape="loadData(1)"
          @click:append="loadData(2)"
          @click:clear="loadData(1)"
        ></v-text-field>
      </span>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="idx"
      show-expand
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
      :sort-by.sync="sortby"
      :sort-desc.sync="sortdesc"
      :items-per-page.sync="itemPerPage"
      :options.sync="pagination"
      :page.sync="currentPage"
      :server-items-length="totalItems"
    >
      <template v-slot:item.price="{ item }">
        <span v-if="item.tariff">{{(item.tariff.price*100) | currency}}</span>
      </template>
      <template v-slot:item.fromdate="{ item }">
        <span>{{item.fromdate | dt-only}}</span>
      </template>
      <template v-slot:item.workout="{ item }">
        <v-icon>{{item.workout?"mdi-check":""}}</v-icon>
      </template>
      <template v-slot:item.scalar="{ item }">
        <v-icon>{{item.scalar?"mdi-check":""}}</v-icon>
      </template>
      <template v-slot:item.visitcontrol="{ item }">
        <v-icon>{{item.visitcontrol?"mdi-check":""}}</v-icon>
      </template>

      <template v-slot:item.todate="{ item }">
        <span>{{item.todate | dt-only}}</span>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar v-if="item.image">
          <v-img alt="Avatar" :src="$api.publicImgLink(item.image)" />
        </v-avatar>
      </template>
      <template v-slot:item.sale="{ item }">
        <span v-if="item.sale">{{item.sale.info.name}}</span>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <div class="d-flex">
            <span>{{item.time.hours | time_interval}}</span>
            <sc-week-days class="ml-1" :days="item.time.days" />
            <sc-services-list :item="item" />
          </div>
        </td>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import DateValid from "@/components/controls/DateValid.vue";

export default {
  name: "ClientServices",
  mixins: [commonmixin],
  components: {
    "sc-dates-range": DateValid,
  },
  data() {
    return {
      filter: {},
      current_page: 0,
      valid: "",
      sortby: "idx",
      sortdesc: true,
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.avatar"),
          value: "image",
        },
        {
          text: this.$t("fields.sale"),
          value: "details.info.name",
        },
        {
          text: this.$t("fields.tariff"),
          value: "tariff.info.name",
        },
        {
          text: this.$t("fields.service"),
          value: "service",
        },
        {
          text: this.$t("fields.aworkout"),
          value: "workout",
        },
        {
          text: this.$t("fields.ascalar"),
          value: "scalar",
        },
        {
          text: this.$t("fields.visitcontrol"),
          value: "visitcontrol",
        },
        {
          text: this.$t("fields.remainvisits"),
          value: "remainvisits",
        },
        {
          text: this.$t("fields.fromDate"),
          value: "fromdate",
        },
        {
          text: this.$t("fields.toDate"),
          value: "todate",
        },
        {
          text: this.$t("fields.tags"),
          value: "tags",
        },
      ],
    };
  },
  watch: {
    current_page() {
      this.loadData();
    },
    range(v) {
      console.log(v);
      if (this.current_page == 0) {
        this.loadData();
      } else {
        this.current_page = 0;
      }
    },
  },
  methods: {
    loadData(q) {
      if (q == 1) this.search = null;
      if (q == 2) this.pagination.page = 1;
      this.$api
        .apiGetRequest("cms/clserv", {
          search: this.search,
          range: this.valid,
          page: this.pagination.page - 1,
          size: this.itemPerPage,
          sort: this.sortByParam("idx"),
        })
        .then((response) => {
          this.items = [...response.content];
          this.totalItems = response.totalElements;
        });
    },
  },
  mounted() {},
};
</script>

<style>
</style>