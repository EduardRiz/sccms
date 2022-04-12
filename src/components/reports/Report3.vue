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
      <v-spacer></v-spacer>
      <v-btn icon :disabled="items.length==0" @click.prevent="d_print=true">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <export-excel :data="items">
        <v-btn icon :disabled="items.length==0">
          <v-icon>mdi-microsoft-excel</v-icon>
        </v-btn>
      </export-excel>
      <v-btn icon>
        <v-icon>mdi-xml</v-icon>
      </v-btn>
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
        <template #item.count="{item}">
          <span v-if="item.count">{{item.count}}</span>
        </template>
        <template #body.append>
          <tr>
            <td :colspan="headers.length-1"></td>
            <td align="right">{{items.length}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-row>
    <sc-printdata-dialog
      :items="items"
      :headers="headers"
      v-model="d_print"
      :report="report"
      :range="range"
    />
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "Report3",
  mixins: [commonmixin],
  props: { value: Boolean, item: Object },
  data() {
    return {
      range: [],
      d_print: false,
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.service"),
          value: "service",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
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
          text: this.$t("fields.room"),
          value: "room",
        },
        {
          text: this.$t("fields.count"),
          value: "count",
          align: "right",
        },
      ],
    };
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
        .apiGetRequest("/cms/reports/3", { range: this.range.join("~") })
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