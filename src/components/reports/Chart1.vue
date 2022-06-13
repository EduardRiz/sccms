<template>
  <v-sheet class="radius-25">
    <v-row>
      <v-col align-self="center">
        <v-icon class="mr-4">{{$t("report.icons."+report.label)}}</v-icon>
        <span>{{$t("report.title."+report.label)}}</span>
      </v-col>
      <sc-dates-range v-model="range" class="ml-3" />
      <v-spacer></v-spacer>
      <v-btn @click="$emit('input',false)" icon color="primary">
        <v-icon>mdi-arrow-u-left-top-bold</v-icon>
      </v-btn>
    </v-row>
    <v-row>
      <v-col class="chart-wrapper" v-show="items.length">
        <apexchart ref="chart" :options="chartOptions" :series="series" height="600"></apexchart>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: "Chart1",
  props: { value: Boolean, item: Object },
  data() {
    return {
      range: [],
      items: [],
      d_print: false,

      series: [
        {
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 600,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "",
          align: "left",
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        yaxis: {
          title: {
            text: "",
          },
          labels: {
            formatter: (i) => (i % 1 == 0 ? i : ""),
          },
          min: 0,
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
        xaxis: {
          tickAmount: 24,
          title: {
            text: "",
          },
          tooltip: {
            enabled: true,
            formatter: (val) => {
              const i = val - 1;
              if (i == 0) return "0:00";
              let h = Math.floor(i / 4);
              let m = (i % 4) * 15;
              return h + ":" + (m ? m : "00");
            },
            offsetY: 4,
            style: {
              fontSize: "12px",
              fontFamily: "Roboto",
            },
          },
        },
      },
    };
  },
  computed: {
    report() {
      return this.item ? this.item : {};
    },
  },
  watch: {
    range() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      this.total = 0;
      this.$api
        .apiGetRequest("/cms/charts/1", { range: this.range.join("~") })
        .then((data) => {
          this.items = [...data];
          this.buildSeries(data);
        });
    },
    buildSeries() {
      try {
        let hours = Array.from({ length: 96 }, () => 0);
        const from = this.$moment(this.range[0]).startOf("day");
        const to = this.$moment(this.range[1]).endOf("day");
        this.items.forEach((e) => {
          try {
            let efrom = this.$moment(e.fromdate);
            if (efrom.isBefore(from)) efrom = from.clone();
            let eto = e.todate ? this.$moment(e.todate) : to.clone();
            if (eto.isAfter(to)) eto = to.clone();

            let tick = efrom.clone();
            while (tick.isBefore(eto)) {
              let ind = tick.hours() * 4 + Math.floor(tick.minutes() / 15);
              hours[ind] += 1;
              tick = tick.add(15, "minute");
            }
          } catch (error) {
            console.log(error);
          }
        });
        this.$refs.chart.updateSeries([
          {
            name: this.$t("report." + this.report.label + ".hint"),
            data: hours,
          },
        ]);
        this.$refs.chart.updateOptions(this.chartOptions);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.chartOptions.title.text = this.$t(
      "report." + this.report.label + ".title"
    );
    this.chartOptions.yaxis.title.text = this.$t(
      "report." + this.report.label + ".yaxis"
    );
    this.chartOptions.xaxis.title.text = this.$t(
      "report." + this.report.label + ".xaxis"
    );
    this.chartOptions.xaxis.categories = [
      ...Array.from({ length: 96 }, (x, i) =>
        i % 4 == 0 ? Math.floor(i / 4) + ".00" : ""
      ),
    ];
    this.loadData();
  },
};
</script>

<style scoped>
.chart-wrapper {
  height: 400px;
}
</style>