<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2" align="center" align-content="center">
      <i18n
        :path="'menu.'+$route.name.toLowerCase()"
        class="ml-4 primary--text text-uppercase text-h4"
      ></i18n>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="opened" rounded dense color="primary">
        <v-btn :value="false">
          <i18n path="label.allvis" />
        </v-btn>
        <v-btn :value="true">
          <i18n path="label.openedvis" />
        </v-btn>
      </v-btn-toggle>
      <!-- <v-switch v-model="opened" :label="$t('label.opened')"></v-switch> -->
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
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
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-btn icon @click="remove(item)" v-if="!item.todate" v-on="on" v-bind="attrs">
              <v-icon color="primary">mdi-clock-check-outline</v-icon>
            </v-btn>
          </template>
          <i18n path="tt.clientout" />
        </v-tooltip>
      </template>
      <template v-slot:item.fromdate="{ item }">
        <span>{{item.fromdate | dt-time}}</span>
      </template>
      <template v-slot:item.comment="{ item }">
        <span>{{item.details?item.details.comment:''}}</span>
      </template>
      <template v-slot:item.todate="{ item }">
        <span>{{item.todate | dt-time}}</span>
      </template>
      <template v-slot:item.duration="{ item }">
        <span>{{$moment.duration($moment(item.todate).diff($moment(item.fromdate))).asMinutes() | minutes}}</span>
      </template>
    </v-data-table>
    <sc-confirm-dialog v-model="d_confirm" mode="settime" @click:ok="remove" />
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
          text: this.$t("fields.comment"),
          value: "comment",
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
    remove(i) {
      this.d_confirm = i ? true : false;
      if (!i) {
        this.$api.closeVisit(this.id).then((r) => {
          if (r == "ok") {
            this.loadData();
          }
        });
      }
      this.id = i ? i.idx : null;
    },
    loadData() {
      this.$api.loadVisits().then((r) => {
        this.items = [...r];
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