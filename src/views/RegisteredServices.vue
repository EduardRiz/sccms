<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-row align="center" align-content="center">
      <i18n path="menu.regservs" class="ml-4 text-h6" />
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-select v-model="filter.tag" :items="tags" :label="$t('fields.tags')" clearable></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="records"
      :search="search"
      :items-per-page.sync="itemPerPage"
      item-key="idx"
      show-expand
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.client="{ item }">
        <sc-record-info :idx="item.client" store="clients/item" />
      </template>
      <template v-slot:item.price="{ item }">
        <span v-if="item.tariff">{{(item.tariff.price*100) | currency}}</span>
      </template>
      <template v-slot:item.fromDate="{ item }">
        <span>{{item.fromDate | dt-only}}</span>
      </template>
      <template v-slot:item.toDate="{ item }">
        <span>{{item.toDate | dt-only}}</span>
      </template>
      <template v-slot:item.service="{ item }">
        <sc-record-info :idx="item.service" store="services/item" />
      </template>
      <template v-slot:item.abonement="{ item }">
        <sc-record-info
          :idx="item.abonement"
          store="soldabonements/item"
          prop="info.name"
          baseprop="abonement"
        />
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
const store_module = "regservices";

export default {
  name: "RegisteredServices",
  mixins: [commonmixin],
  computed: {
    records() {
      return this.$store.getters[store_module + "/items"];
    },
    tags() {
      return this.$store.getters[store_module + "/tags"];
    },
  },
  data() {
    return {
      filter: {},
      headers: [
        {
          text: this.$t("fields.created"),
          value: "audit.created",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.abonement"),
          value: "abonement",
        },
        {
          text: this.$t("fields.service"),
          value: "service",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
        },
        {
          text: this.$t("fields.fromDate"),
          value: "fromDate",
        },
        {
          text: this.$t("fields.toDate"),
          value: "toDate",
        },
        {
          text: this.$t("fields.tags"),
          value: "tags",
          filter: (value) => {
            if (!this.filter.tag) return true;
            return value && value.indexOf(this.filter.tag) != -1;
          },
        },
      ],
    };
  },
  methods: {
    // updateTags() {
    //   try {
    //     this.records.forEach((e) => {
    //       if (e.info.tags) {
    //         this.tags = this.tags.concat(e.info.tags);
    //       }
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   this.tags = this.tags.filter((value, index, self) => {
    //     return self.indexOf(value) === index;
    //   });
    // },
    // edit(i) {
    //   this.item = { ...i };
    //   this.d_edit = true;
    // },
    // save() {
    //   if (this.item.info.tags && this.item.info.tags.length)
    //     this.item.tagsStr = this.item.info.tags.join(",");
    //   this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
    //     this.updateTags();
    //     this.d_edit = false;
    //   });
    // },
    // remove() {
    //   this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
    //     this.updateTags();
    //     this.d_edit = false;
    //   });
    // },
  },
  mounted() {
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    if (!this.$store.getters["clients/isItems"]) {
      this.$store.dispatch("clients/LOAD");
    }
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
    if (!this.$store.getters["soldabonements/isItems"]) {
      this.$store.dispatch("soldabonements/LOAD");
    }
  },
};
</script>

<style>
</style>