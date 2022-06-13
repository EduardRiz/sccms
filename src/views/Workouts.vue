<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <v-spacer></v-spacer>
      <v-col cols="2">
        <v-select
          v-model="filter.service"
          :items="$store.getters['services/list']($store.getters['session/services'])"
          :label="$t('fields.service')"
          item-text="info.name"
          item-value="idx"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="filter.room"
          :items="$store.getters['rooms/items']"
          :label="$t('fields.room')"
          item-text="info.name"
          item-value="idx"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="filter.coach"
          :items="$store.getters['coachs/items']"
          :label="$t('fields.coach')"
          item-text="info.name"
          item-value="idx"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select v-model="filter.tag" :items="tags" :label="$t('fields.tags')" clearable></v-select>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-col>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="records"
      :search="search"
      :items-per-page.sync="itemPerPage"
      item-key="idx"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)" v-if="$store.getters['session/testPowerUser']">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.service="{ item }">
        <sc-record-info :idx="item.service" store="services/item" />
      </template>
      <template v-slot:item.wodate="{ item }">
        <span v-if="item.fixdate">{{item.fixdate | dt-only}}</span>
        <span v-else-if="item.dayofweek">{{$t("week")[item.dayofweek-1].text}}</span>
        <span v-else>?</span>
      </template>
      <template v-slot:item.color="{ item }">
        <v-icon :color="item.color?item.color:'white'">mdi-circle</v-icon>
      </template>
      <template v-slot:item.beginat="{ item }">
        <span>{{item.beginat}}</span>
      </template>
      <template v-slot:item.duration="{ item }">
        <span>{{item.duration+" min"}}</span>
      </template>
      <template v-slot:item.coach="{ item }">
        <sc-record-info :idx="item.coach" store="coachs/item" />
      </template>
      <template v-slot:item.room="{ item }">
        <sc-record-info :idx="item.room" store="rooms/item" />
      </template>
      <template v-slot:item.info.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:footer.prepend>
        <v-btn
          fab
          @click="edit(null)"
          dark
          class="pink my-1"
          v-if="$store.getters['session/testPowerUser']"
        >
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-btn
              fab
              color="primary"
              class="ml-2 my-1"
              @click="d_showcalendar=true"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon fab>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <i18n path="tt.workoutcalendar" />
        </v-tooltip>
      </template>
    </v-data-table>
    <WorkoutCalendar v-model="d_showcalendar" />
    <WorkoutDialog v-model="d_edit" :record="item" />
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import WorkoutCalendar from "@/components/workout/WorkoutCalendar.vue";
import WorkoutDialog from "@/components/dialogs/WorkoutDialog.vue";

const store_module = "workouts";
const DEF = { info: { status: "OK" }, settings: {} };
export default {
  name: "Workouts",
  mixins: [commonmixin],
  components: { WorkoutCalendar, WorkoutDialog },
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
      item: { ...DEF },
      d_edit: false,
      d_showcalendar: false,
      filter: {},
      headers: [
        {
          text: this.$t("fields.name"),
          value: "info.name",
        },
        {
          text: "",
          sortable: false,
          value: "color",
          align: "center",
        },
        {
          text: this.$t("fields.wodates"),
          value: "wodate",
          align: "center",
        },
        {
          text: this.$t("fields.wotimes"),
          value: "beginat",
          align: "center",
        },
        {
          text: this.$t("fields.wodurations"),
          value: "duration",
          align: "center",
        },
        {
          text: this.$t("fields.service"),
          filter: (value) => {
            if (!this.filter.service) return true;
            return value == this.filter.service;
          },
          value: "service",
        },
        {
          text: this.$t("fields.coach"),
          filter: (value) => {
            if (!this.filter.coach) return true;
            return value == this.filter.coach;
          },
          value: "coach",
        },
        {
          text: this.$t("fields.room"),
          filter: (value) => {
            if (!this.filter.room) return true;
            return value == this.filter.room;
          },
          value: "room",
        },
        {
          text: this.$t("fields.status"),
          value: "info.status",
        },
        {
          text: this.$t("fields.tags"),
          value: "info.tags",
          filter: (value) => {
            if (!this.filter.tag) return true;
            return value && value.indexOf(this.filter.tag) != -1;
          },
        },
      ],
    };
  },
  methods: {
    edit(i) {
      if (!i) i = { ...DEF };
      this.item = { ...i };
      this.d_edit = true;
    },
    save() {
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        this.d_edit = false;
      });
    },
    remove() {
      this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
        this.d_edit = false;
      });
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
    if (!this.$store.getters["coachs/isItems"]) {
      this.$store.dispatch("coachs/LOAD");
    }
    if (!this.$store.getters["sysvars/isColors"]) {
      this.$store.dispatch("sysvars/LOAD_COLORS");
    }
    if (!this.$store.getters["rooms/isItems"]) {
      this.$store.dispatch("rooms/LOAD");
    }
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
  },
};
</script>

<style>
</style>