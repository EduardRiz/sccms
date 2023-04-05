<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <v-spacer></v-spacer>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      show-expand
      item-key="idx"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
      :options.sync="pagination"
      :page.sync="currentPage"
      :server-items-length="totalItems"
    >
      <template v-slot:item.atype="{ item }">{{$t("atypes")[item.atype]}}</template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">{{detail2string(item)}}</td>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "ActivityLog",
  mixins: [commonmixin],
  data() {
    return {
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.cmsuser"),
          value: "scuser",
        },
        {
          text: this.$t("fields.group"),
          value: "scgroup",
        },
        {
          text: this.$t("fields.club"),
          value: "sportclub",
        },
        {
          text: this.$t("fields.wsid"),
          value: "ws",
        },
        {
          text: this.$t("fields.atype"),
          value: "atype",
        },
      ],
    };
  },
  methods: {
    detail2string(item) {
      let det = item.details;
      if (det && det.unfreezedate) {
        det.freeze = new Date(det.unfreezedate).toLocaleString();
      }
      return JSON.stringify(det);
    },
    loadData(q) {
      if (q == 1) this.search = null;
      this.$api
        .apiGetRequest("cms/actlog", {
          search: this.search,
          page: this.pagination.page - 1,
          size: this.pagination.itemsPerPage,
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

<style scope>
</style>