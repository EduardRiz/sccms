<template>
  <v-row v-if="tariff">
    <v-col :class="priceClass+' d-flex'" align-self="center" cols="2">
      <span>{{price | currency}}</span>
    </v-col>
    <v-col v-if="showCounter" cols="2">
      <v-text-field
        v-model="service.count"
        prepend-icon="mdi-close"
        type="number"
        min="1"
        width="100"
      ></v-text-field>
    </v-col>
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
        this.tariff.price * 100 * (this.service.count ? this.service.count : 1)
      );
    },
    priceClass() {
      return this.large ? "price-large" : "text-h5";
    },
    showCounter() {
      try {
        return this.service.params.isscalar;
      } catch (error) {
        return false;
      }
    },
  },
  watch: {
    service() {
      try {
        if (!this.service.count) this.$set(this.service, "count", 1);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    try {
      if (this.service && !this.service.count) this.$set(this.service, "count", 1);
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
</style>