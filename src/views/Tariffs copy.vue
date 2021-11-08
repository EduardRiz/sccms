<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-row align="center" align-content="center">
      <i18n path="menu.tariffs" class="ml-3 text-h5" />
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
      item-key="idx"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.days="{ item }">
        <sc-week-days v-if="item.time" :days="item.time.days" />
      </template>
      <template v-slot:item.hours="{ item }">
        <span v-if="item.time">{{item.time.hours | time_interval}}</span>
      </template>
      <template v-slot:item.duration="{ item }">
        <span>{{item.duration | duration_filter}}</span>
      </template>
      <template v-slot:item.price="{ item }">{{item.price*100 | currency}}</template>
      <template v-slot:item.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:body.append>
        <div class="add-button-div">
          <v-btn fab absolute bottom @click="edit(null)" dark class="pink">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <sc-tariff-dialog v-model="d_edit" :item.sync="item" />
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import TariffDialog from "@/components/TariffDialog";
const store_module = "tariffs";

export default {
  name: "Tariffs",
  mixins: [commonmixin],
  components: { "sc-tariff-dialog": TariffDialog },
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
      item: { info: {} },
      d_edit: false,
      filter: {},
      headers: [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
        {
          text: this.$t("fields.name"),
          value: "info.name",
        },
        // {
        //   text: this.$t("fields.description"),
        //   value: "info.description",
        // },
        {
          text: this.$t("fields.days"),
          value: "days",
        },
        {
          text: this.$t("fields.hours"),
          value: "hours",
        },
        {
          text: this.$t("fields.duration"),
          value: "duration",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
        },
        {
          text: this.$t("fields.tariff_type"),
          value: "type",
        },
        {
          text: this.$t("fields.tags"),
          value: "info.tags",
          filter: (value) => {
            if (!this.filter.tag) return true;
            return value && value.indexOf(this.filter.tag) != -1;
          },
        },
        {
          text: this.$t("fields.status"),
          value: "status",
        },
      ],
    };
  },
  methods: {
    edit(i) {
      this.item = i ? { ...i } : null;
      console.log(i, this.item);
      this.d_edit = true;
    },
  },
  mounted() {
    if (!this.$store.getters["dicts/isItems"]) {
      this.$store.dispatch("dicts/LOAD");
    }
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
  },
};
</script>

<style>
</style>