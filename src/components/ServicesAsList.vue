<template>
  <div>
    <v-chip v-for="s in item.services" :key="s" class="mr-1">
      <span>{{name(s)}}</span>
      <v-icon v-if="aWorkout(s)" class="ml-2" color="orange darken-4" small>mdi-calendar-month</v-icon>
      <v-icon v-if="aTimed(s)" class="ml-2" color="orange darken-4" small>mdi-progress-clock</v-icon>
      <v-icon v-if="aScalar(s)" class="ml-2" color="orange darken-4" small>mdi-counter</v-icon>
      <span v-if="vcount(s)" class="ml-2 vcount rounded-l">{{vcount(s)}}</span>
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "ServicesAsList",
  props: { item: Object },
  methods: {
    name(idx) {
      try {
        return this.$store.getters["services/item"](idx).info.name;
      } catch (error) {
        return "unnamed";
      }
    },
    aWorkout(idx) {
      try {
        return this.$store.getters["services/item"](idx).workout;
      } catch (error) {
        return false;
      }
    },
    aScalar(idx) {
      try {
        return this.$store.getters["services/item"](idx).scalar;
      } catch (error) {
        return false;
      }
    },
    aTimed(idx) {
      try {
        return this.$store.getters["services/item"](idx).timed;
      } catch (error) {
        return false;
      }
    },
    vcount(idx) {
      try {
        if (this.aTimed(idx))
          return this.item.settings["s" + idx].spendmin + "min";
        if (this.aScalar(idx)) return this.item.settings["s" + idx].vcount;
        return this.item.settings["s" + idx].visits
          ? this.item.settings["s" + idx].vcount
          : false;
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.vcount {
  color: white;
  /*  border: 1px solid grey;*/
  margin-right: -11px !important;
  background: cornflowerblue;
  padding: 12px !important;
}
</style>