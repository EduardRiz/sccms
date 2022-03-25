<template>
  <v-sheet class="radius-25">
    <v-row>
      <v-col>
        <v-icon class="mr-4">{{report.icon}}</v-icon>
        <span>{{report.title}}</span>
      </v-col>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('input',false)" icon color="primary">
        <v-icon>mdi-arrow-u-left-top-bold</v-icon>
      </v-btn>
    </v-row>
    <v-row align="center" align-content="center">
      <sc-dates-range v-model="range" class="ml-3" />
      <!-- <v-spacer></v-spacer>
      <span width="300px">
        <v-text-field v-model="search" append-icon="mdi-magnify" class="mr-3"></v-text-field>
      </span>-->
    </v-row>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        item-key="idx"
        class="idcs-fill-width"
        :footer-props="foot_props"
        :no-data-text="$t('label.nodata')"
      >
        <template #item.duration="{item}">{{item | fduration}}</template>
      </v-data-table>
    </v-row>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import moment from "moment";

export default {
  name: "Report4",
  mixins: [commonmixin],
  props: { value: Boolean, item: Object },
  data() {
    return {
      range: [],
      headers: [
        {
          text: this.$t("fields.fromDate"),
          value: "fromdate",
        },
        {
          text: this.$t("fields.toDate"),
          value: "todate",
        },
        {
          text: this.$t("fields.duration"),
          value: "duration",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.phone"),
          value: "phone",
        },
        {
          text: this.$t("fields.email"),
          value: "email",
        },
        {
          text: this.$t("fields.keyid"),
          value: "keyid",
        },
        {
          text: this.$t("fields.key"),
          value: "keyname",
        },
        {
          text: this.$t("fields.tags"),
          value: "ktags",
        },
      ],
    };
  },
  filters: {
    fduration(i) {
      try {
        return moment.duration(moment(i.todate).diff(moment(i.fromdate))).humanize();
      } catch (error) {
        return "";
      }
    },
  },
  computed: {
    report() {
      return this.item ? this.item : {};
    },
  },
  watch: {
    range() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      this.total = 0;
      this.$api
        .apiGetRequest("/cms/reports/4", { range: this.range.join("~") })
        .then((data) => {
          this.items = [...data];
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