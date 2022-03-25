<template>
  <v-row dense no-gutters>
    <v-col cols="3" align-self="center" class="text-center">
      <v-avatar v-if="rec.image" size="40">
        <v-img alt="Avatar" :src="$api.publicImgLink(rec.image)" />
      </v-avatar>
    </v-col>
    <v-col cols="9" align-self="center"><v-subheader>{{rec.client}}</v-subheader></v-col>
  </v-row>
</template>

<script>
export default {
  name: "ClientWithAvatar",
  props: { item: Object },
  computed: {
    rec() {
      return this.item;
    },
  },
};
</script>

<style>
</style>