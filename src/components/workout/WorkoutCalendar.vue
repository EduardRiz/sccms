<template>
  <v-dialog v-model="isActive" fullscreen>
    <v-card class="yellow lighten-5">
      <v-card-title>
        <i18n path="dialogs.wocalendar" />
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-select
          dense
          v-model="service"
          :items="$store.getters['services/items']"
          class="ma-2"
          item-text="info.name"
          clearable
          item-value="idx"
          :label="$t('fields.service')"
          @change="getEvents"
        ></v-select>
        <v-select
          dense
          v-model="room"
          :items="$store.getters['rooms/items']"
          class="ma-2"
          item-text="info.name"
          clearable
          item-value="idx"
          :label="$t('fields.room')"
          @change="getEvents"
        ></v-select>
        <v-select
          dense
          v-model="coach"
          :items="$store.getters['coachs/items']"
          class="ma-2"
          item-text="info.name"
          clearable
          item-value="idx"
          :label="$t('fields.coach')"
          @change="getEvents"
        ></v-select>
      </v-card-actions>
      <v-card-actions dense>
        <v-btn icon @click="$refs.calendar.prev()" fab class="green lighten-4">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-subheader class="text-h5 font-weight-black">{{selectedPeriod}}</v-subheader>
        <v-btn icon @click="$refs.calendar.next()" fab class="green lighten-4">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="type" shaped>
          <v-btn v-for="btn in types" :value="btn.val" :key="btn.val" class="yellow lighten-5">
            <i18n :path="'caltypes.'+btn.val" />
            <v-icon right>{{btn.ico}}</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-btn fab icon @click="focus=$moment().format('YYYY-MM-DD')" class="ml-6 green lighten-5">
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
        <v-btn fab icon @click="refresh" class="green lighten-5">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-text class="px-4">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :weekdays="weekday"
          :type="type"
          color="primary"
          :start.sync="sd"
          first-time="06:00"
          interval-count="18"
          :short-intervals="false"
          :short-weekdays="false"
          :short-months="false"
          :end.sync="ed"
          event-overlap-threshold="15"
          :events="events"
          locale="lv"
          :now="$moment().format('YYYY-MM-DD hh:mm:ss')"
          :day-format="showDay"
          :event-color="getEventColor"
          :interval-format1="getIntervalVal"
          :show-month-on-first="false"
          @change="change"
          @click:interval="editEvent"
          @click:time="editEvent"
          @click:event="editEvent"
          @click:day="toDownLevel"
          @click:date="toDownLevel"
        >
          <template #event="{event, eventParsed, day}">
            <event-with-tooltip :event="event" :parsed="eventParsed" :day="day" :type="type" />
          </template>
          <template v-slot:day-label="{date,month,day,past,present}">
            <v-btn fab text :class="present?'primary lighten-1 mb-1':'mb-1'">
              <span>{{$moment(date).format("D. MMM")}}</span>
            </v-btn>
          </template>
          <template #day-label-header="{date}">{{date}}</template>
        </v-calendar>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('input', false)" class="primary">
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          <i18n path="button.back" />
        </v-btn>
      </v-card-actions>
    </v-card>
    <WorkoutDialog v-model="d_edit" :record="item" @update="refresh" />
  </v-dialog>
</template>

<script>
import WorkoutDialog from "@/components/dialogs/WorkoutDialog.vue";
import EventWithTooltip from "@/components/workout/EventWithTooltip.vue";
import moment from "moment";

