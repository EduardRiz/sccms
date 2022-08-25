<template>
  <v-tooltip bottom nudge-bottom>
    <template #activator="{on, attrs}">
      <v-icon v-on="on" v-bind="attrs" :color="tcColor">{{tcIcon}}</v-icon>
    </template>
    <i18n :path="'testcode.'+tc" />
  </v-tooltip>
</template>

<script>
export default {
  name: "ServiceTestField",
  props: { item: Object },
  computed: {
    tcColor() {
      if (!this.item) return "grey";
      if (this.item.testcode == 0) return "green";
      if (this.item.testcode > 90) return "error";
      return "warning";
    },
    tcIcon() {
      if (!this.item) return "grey";
      if (this.item.testcode == 0) return "mdi-check";
      if (this.item.testcode > 90) return "mdi-alert";
      return "mdi-alert-outline";
    },
    isOk() {
      try {
        return this.item && this.item.testCode == 0;
      } catch (error) {
        return false;
      }
    },
    tc() {
      if (!this.item) return;
      if (!this.item.testcode) {
        const from = this.$moment(this.item.fromdate);
        const to = this.$moment(this.item.todate);
        this.$set(this.item, "testcode", 0);
        this.$set(this.item, "scalarcount", 0);
        if (this.$store.getters["session/services"].indexOf(this.item.service) == -1) {
          this.$set(this.item, "testcode", 5);
        } else if (this.item.visitcontrol && this.item.remainvisits <= 0) {
          this.$set(this.item, "testcode", 92);
        } else if (this.item.scalar && this.item.remainscalar <= 0) {
          this.$set(this.item, "testcode", 93);
        } else if (from.isAfter() || to.isBefore()) {
          this.$set(this.item, "testcode", 1);
        } else if (this.item.time.days.indexOf(this.$moment().isoWeekday()) == -1) {
          this.$set(this.item, "testcode", 2);
        } else if (this.item.time.hours[this.$moment().hour()] != 1) {
          this.$set(this.item, "testcode", 3);
        }
      }
      return this.item.testcode;
    },
  },
};
</script>

<style>
</style>