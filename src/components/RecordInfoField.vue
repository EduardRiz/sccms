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
      type: String
    },
    value: {
      default: 0,
      type: Number,
    }
  },
  computed: {
    display_name() {
      try {
        return this.$store.getters[this.store](this.value).info[this.prop];
      } catch (error) {
        return "";
      }
    },
  },
};
</script>

<style>
</style>