export default {
  name: "WoCalendar",
  props: { value: Boolean },
  components: { WorkoutDialog, "event-with-tooltip": EventWithTooltip },
  computed: {
    isActive() {
      return this.value;
    },
    selectedPeriod() {
      let mom = moment;
      mom.locale("lv");
      const s = mom(this.sd);
      const e = mom(this.ed);
      if (this.type == "month")
        return s.format("YYYY MMMM").toLocaleUpperCase();

      if (this.type == "week")
        return s.format("DD. MMM YYYY.g") + " - " + e.format("DD. MMM YYYY.g");

      return s.format("LL");
    },
  },
  watch: {
    sd() {
      this.refresh();
    },
    value() {
      if (this.value) this.refresh();
    },
  },
  data() {
    return {
      coach: null,
      room: null,
      d_edit: false,
      item: null,
      service: null,
      type: "month",
      sd: new Date(),
      ed: new Date(),
      types: [
        { val: "month", ico: "mdi-calendar-month" },
        { val: "week", ico: "mdi-calendar-range" },
        { val: "day", ico: "mdi-calendar-clock" },
      ],
      weekday: [1, 2, 3, 4, 5, 6, 0],
      focus: "",
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "pink",
        "brown",
        "yellow",
        "purple",
        "teal",
        "light-blue",
        "light-green",
        "orange",
        "grey",
        "lime",
        "amber",
        "deep-orange",
        "blue-grey",
      ],
    };
  },
  methods: {
    refresh() {
      if (!this.$refs.calendar) return;
      this.getEvents();
      this.$refs.calendar.checkChange();
    },
    getIntervalVal(a) {
      return a.time;
    },
    showDay(a) {
      return a.day + "." + a.month;
    },
    getEventColor(event) {
      try {
        return event.workout.color ? event.workout.color : "error";
      } catch (error) {
        return "primary";
      }
    },
    getEventCategory(event) {
      return event.workout.info.name;
    },
    clickEvent(evt, targ) {
      console.log(evt, targ);
    },
    change(init) {
      this.sd = init.start.date;
      this.ed = init.end.date;
    },
    editEvent(event) {
      if (this.d_edit) return;
      if (event.event) {
        this.item = this.$store.getters["workouts/item"](
          event.event.workout.idx
        );
      } else {
        this.item = {
          info: { status: "OK" },
          date: event.date,
          beginat: event.beginat,
          duration: 60,
        };
      }
      this.d_edit = true;
    },
    toDownLevel(a) {
      if (this.d_edit) return;
      this.focus = a.date;
      const i = this.types.findIndex((e) => e.val == this.type);
      this.type =
        i == this.types.length - 1 ? this.types[0].val : this.types[i + 1].val;
    },
    getEvents() {
      const min = this.$moment(this.sd).startOf("day");
      const max = this.$moment(this.ed).endOf("day");
      //console.log(this.sd, this.ed);
      //let colors = [...this.colors];
      this.events = [];
      const events = [];
      this.$store.getters["workouts/items"].sort().forEach((workout) => {
        if (this.coach && workout.coach != this.coach) return;
        if (this.room && workout.room != this.room) return;
        if (this.service && workout.service != this.service) return;
        let dates = [];
        if (workout.fixdate) {
          const wodate = this.$moment(workout.fixdate + " " + workout.beginat);
          if (wodate.isAfter(max) || wodate.isBefore(min)) return;
          dates.push(wodate.valueOf());
        } else if (workout.dayofweek) {
          this.$moment().locale("lv");
          let delta = this.$moment(this.sd + " " + workout.beginat);
          while (delta.isBefore(max)) {
            if (delta.isoWeekday() == workout.dayofweek)
              dates.push(delta.valueOf());
            delta.add(1, "day");
          }
        }
        dates.forEach((sd) => {
          try {
            if (!workout.color) workout.color = "primary";
            events.push({
              name: workout.info.name,
              start: sd,
              end: sd + parseInt(workout.duration) * 60 * 1000,
              timed: true,
              workout: workout,
              color: workout.color,
            });
          } catch (error) {
            console.log(error);
          }
        });
      });
      this.events = [...events];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  mounted() {
    if (!this.$store.getters["workouts/isItems"]) {
      this.$store.dispatch("workouts/LOAD");
    }
    this.refresh();
  },
};
</script>

<style>
</style>