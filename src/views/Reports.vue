<template>
  <v-sheet class="sc-page-sheet">
    <v-sheet v-if="!d_report">
      <v-row class="my-2" align="center" align-content="center">
        <i18n
          :path="'menu.'+$route.name.toLowerCase()"
          class="ml-4 primary--text text-uppercase text-h4"
        ></i18n>
        <v-col align-self="center">
          <v-chip-group v-model="selgroups" column multiple>
            <v-chip
              v-for="g in $scclub.groups"
              :key="g"
              filter
              outlined
              class="mx-1 teal lighten-5"
            >
              <v-icon class="mr-1" color="yellow darken-3">mdi-folder</v-icon>
              <span>{{$t("report.group."+g)}}</span>
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn icon class="error ma-4" dark to="/">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
      <v-row justify="center" class="mt-10">
        <v-card
          v-for="r in selectedReports"
          :key="r.id"
          ripple
          raised
          elevation="10"
          rounded="xl"
          width="300"
          height="200"
          :class="(r.aclass?r.aclass:'orange')+' div-as-button ma-4'"
          @click.prevent="openReport(r)"
        >
          <v-card-title>
            <v-icon color="white" x-large class="mr-2">{{$t("report.icons."+r.label)}}</v-icon>
            <span>{{$t("report.title."+r.label)}}</span>
            <!-- <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>-->
          </v-card-title>
          <v-card-text>
            <div>{{$t("report.text."+r.label)}}</div>
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
      selgroups: [],
      d_report: false,
      report: null,
      editType: null,
    };
  },
  computed: {
    selectedReports() {
      try {
        return this.$scclub.reports.filter((r) => {
          try {
            this.selgroups.forEach((s) => {
              if (r.groups.indexOf(this.$scclub.groups[s]) != -1)
                throw new Error("is");
            });
          } catch (error) {
            return true;
          }
        });
      } catch (error) {
        return [];
      }
    },
  },
  methods: {
    openReport(r) {
      this.report = r;
      this.editType = r.id;
      this.d_report = true;
    },
    filterBy(cat) {
      console.log(cat, this.$scclub);
    },
  },
  mounted() {
    this.$scclub.groups.forEach((e, i) => this.selgroups.push(i));
  },
};
</script>

<style scoped>

</style>