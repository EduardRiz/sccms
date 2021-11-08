<template>
  <div>
    <v-chip v-for="s in item.services" :key="s" class="mr-1">
      <span>{{name(s)}}</span>
      <v-icon v-if="isWorkout(s)" class="ml-2" color="orange darken-4" small>mdi-calendar-month</v-icon>
      <v-icon v-if="isScalar(s)" class="ml-2" color="orange darken-4" small>mdi-progress-clock</v-icon>
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
      return this.$store.getters["services/item"](idx).info.name;
    },
    isWorkout(idx) {
      try {
        return this.$store.getters["services/item"](idx).params.isworkout;
      } catch (error) {
        return false;
      }
    },
    isScalar(idx) {
      try {
        return this.$store.getters["services/item"](idx).params.isscalar;
      } catch (error) {
        return false;
      }
    },
    vcount(idx) {
      try {
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