<template>
  <v-toolbar class="mb-2 orange lighten-5">
    <v-row dense>
      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-chip
            class="mt-2 mr-3"
            color="success"
            :to="clients?'/visits':''"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon class="mr-1">mdi-account</v-icon>
            <span>{{clients}}</span>
          </v-chip>
        </template>
        <i18n path="tt.panclin" />
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-chip
            class="mt-2 mr-3"
            color="blue lighten-3"
            :to="keys?'/keys/free':''"
            v-on="on"
            v-bind="attrs"
          >
            <v-icon class="mr-1">mdi-key</v-icon>
            <span>{{keys}}</span>
          </v-chip>
        </template>
        <i18n path="tt.pankeyava" />
      </v-tooltip>
      <template v-for="(v,n) in counters">
        <sc-counter :item="counters[n]" :key="n" :name="n" class="mr-2" />
      </template>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template #activator="{on, attrs}">
          <v-chip class="mt-2" :to="workouts?'/todaywo':''" v-on="on" v-bind="attrs">
            <v-icon small class="mr-1">{{$t("icons.workouts")}}</v-icon>
            <span>{{workouts}}</span>
          </v-chip>
        </template>
        <i18n path="tt.panwoava" />
      </v-tooltip>
    </v-row>
  </v-toolbar>
</template>

<script>
import DashboardCounter from "@/components/controls/DashboardCounter.vue";
export default {
  name: "Dashboard",
  components: {
    "sc-counter": DashboardCounter,
  },
  data() {
    return {
      counters: {},
      keys: 0,
      workouts: 0,
      clients: 0,
    };
  },
  methods: {
    //     {ct: [{count: 1, tag: "sector2"}, {count: 1, tag: "man"}], c: 1,…}
    // c: 1
    // ct: [{count: 1, tag: "sector2"}, {count: 1, tag: "man"}]
    // 0: {count: 1, tag: "sector2"}
    // 1: {count: 1, tag: "man"}
    // k: 4
    // kt: [{count: 1, tag: "sector2"}, {count: 1, tag: "woman"}, {count: 2, tag: "man"}]
    // 0: {count: 1, tag: "sector2"}
    // 1: {count: 1, tag: "woman"}
    // 2: {count: 2, tag: "man"}
    requestCount() {
      this.$api.getInOutInfo().then((r) => {
        this.counters = {};
        r.kt.forEach((e) => {
          this.$set(this.counters, e.tag, { keys: e.count });
        });
        r.ct.forEach((e) => {
          this.$set(this.counters, e.tag, {
            ...this.counters[e.tag],
            clients: e.count,
          });
        });
        this.clients = r.c;
        this.keys = r.k - this.clients;
        this.workouts = r.wo;
        //this.$set(this.counters, "total", { clients: r.c, keys: r.k });
        //this.counters.push({ tag: "total", c: r.c, k: r.k - r.c });

        //this.counters = { ...r };
      });
    },
  },
  mounted() {
    this.$root.$on("app-event/counters", (evt) => {
      if (evt.club == this.$store.getters["session/scidx"]) this.requestCount();
    });
    this.requestCount();
  },
  beforeDestroy() {
    // removing eventBus listener
    this.$root.$off("app-event/counters");
  },
};
</script>

<style>
</style>