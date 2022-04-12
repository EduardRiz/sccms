<template>
  <div>
    <v-subheader>
      <i18n path="menu.workouts" />
      <v-list></v-list>
    </v-subheader>
    <v-simple-table color="yellow lighten-5">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              <i18n path="fields.name" />
            </th>
            <th class="text-left">
              <i18n path="fields.time" />
            </th>
            <th class="text-left">
              <i18n path="fields.date" />
            </th>
            <th class="text-left">
              <i18n path="fields.status" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in workouts" :key="item.name">
            <td>{{ item.info.name }}</td>
            <td>
              <sc-time-interval
                :start="item.beginat"
                :duration="item.duration"
                :color="item.color"
              />
            </td>
            <td>{{ item.fixdate?item.fixdate:$t("week")[item.dayofweek-1].text }}</td>
            <td>
              <sc-record-status :status="item.info.status" />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import TimeInterval from "@/components/controls/TimeInterval.vue";
export default {
  name: "LinkedWorkouts",
  props: { items: Array },
  components: {
    "sc-time-interval": TimeInterval,
  },
  computed: {
    workouts() {
      return this.items ? this.items : [];
    },
  },
};
</script>

<style>
</style>