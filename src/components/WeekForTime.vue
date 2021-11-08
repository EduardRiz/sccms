<template>
  <span>
    <span v-for="i in 7" :key="i" :class="'mx-1 '+isActive(i)">{{$t("week")[i-1].short}}</span>
  </span>
</template>

<script>
export default {
  props: { days: Array, large: Boolean },
  computed: {
    days_() {
      return this.days;
    },
  },
  methods:{
      isActive(i){
          try {
              return this.days_.indexOf(i) == -1?"":("green--text "+(this.large?"text-h6":""));
          } catch (error) {
              return "";
          }
      }
  }
};
</script>

<style>
</style>