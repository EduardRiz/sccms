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
        <template #item.price="{ item }">
          <span>{{item.price | currency}}</span>
        </template>
        <!-- <template #item.image="{ item }">
          <v-avatar>
            <v-img :src="$api.api+'/img/'+item.image+'?prev='+new Date().getTime()"></v-img>
          </v-avatar>
        </template>-->
        <template #body.append>
          <tr>
            <td :colspan="headers.length-1"></td>
            <td align="right">{{total | currency}}</td>
          </tr>
        </template>
        <!-- <template #footer.prepend>
          <td :colspan="headers.length-1"></td>
          <td>{{0 | currency}}</td>
        </template>-->
      </v-data-table>
    </v-row>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "Report1",
  mixins: [commonmixin],
  props: { value: Boolean, item: Object },
  data() {
    return {
      range: [],
      total: 0,
      headers: [
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
        // {
        //   text: this.$t("fields.avatar"),
        //   value: "image",
        //   sortable: false,
        // },
        {
          text: this.$t("fields.sale"),
          value: "sale",
        },
        {
          text: this.$t("fields.tariff_type"),
          value: "ttype",
        },
        {
          text: this.$t("fields.tariff"),
          value: "tariff",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
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
        .apiGetRequest("/cms/reports/1", { range: this.range.join("~") })
        .then((data) => {
          this.items = [...data];
          this.items.forEach((e) => {
            this.total += e.price;
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