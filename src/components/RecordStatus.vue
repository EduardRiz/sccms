<template>
  <v-icon :color="status_?'primary':'error'">{{status_?"mdi-check":"mdi-cancel"}}</v-icon>
</template>

<script>
export default {
  name: "RecordStatusIcon",
  props: {status: String},
  computed:{
      status_(){
          return this.status=='OK';
      }
  }
};
</script>

<style>
</style>