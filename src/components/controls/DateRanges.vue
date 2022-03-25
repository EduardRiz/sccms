<template>
  <div style="width: 300px">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateRangeText"
          prepend-inner-icon="mdi-calendar-range"
          append-icon="mdi-clear"
          readonly
          class="right-align-date"
          v-bind="attrs"
          v-on="on"
          @click:append.prevent="apply(false)"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="dates"
        range
        no-title
        :max="$moment().format('YYYY-MM-DD')"
        @click:date="dateClick"
        first-day-of-week="1"
      >
        <v-row style="width: 300px">
          <v-col cols="12" align-self="center">
            <v-select
              :items="$t('periods')"
              dense
              v-model="period"
              :label="$t('label.period')"
              class="mx-1"
              @change="selectNewPeriod"
            ></v-select>
          </v-col>
        </v-row>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "daterange",
  props: {
    value: Array,
  },
  data() {
    return {
      period: 1,
      menu: false,
      maxdate: this.$moment().format("YYYY-MM-DD"),
      dates: [],
    };
  },
  watch: {
    value(v) {
      this.dates = [...v];
    },
  },
  computed: {
    dateRangeText() {
      if (!this.dates.length || !this.dates[0]) {
        return [this.maxdate, this.maxdate].join(" ~ ");
      }
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    dateClick() {
      if (this.dates.length == 2) this.apply(true);
    },
    selectNewPeriod() {
      let st = this.$moment().locale("lv");
      let ed = this.$moment().locale("lv");
      switch (this.period) {
        case 1:
          break;
        case 2:
          st.subtract(1, "days");
          ed = ed.subtract(1, "days");
          break;
        case 3:
          st = st.startOf("isoweek");
          break;
        case 4:
          st = st.subtract(1, "weeks").startOf("isoweek");
          ed = ed.subtract(1, "weeks").endOf("isoweek");
          break;
        case 5:
          st = st.startOf("month");
          break;
        case 6:
          st = st.subtract(1, "months").startOf("month");
          ed = ed.subtract(1, "months").endOf("month");
          break;
        case 7:
          st = st.subtract(1, "months").startOf("month");
          break;
        case 8:
          st = st.startOf("year");
          break;
        default:
          break;
      }
      this.dates = [
        ...[
          st.startOf("day").format("YYYY-MM-DD"),
          ed.endOf("day").format("YYYY-MM-DD"),
        ],
      ];
      this.apply(true);
    },
    apply(ok) {
      if (ok) {
        if (this.$moment(this.dates[0]).isAfter(this.dates[1])) {
          this.dates = [...this.dates.reverse()];
        }
        this.$emit("input", this.dates);
      } else {
        this.$emit("input", [this.maxdate, this.maxdate]);
      }
      this.dates = [];
      this.menu = false;
    },
    mounted() {},
  },
};
</script>

<style scoped>
.right-align-date >>> input {
  text-align: right;
}
</style>