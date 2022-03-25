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
        <template #body.append>
          <tr>
            <td :colspan="headers.length-1"></td>
            <td align="right">{{total}}</td>
          </tr>
        </template>
        <!-- <template #footer.prepend>
          <td :colspan="headers.length-1"></td>
          <td>{{23123 | currency}}</td>
        </template>-->
      </v-data-table>
    </v-row>
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
      total: 0,
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
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
        .apiGetRequest("/cms/reports/2", { range: this.range.join("~") })
        .then((data) => {
          this.items = [...data];
          this.items.forEach((e) => {
            this.total += e.usedcount;
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