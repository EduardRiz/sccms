<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2" align="center" align-content="center">
      <i18n
        :path="'menu.'+$route.name.toLowerCase()"
        class="ml-4 primary--text text-uppercase text-h4"
      ></i18n>
      <sc-dates-range v-model="range" class="ml-3" />
      <v-spacer></v-spacer>
      <span width="300px">
        <v-text-field v-model="search" append-icon="mdi-magnify" class="mr-3"></v-text-field>
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
      :items-per-page.sync="itemPerPage"
      :options.sync="pagination"
      :page.sync="currentPage"
      :server-items-length="totalItems"
    >
      <template v-slot:item.client="{ item }">
        <sc-client-avatar :item="item" />
      </template>
      <template v-slot:item.count="{ item }">
        <span v-if="item.count">{{item.count}}</span>
      </template>
      <template v-slot:item.time="{ item }">
        <sc-time-interval
          v-if="item.wdet.idx"
          :start="item.wdet.beginat"
          :duration="item.wdet.duration"
          :color="item.wdet.color"
        />
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
//import TimeInterval from "@/components/controls/TimeInterval.vue";

export default {
  name: "UsedServices",
  mixins: [commonmixin],
  components: {
    "sc-time-interval": () => import("@/components/controls/TimeInterval.vue"),
    "sc-client-avatar": () =>
      import("@/components/controls/ClientWithAvatar.vue"),
  },
  data() {
    return {
      range: [],
      filter: {},
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.club"),
          value: "club",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        // {
        //   text: this.$t("fields.avatar"),
        //   value: "image",
        //   sortable: false,
        // },
        {
          text: this.$t("fields.service"),
          value: "service",
        },
        {
          text: this.$t("fields.count"),
          align: "center",
          value: "count",
        },
        {
          text: this.$t("fields.workout"),
          value: "workout",
        },
        {
          text: this.$t("fields.time"),
          value: "time",
          sortable: false,
        },
        {
          text: this.$t("fields.coach"),
          value: "coach",
          sortable: false,
        },
        {
          text: this.$t("fields.room"),
          value: "room",
          sortable: false,
        },
      ],
    };
  },
  watch: {
    range() {
      if (this.pagination.page == 0) {
        this.loadData();
      } else {
        this.pagination.page = 0;
      }
    },
  },
  methods: {
    loadData() {
      this.$api
        .apiGetRequest("cms/regvis", {
          range: this.range.join("~"),
          search: this.search,
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
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
  },
};
</script>

<style>
</style>