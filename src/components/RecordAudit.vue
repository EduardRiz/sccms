<template>
  <v-row v-if="audit_">
    <v-col cols="6">
      <div class="subtitle-2">
        <i18n path="fields.created" />
      </div>
      <div>{{audit_.created}}</div>
    </v-col>
    <v-col cols="6">
      <div class="subtitle-2 text-align-right">
        <i18n path="fields.updated" />
      </div>
      <div class="text-align-right">{{audit_.updated}}</div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "recod-audit",
  props: { audit: Object },
  computed:{
      audit_(){
          return this.audit;
      }
  }
};
</script>

<style scoped>
.text-align-right {
  text-align: right;
}
</style>