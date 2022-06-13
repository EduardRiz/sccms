<template>
  <v-dialog v-model="isActive" fullscreen>
    <v-card>
      <v-card-title>
        <v-btn icon x-large @click="printdoc" class="offprint">
          <v-icon color="success">mdi-printer</v-icon>
        </v-btn>
        <v-icon class="mr-4">{{$t("report.icons."+report.label)}}</v-icon>
        <span>{{$t("report.title."+report.label)}}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('input', false)" class="offprint">
          <v-icon color="error">mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="range">
        <i18n path="report.period">
          <template #st>{{rangeStart}}</template>
          <template #ed>{{rangeEnd}}</template>
        </i18n>
        <table v-if="!isFilterEmpty">
          <tr>
            <td colspan="2">
              <i18n path="report.filterby" />
            </td>
          </tr>
          <template v-for="(v,k) in filter">
            <tr v-if="v" :key="k">
              <td>
                <i18n :path="'fields.'+k" style="margin-right: 12px;"/>
              </td>
              <th style="text-align: left;">{{v}}</th>
            </tr>
          </template>
        </table>
      </v-card-text>
      <slot name="header"></slot>

      <v-card-text>
        <v-simple-table dense>
          <thead>
            <tr>
              <th>#</th>
              <th v-for="h in headers" :key="h.value">{{h.text}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,pos) in items" :key="pos">
              <td>{{pos+1}}</td>
              <template v-for="h in headers">
                <td :key="h.value" v-if="h.value=='price'" align="right">{{item[h.value]|currency}}</td>
                <td :key="h.value" v-else-if="h.value=='duration'" align="right">{{item|fduration}}</td>
                <td :key="h.value" v-else :align="h.align">{{item[h.value]}}</td>
              </template>
            </tr>
            <slot name="tablefooter"></slot>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <slot name="footer"></slot>
      <v-card-text class="text-right">
        <i18n path="report.created">
          <template #ts>{{$moment().format("YYYY-MM-DD HH:mm")}}</template>
        </i18n>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

export default {
  name: "PrintDataDialog",
  props: {
    items: Array,
    headers: Array,
    range: Array,
    value: Boolean,
    report: Object,
    filter: Object,
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    printdoc() {
      window.print();
    },
  },
  filters: {
    fduration(i) {
      try {
        return moment
          .duration(moment(i.todate).diff(moment(i.fromdate)))
          .humanize();
      } catch (error) {
        return "";
      }
    },
  },
  computed: {
    isActive() {
      return this.value;
    },
    isFilterEmpty() {
      for (const k in this.filter) {
        if (this.filter[k]) return false;
      }
      return true;
    },
    rangeStart() {
      try {
        return this.$moment(this.range[0]).format("YYYY-MM-DD");
      } catch (error) {
        return this.$moment().format("YYYY-MM-DD");
      }
    },
    rangeEnd() {
      try {
        return this.$moment(this.range[1]).format("YYYY-MM-DD");
      } catch (error) {
        return this.$moment().format("YYYY-MM-DD");
      }
    },
  },
};
</script>

<style scoped>
@media print {
  .offprint {
    display: none;
  }
  body {
    margin: 0;
    color: #000;
    background-color: #fff;
  }
}
</style>
