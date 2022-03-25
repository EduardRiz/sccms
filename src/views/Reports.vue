<template>
  <v-sheet class="sc-page-sheet">
    <v-sheet v-if="!d_report">
      <v-row class="my-2">
        <v-spacer></v-spacer>
        <v-btn icon class="error ma-4" dark to="/">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
      <v-row justify="center" class="mt-10">
        <v-card
          v-for="r in $t('reports')"
          :key="r.id"
          ripple
          raised
          elevation="10"
          rounded="xl"
          width="300"
          height="200"
          class="orange div-as-button ma-4"
          @click.prevent="openReport(r)"
        >
          <v-card-title>
            <v-icon color="white" x-large class="mr-2">{{r.icon}}</v-icon>
            <span>{{r.title}}</span>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div>{{r.text}}</div>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-row>
    </v-sheet>
    <v-sheet v-else class="mt-3 px-2 radius-25">
      <component ref="rpt" :is="editType" v-model="d_report" :item="report"></component>
    </v-sheet>
  </v-sheet>
</template>

<script>
import Reports from "@/components/reports";
export default {
  name: "Reports",
  components: { ...Reports },
  data() {
    return {
      d_report: false,
      report: null,
      editType: null,
    };
  },
  methods: {
    openReport(r) {
      this.report = r;
      this.editType = "Report-" + r.id;
      this.d_report = true;
    },
  },
};
</script>

<style>
</style>