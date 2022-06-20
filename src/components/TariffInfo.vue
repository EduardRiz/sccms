<template>
  <v-row v-if="tariff">
    <v-col :class="priceClass+' d-flex justify-end'" align-self="center" cols="4">
      <div class="price-span">{{price | currency}}</div>
      <div v-if="showCounter" class="counter-div ml-2">
        <v-btn icon @click="--service.count" :disabled="service.count<2">
          <v-icon>mdi-arrow-left-circle-outline</v-icon>
        </v-btn>
        <v-chip color="success">{{service.count}}</v-chip>
        <v-btn icon @click="++service.count">
          <v-icon>mdi-arrow-right-circle-outline</v-icon>
        </v-btn>
      </div>
    </v-col>
    <!-- <v-col v-if="showCounter" cols="2">
      <v-text-field
        v-model="service.count"
        prepend-icon="mdi-close"
        type="number"
        min="1"
        width="100"
      ></v-text-field>
    </v-col>-->
    <v-col>
      <v-row no-gutters>
        <v-col cols="12">{{tariff.info.name}}</v-col>
        <v-col class="d-flex" align-self="center">
          <sc-week-days class="ml-n1" :days="tariff.time.days" />
          <span class="mx-2">{{tariff.duration | duration_filter}}</span>
          <span class="mx-2">{{tariff.time.hours | time_interval}}</span>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "tariff-info",
  props: {
    tariff: Object,
    large: Boolean,
    service: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    price() {
      return (
        this.tariff.price * (this.service.count ? this.service.count : 1)
      );
    },
    priceClass() {
      return this.large ? "price-large" : "text-h5";
    },
    showCounter() {
      try {
        return this.service.scalar;
      } catch (error) {
        return false;
      }
    },
  },
  watch: {
    service() {
      try {
        if (this.service && !this.service.count)
          this.$set(this.service, "count", 1);
      } catch (error) {
        console.log(this.service, error);
      }
    },
  },
  mounted() {
    try {
      if (this.service && !this.service.count)
        this.$set(this.service, "count", 1);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.price-large {
  font-size: 2rem !important;
  font-weight: 800;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}
.counter-div {
  /* position: absolute; */
  /* left: 95px; */
}
.price-span{
  padding-top: 3px;
}

</style>