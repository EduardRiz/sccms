<template>
  <div class="my-4">
    <div>{{$t("fields.hours")}}</div>
    <div class="text-h5 mt-4">{{hours|time_interval}}</div>
    <v-btn
      small
      v-for="(h,i) in hours"
      :key="i"
      icon
      :class="'ma-1 '+(h?'success':'')"
      @click="toggle(i)"
      :outlined="cur==i"
      :dark="h==1"
    >{{i}}</v-btn>
    <v-btn icon @click="clear" color="error">
      <v-icon>mdi-close-circle</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "time-editor",
  props: {
    value: Array,
  },
  data() {
    return {
      hours: [],
      cur: null,
    };
  },
  // computed: {
  //    hours_() {
  //      return this.value;
  //    },
  // },
  watch: {
    value() {
      this.hours = this.value;
    },
  },
  methods: {
    save() {
      this.$emit("input", this.hours);
    },
    toggle(h) {
      if (this.cur != null) {
        for (let i = this.cur; i <= h; i++) {
          this.hours.splice(i, 1, this.hours[i] ? 0 : 1);
        }
      }
      this.cur = this.cur != null ? null : h;
    },
    clear() {
      for (let i = this.cur; i < 25; i++) {
        this.hours.splice(i, 1, 0);
      }
      this.cur = null;
    },
  },
  mounted(){
      this.hours = this.value;
  }
};
</script>

<style>
</style>