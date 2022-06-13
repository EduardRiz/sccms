<template>
  <v-chip :color="colorCode" :text-color="textColor">
    <span>{{startTime}}</span>
    <span class="mx-1">-</span>
    <span>{{endTime}}</span>
  </v-chip>
</template>

<script>
import colors from "@/colorfunc.js";

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
    textColor(){
      return colors.invertColor(this.color, true);
    }
  },
};
</script>

<style>
</style>