<template>
  <span>{{display_name}}</span>
</template>

<script>
export default {
  name: "record-info-field",
  props: {
    store: String,
    prop: {
      default: "name",
      type: String,
    },
    baseprop: {
      default: "info",
      type: String,
    },
    idx: Number,
    value: {
      default: 0,
      type: Number,
    },
  },
  computed: {
    display_name() {
      try {
        const rec = this.$store.getters[this.store](
          this.idx ? this.idx : this.value
        );
        const pr = this.prop.split(".");
        if (pr.length > 1) {
          return rec[this.baseprop][pr[0]][pr[1]];
        }
        return rec[this.baseprop][this.prop];
      } catch (error) {
        return "";
      }
    },
  },
};
</script>

<style>
</style>