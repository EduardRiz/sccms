<template>
  <v-main class="fill-height pa-2 idcs-main-list">
    <v-row align="center" align-content="center">
      <v-col cols="12" sm="3">
        <v-select :items="logs" v-model="logfile" @change="loadLog" menu-props="offsetY"></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="3">
        <v-text-field v-model="search" clearable :label="$t('fields.detail')"></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="logdata"
      :search="search"
      :custom-filter="customSearch"
      class="transparent table-custom"
      :items-per-page.sync="itemPerPage"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
      show-expand
      :sort-by="sortby"
      :sort-desc="sortdesc"
      item-key="idx"
      :page.sync="page"
    >
      <template v-slot:expanded-item="{item, headers}">
        <td :colspan="headers.length">
          <v-row>
            <v-col cols="5">
              <i18n path="fields.thread" />
              <div>{{item.thread}}</div>
            </v-col>
            <v-col cols="7">
              <i18n path="fields.place" />
              <div>{{item.place}}</div>
            </v-col>
          </v-row>
        </td>
      </template>
    </v-data-table>
  </v-main>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
// import pako from "pako";

export default {
  name: "Logs",
  mixins: [commonmixin],
  data() {
    return {
      logdata: [],
      logs: [],
      logfile: "log.log",
      page: 1,
      sortby: "created",
      sortdesc: true,
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.type"),
          value: "type",
        },
        {
          text: this.$t("fields.text"),
          value: "text",
        },
      ],
    };
  },
  watch: {
    logfile() {
      this.page = 1;
    },
  },
  methods: {
    customSearch(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleLowerCase().indexOf(search) !== -1
      );
    },
    loadLog() {
      if (!this.logfile) return;
      this.$api.getServerLog(this.logfile).then((r) => {
        this.logdata = [];
        r.split("\n").forEach((e, ind) => {
          if (!e) return;
          const res = /^(.{23})\s(.+?)\s(.+?)\s(.+?)\s(.+?)\s(.+)\r?$/i.exec(e);
          if (res) {
            this.logdata.push({
              idx: ind,
              created: res[1],
              type: res[2],
              thread: res[3],
              place: res[4] + res[5],
              text: res[6],
            });
          } else {
            this.logdata.push({
              idx: ind,
              text: e,
            });
          }
        });
        this.sortby = "created";
        this.sortdesc = true;
      });
    },
  },
  mounted() {
    this.$api.loadLogsFiles().then((r) => {
      this.logs = r.sort();
    });
    this.loadLog();
  },
};
</script>

<style>
</style>