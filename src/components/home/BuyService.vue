<template>
  <v-dialog v-model="isActive" width="800">
    <v-card class="teal lighten-5">
      <v-card-title>
        <i18n path="dialogs.buyService"></i18n>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input',false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="service2buy"
          prepend-icon="mdi-human-scooter"
          :label="$t('fields.service')"
          :placeholder="$t('fields.service')"
          :items="availableServices"
          return-object
          item-value="idx"
          item-text="info.name"
        >
          <template #item="{item}">
            <v-icon
              color="success"
              class="mr-3"
              v-show="$store.getters['session/testClubService'](item.idx)"
            >mdi-check</v-icon>
            <span>{{item.info.name}}</span>
            <span>{{item.info.description}}</span>
          </template>
        </v-select>
        <v-select
          v-if="service2buy"
          v-model="tariff2buy"
          prepend-icon="mdi-grid"
          :label="$t('fields.tariff')"
          :placeholder="$t('fields.tariff')"
          :items="$store.getters['tariffs/list'](service2buy.tariffs)"
          return-object
          item-value="idx"
          item-text="info.name"
        >
          <template #item="{item}">
            <TariffInfo :tariff="item" />
          </template>
        </v-select>
        <TariffInfo :tariff="tariff2buy" large :service="service2buy" />
        <v-row v-if="tariff2buy">
          <v-col cols="6">
            <AskDateDialog v-model="date2buy" />
          </v-col>
          <v-col align-self="center" class="text-right" cols="6">
            <i18n path="home.to" class="text-h6">
              <template #date>{{$api.toDate(date2buy, tariff2buy) | dt-time}}</template>
            </i18n>
          </v-col>
        </v-row>
        <v-select
          v-if="tariff2buy"
          v-model="tags2buy"
          :label="$t('fields.buytag')"
          :placeholder="$t('fields.buytag')"
          :items="$store.getters['dicts/tags']"
          item-value="name"
          multiple
          chips
          deletable-chips
          item-text="name"
          menu-props="offsetY,closeOnContentClick"
        >
          <template #item="{item}">
            <span>{{item.name}}</span>
            <span v-if="item.details" class="ml-4">{{item.details.name}}</span>
          </template>
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="buyService"
          v-if="date2buy&&tariff2buy&&service2buy"
          color="success"
          class="rounded-pill elevation-10"
        >
          <i18n path="button.buy" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TariffInfo from "@/components/TariffInfo";
import AskDateDialog from "@/components/dialogs/AskDateDialog";

export default {
  name: "DialogBuyService",
  components: { TariffInfo, AskDateDialog },
  props: {
    value: Boolean,
    client: Number,
    inclub: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tariff2buy: null,
      tags2buy: null,
      service2buy: null,
      date2buy: null,
    };
  },
  computed: {
    availableServices() {
      let tariffed = this.$store.getters["services/tariffed"];
      if (this.inclub) {
        return tariffed.filter((e) => {
          return this.$store.getters["session/testClubService"](e.idx);
        });
      }
      return tariffed;
    },
    isActive: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    value(v) {
      this.date2buy = this.$moment();
      this.tags2buy = null;
      this.tariff2buy = null;
      this.service2buy = null;
      if (v) {
        this.$store.dispatch("services/LOAD");
        this.$store.dispatch("tariffs/LOAD");
        this.$store.dispatch("dicts/LOAD");
      }
    },
  },
  methods: {
    buyService() {
      this.$api
        .addService2client({
          client: this.client,
          tariff: this.tariff2buy,
          start: this.date2buy.valueOf(),
          tags: this.tags2buy,
          service: this.service2buy,
        })
        .then((response) => {
          this.$emit("onbuy", response);
        })
        .finally(() => {
          this.$emit("input", false);
        });
    },
  },
};
</script>

<style>
</style>