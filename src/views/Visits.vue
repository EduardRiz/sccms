<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-card-title>
      <v-spacer></v-spacer>
      <v-switch v-model="opened" label="opened"></v-switch>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      item-key="idx"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="remove(item)" v-if="!item.todate">
          <v-icon color="primary">mdi-clock-check-outline</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.fromdate="{ item }">
        <span>{{item.fromdate | dt-time}}</span>
      </template>
      <template v-slot:item.todate="{ item }">
        <span>{{item.todate | dt-time}}</span>
      </template>
      <template v-slot:item.duration="{ item }">
        <span>{{$moment.duration($moment(item.todate).diff($moment(item.fromdate))).asMinutes() | minutes}}</span>
      </template>
    </v-data-table>
    <ConfirmDialog v-model="d_confirm" mode="settime" @click:ok="remove" />
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "Visits",
  mixins: [commonmixin],
  filters: {
    minutes(v) {
      if (isNaN(v)) return "";
      try {
        return Math.floor(v) + " min.";
      } catch (error) {
        return "";
      }
    },
  },
  data() {
    return {
      d_confirm: false,
      opened: true,
      id: null,
      headers: [
        {
          text: this.$t("fields.club"),
          value: "scname",
        },
        {
          text: this.$t("fields.key"),
          value: "boxkey",
        },
        {
          text: this.$t("fields.keyid"),
          value: "keyid",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.visitfrom"),
          value: "fromdate",
        },
        {
          text: this.$t("fields.visitto"),
          value: "todate",
          filter: (value) => {
            if (!this.opened) return true;
            return value == null;
          },
        },
        {
          text: this.$t("fields.duration"),
          value: "duration",
        },
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
      ],
    };
  },
  methods: {
    closeVisit(i) {
      console.log(i);
    },
    remove(i) {
      this.d_confirm = i ? true : false;
      if (!i) {
        this.$api.closeVisit(this.id).then((r) => {
          console.log(r);
        });
      }
      this.id = i ? i.idx : null;
    },
  },
  mounted() {
    this.$api.loadVisits().then((r) => {
      this.items = [...r];
    });
  },
};
</script>

<style>
</style>