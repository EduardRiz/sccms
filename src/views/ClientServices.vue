<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center" class="my-2">
      <i18n
        :path="'menu.'+$route.name.toLowerCase()"
        class="ml-4 primary--text text-uppercase text-h4"
      ></i18n>
      <div style="width: 200px" class="ml-10">
        <v-menu
          v-model="tdmenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="todate"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              class="to-date-input"
              :hint="$t('label.activeat')"
              persistent-hint
            ></v-text-field>
          </template>
          <v-date-picker v-model="todate" no-title></v-date-picker>
        </v-menu>
      </div>
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
        <span v-if="item.tariff">{{(item.tariff.price) | currency}}</span>
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

export default {
  name: "ClientServices",
  mixins: [commonmixin],
  data() {
    return {
      filter: {},
      current_page: 0,
      tdmenu: false,
      todate: this.$moment().format("YYYY-MM-DD"),
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
    todate(v) {
      console.log(v);
      this.tdmenu = false;
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
          ts: this.todate,
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

<style scoped>
.to-date-input >>> input{
  text-align: right;
}
</style>