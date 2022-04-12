<template>
  <div>
    <v-row align="center" align-content="center">
      <i18n path="menu.tariffs" class="ml-3 text-h5" />
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-select
          v-model="filter.type"
          :items="$t('tariff_types')"
          :label="$t('fields.tariff_type')"
          clearable
          v-if="alltypes"
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-select v-model="filter.tag" :items="tags" :label="$t('fields.tags')" clearable></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-col>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="records"
      :search="search"
      item-key="idx"
      :show-select="isSelectable"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)" v-if="$store.getters['session/testPowerUser']">
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
      <template v-slot:item.spend="{ item }">
        <span>{{item.duration | spend_filter}}</span>
      </template>
      <template v-slot:item.price="{ item }">{{item.price*100 | currency}}</template>
      <template v-slot:item.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:footer.prepend>
        <v-btn fab @click="edit(null)" dark class="pink my-1" v-if="$store.getters['session/testPowerUser']">
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
        <v-btn fab @click="saveTariffs" dark class="accept-btn success" v-if="isSelectable">
          <v-icon color="white">mdi-check</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <sc-tariff-dialog v-model="d_edit" :item.sync="item" :type="type" />
  </div>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
//import TariffDialog from "@/components/dialogs/TariffDialog";
const store_module = "tariffs";
const DEF_ITEM = {
  info: { status: "OK" },
  type: "ABONEMENT",
  duration: {
    type: "m",
    value: 1,
  },
};

export default {
  mixins: [commonmixin],
  props: {
    sels: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default: "ABONEMENT",
    },
    isSelectable: {
      type: Boolean,
      default: false,
    },
    alltypes: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "sc-tariff-dialog": () => import("@/components/dialogs/TariffDialog"),
  },
  computed: {
    selected2() {
      return this.value;
    },
    records() {
      if (this.alltypes) return this.$store.getters[store_module + "/items"];
      return this.$store.getters[store_module + "/itemsByType"](this.type);
    },
    tags() {
      return this.$store.getters[store_module + "/tags"];
    },
  },
  data() {
    return {
      selected: [],
      item: { info: {} },
      d_edit: false,
      filter: {},
      headers: [
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
          text: this.$t("fields.spend"),
          value: "spend",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
        },
        {
          text: this.$t("fields.tariff_type"),
          value: "type",
          filter: (value) => {
            if (!this.filter.type) return true;
            return value == this.filter.type;
          },
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
  watch: {
    sels(v) {
      //      console.log("watch", v, this.sels);
      this.selected = [...v];
    },
  },
  methods: {
    saveTariffs() {
      let a = [];
      try {
        this.selected.forEach((e) => {
          a.push(e.idx);
        });
      } catch (error) {
        console.log(error.message);
      }
      this.$emit("onSave", a);
    },
    edit(i) {
      this.item = this.$api.copy(i, DEF_ITEM);
      this.d_edit = true;
    },
  },
  mounted() {
    if (this.$store.getters["session/testPowerUser"]) {
      this.headers = [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
        ...this.headers,
      ];
    }
    if (!this.$store.getters["dicts/isItems"]) {
      this.$store.dispatch("dicts/LOAD");
    }
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    this.selected = [...this.sels];
  },
};
</script>

<style scoped>
.accept-btn {
  left: 70px;
}
</style>