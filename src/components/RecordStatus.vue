<template>
  <v-icon :color="status_?'primary':'error'">{{status_?"mdi-check":"mdi-cancel"}}</v-icon>
</template>

<script>
export default {
  name: "RecordStatusIcon",
  props: { status: String, statusi: Number },
  computed: {
    status_() {
      if (this.statusi) {
        return this.statusi == 1;
      }
      return this.status == "OK";
    },
  },
};
</script>

<style>
</style>