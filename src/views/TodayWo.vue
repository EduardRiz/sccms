<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2">
      <v-spacer></v-spacer>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-row justify="center">
      <v-card
        v-for="w in items"
        :key="w.idx"
        width="300"
        :class="(w.status!=1?'error':'success')+ ' lighten-5 ma-4'"
      >
        <v-card-title :style="{'background-color':`${w.color}`}">
          <v-tooltip bottom>
            <template #activator="{on, attrs}">
              <div v-on="on" v-bind="attrs" class="workout-title"><span :style="{color: invert(w.color)}">{{w.display_name}}</span></div>
            </template>
            <span>{{w.display_name}}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-chip>
            <v-icon small class="mr-2" color="primary">mdi-account-multiple</v-icon>
            <span>{{w.clients}}</span>
          </v-chip>
        </v-card-title>
        <v-card-text>
          <div class="text-center text-h6 pt-4">{{tm(w)}}</div>
          <div class="my-2">
            <v-icon class="mr-2">{{$t("icons.services")}}</v-icon>
            <span>{{w.service}}</span>
          </div>
          <div class="my-2">
            <v-icon class="mr-2">{{$t("icons.coachs")}}</v-icon>
            {{w.coach}}
          </div>
          <div class="my-2">
            <v-icon class="mr-2">{{$t("icons.rooms")}}</v-icon>
            {{w.room}}
          </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-sheet>
</template>

<script>
import colors from "@/colorfunc.js";

export default {
  name: "TodayWorkouts",
  data() {
    return {
      items: [],
    };
  },

  methods: {
    invert(c) {
      return colors.invertColor(c, true);
    },
    tm(i) {
      const b = this.$moment(i.beginat, "HH:mm");
      //console.log(b, b.add("minutes", i.duration));
      return (
        b.format("HH:mm") + " - " + b.add(i.duration, "minutes").format("HH:mm")
      );
    },
  },
  mounted() {
    this.$api.getTodaysWorkouts().then((response) => {
      this.items = [...response];
    });
  },
};
</script>

<style scoped>
.workout-title {
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>