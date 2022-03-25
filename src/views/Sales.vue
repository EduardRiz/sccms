<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2">
      <sc-dates-range v-model="range" class="ml-3" />
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
      <template v-slot:item.fromdate="{ item }">
        <span>{{item.fromdate | dt-only}}</span>
      </template>
      <template v-slot:item.created="{ item }">
        <span>{{item.created | dt-only}}</span>
      </template>
      <template v-slot:item.sportclub="{ item }">
        <sc-record-info :idx="item.sportclub" store="clubs/item" />
      </template>
      <template v-slot:item.todate="{ item }">
        <span>{{item.todate | dt-only}}</span>
      </template>
      <template v-slot:item.type="{ item }">
        <span>{{item.tariff.type}}</span>
      </template>
      <template v-slot:item.price="{ item }">
        <span>{{(item.tariff.price*100) | currency}}</span>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar v-if="item.image">
          <v-img alt="Avatar" :src="$api.publicImgLink(item.image)" />
        </v-avatar>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "Sales",
  mixins: [commonmixin],
  watch: {
    current_page() {
      this.loadData();
    },
    range() {
      if (this.current_page == 0) {
        this.loadData();
      } else {
        this.current_page = 0;
      }
    },
  },
  data() {
    return {
      // item: { info: {} },
      // d_edit: false,
      current_page: 0,
      range: [],
      sortby: "idx",
      sortdesc: true,
      filter: {},
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
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
          text: this.$t("fields.avatar"),
          value: "image",
          sortable: false,
        },
        {
          text: this.$t("fields.tariff_type"),
          sortable: false,
          value: "type",
        },
        {
          text: this.$t("fields.sale"),
          sortable: false,
          value: "details.info.name",
        },
        {
          text: this.$t("fields.tariff"),
          sortable: false,
          value: "tariff.info.name",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
          sortable: false,
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
          sortable: false,
        },
      ],
    };
  },
  methods: {
    loadData(q) {
      if (q == 1) this.search = null;
      if (q == 2) this.pagination.page = 1;
      this.$api
        .apiGetRequest("cms/sales", {
          search: this.search,
          range: this.range.join("~"),
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
  mounted() {
    if (!this.$store.getters["clubs/isItems"]) {
      this.$store.dispatch("clubs/LOAD");
    }
  },
};
</script>

<style>
</style>