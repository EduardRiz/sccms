<template>
  <v-tooltip bottom transition="scale-transition" color="blue">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" style="height:100%;">
        <div v-if="isPastInMonth" class="white brown--text ml-2" style="height:100%;">
          <div :style="opacityStyle">
            <span class="ml-2">{{pevent.start.hour | correctTime}}</span>
            <span>:</span>
            <span>{{pevent.start.minute | correctTime}}</span>
            <span class="ml-2">{{evt.name}}</span>
          </div>
        </div>
        <div v-if="isPastNonMonth" class="white ml-2" style="height:100%;">
          <div :style="opacityStyle" class="brown--text">
            <span class="ml-2">{{pevent.start.hour | correctTime}}</span>
            <span>:</span>
            <span>{{pevent.start.minute | correctTime}}</span>
            <span class="ml-2">{{evt.name}}</span>
          </div>
        </div>
        <div v-else-if="day.past" class="white brown--text ml-2" style="height:100%;">
          <span class="ml-2">{{pevent.start.hour | correctTime}}</span>
          <span>:</span>
          <span>{{pevent.start.minute | correctTime}}</span>
          <div class="ml-2">{{evt.name}}</div>
        </div>
        <div
          v-else
          :class="realEventClass+' ml-3'"
          :style="{height:'100%','background-color':backColor}"
        >
          <span class="ml-2">{{pevent.start.hour | correctTime}}</span>
          <span>:</span>
          <span>{{pevent.start.minute | correctTime}}</span>
          <span class="ml-2">{{evt.name}}</span>
        </div>
      </div>
    </template>
    <div>
      <table>
        <tr>
          <td colspan="2" align="center">{{evt.name}}</td>
        </tr>
        <tr>
          <td colspan="2" align="center">
            <span>{{pevent.start.hour | correctTime}}</span>
            <span>:</span>
            <span>{{pevent.start.minute | correctTime}}</span>
            <span>&nbsp;-&nbsp;</span>
            <span>{{pevent.end.hour | correctTime}}</span>
            <span>:</span>
            <span>{{pevent.end.minute | correctTime}}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <hr />
          </td>
        </tr>
        <tr>
          <td>
            <v-icon v-text="$t('icons.coachs')" dark class="pr-4" />
          </td>
          <td align="right">
            <sc-record-info :idx="evt.workout.coach" store="coachs/item" />
          </td>
        </tr>
        <tr>
          <td>
            <v-icon v-text="$t('icons.rooms')" dark />
          </td>
          <td align="right">
            <sc-record-info :idx="evt.workout.room" store="rooms/item" />
          </td>
        </tr>
        <tr>
          <td>
            <v-icon v-text="$t('icons.services')" dark />
          </td>
          <td align="right">
            <sc-record-info :idx="evt.workout.service" store="services/item" />
          </td>
        </tr>
      </table>
    </div>
  </v-tooltip>
</template>

<script>
export default {
  name: "EventWithTooltip",
  props: {
    event: Object,
    parsed: Object,
    day: Object,
    type: String,
  },
  filters: {
    correctTime(v) {
      if (v == 0) return "00";
      if (v < 10) return "0" + v;
      return v;
    },
  },
  computed: {
    backColor() {
      try {
        return this.event.workout.color;
      } catch (error) {
        return "primary";
      }
    },
    realEventClass() {
      return this.type == "day" ? " subtitle-2" : "";
    },
    isPastInMonth() {
      return this.day.past && this.type == "month";
    },
    isPastNonMonth() {
      return this.day.past && (this.type == "week" || this.type == "day");
    },
    evt() {
      return this.event;
    },
    opacityStyle() {
      try {
        return {
          height: "100%",
          "background-color": this.backColor + "33",
        };
      } catch (error) {
        return {};
      }
    },
    pevent() {
      return this.parsed;
    },
  },
};
</script>

<style>
</style>