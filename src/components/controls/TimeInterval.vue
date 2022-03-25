<template>
  <v-chip :color="colorCode">
    <span>{{startTime}}</span>
    <span class="mx-1">-</span>
    <span>{{endTime}}</span>
  </v-chip>
</template>

<script>
export default {
  name: "TimeInterval",
  props: ["start", "duration", "color"],
  computed: {
    mtime() {
      return this.$moment("1970-01-01 " + this.start);
    },
    startTime() {
      return this.mtime.format("HH:mm");
    },
    endTime() {
      return this.mtime.add(parseInt(this.duration), "m").format("HH:mm");
    },
    colorCode() {
      return this.color;
    },
  },
};
</script>

<style>
</style>