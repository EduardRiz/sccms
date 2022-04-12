<template>
  <div class="main-div">
    <v-row dense>
      <v-col class="col-center">{{name}}</v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row dense>
      <v-tooltip bottom>
        <template #activator="{on}">
          <v-col class="col-center" v-on="on">
            <v-icon x-small class="mr-1" color="primary">mdi-account</v-icon>
            <span>{{clients}}</span>
          </v-col>
        </template>
        <i18n path="tt.pandbcl">
          <template #tag>{{name}}</template>
        </i18n>
      </v-tooltip>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
        <template #activator="{on}">
          <v-col class="col-center" v-on="on">
            <v-icon x-small class="mr-1" color="primary">mdi-key</v-icon>
            <span>{{remain}}</span>
          </v-col>
        </template>
        <i18n path="tt.pandbk">
          <template #tag>{{name}}</template>
        </i18n>
      </v-tooltip>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "DashboardCounter",
  props: {
    item: Object,
    name: String,
  },
  computed: {
    nm() {
      return this.name;
    },
    clients() {
      return this.item.clients ? this.item.clients : 0;
    },
    keys() {
      return this.item.keys ? this.item.keys : 0;
    },
    remain() {
      return this.keys - this.clients;
    },
  },
};
</script>

<style scoped>
.main-div {
  width: 100px;
}
.col-center {
  text-align: center;
}
</style>