<template>
  <div v-if="testActuality">
    <v-card v-if="m.msgtype=='warn'" class="warning msg-class-main" dark>
      <v-card-title>
        <v-icon x-large class="mr-4">mdi-alert-circle</v-icon>
        <span class="text-h5">{{m.msgtitle}}</span>
      </v-card-title>
      <v-card-text class="text-center text-h6">{{m.msgtext}}</v-card-text>
    </v-card>
    <v-card v-else-if="m.msgtype=='error'" class="error msg-class-main" dark>
      <v-card-title>
        <v-icon x-large class="mr-4">mdi-alert-octagram-outline</v-icon>
        <span class="text-h5">{{m.msgtitle}}</span>
      </v-card-title>
      <v-card-text class="text-center text-h6">{{m.msgtext}}</v-card-text>
    </v-card>
    <v-card v-else class="primary msg-class-main" dark>
      <v-card-title>
        <v-icon x-large class="mr-4">mdi-information</v-icon>
        <span class="text-h5">{{m.msgtitle}}</span>
      </v-card-title>
      <v-card-text class="text-center text-h6">{{m.msgtext}}</v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "InfoMessage",
  props: { item: Object, test: Boolean },
  computed: {
    m() {
      return this.item;
    },
    testActuality() {
      if (!this.test) return true;
      if (this.item.showmode.indexOf("n") != -1) return false;
      if(this.$route.name == "Home" && this.item.showmode.indexOf("h") == -1) return false;
      if(this.$route.name == "Login" && this.item.showmode.indexOf("l") == -1) return false;
      const from = this.$moment(this.item.from_date);
      const to = this.$moment(this.item.to_date);
      return from.isBefore() && to.isAfter();
    },
  },
};
</script>

<style scoped>
.msg-class-main {
  opacity: 85%;
  border-radius: 50px 0 50px 0;
}
</style>