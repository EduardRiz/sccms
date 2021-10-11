<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-tabs v-model="tab" align-with-title>
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="item in items" :key="item">
        <i18n :path="'dict.'+item" />
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="times">
        <v-card flat>
          <v-card-text>table of times</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item key="groups">
        <v-card flat>
          <v-card-text>table of groups</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-sheet>
</template>

<script>
export default {
  name: "Dictionaries",
  data() {
    return {
      items: ["times","groups"],
      tab: null,
    };
  },
};
</script>

<style>
</style>