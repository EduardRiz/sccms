<template>
  <v-dialog v-model="isActive" width="800">
    <v-card class="teal lighten-5">
      <v-card-title>
        <i18n path="dialogs.addService"></i18n>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input',false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="service2add"
          prepend-icon="mdi-human-scooter"
          :label="$t('fields.service')"
          :placeholder="$t('fields.service')"
          :items="availableServices"
          return-object
          item-value="idx"
          item-text="info.name"
          @change="onService2addchanged"
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
          v-if="service2add"
          v-model="tariff2add"
          prepend-icon="mdi-grid"
          :label="$t('fields.tariff')"
          :placeholder="$t('fields.tariff')"
          :items="serviceTariffs"
          return-object
          item-value="idx"
          item-text="info.name"
        >
          <template #item="{item}">
            <TariffInfo :tariff="item" />
          </template>
        </v-select>
        <TariffInfo :tariff="tariff2add" large :service="service2add" />
        <!-- <v-row v-if="tariff2add">
          <v-col cols="6">
            <AskDateDialog v-model="date2buy" />
          </v-col>
          <v-col align-self="center" class="text-right" cols="6">
            <i18n path="home.to" class="text-h6">
              <template #date>{{$api.toDate(date2buy, tariff2add) | dt-time}}</template>
            </i18n>
          </v-col>
        </v-row>-->
        <v-select
          v-if="service2add && service2add.workout"
          v-model="workout2assign"
          prepend-icon="mdi-calendar-month"
          :label="$t('fields.workout')"
          :placeholder="$t('fields.workout')"
          :items="availableWorkouts"
          return-object
          item-value="idx"
          item-text="info.name"
        >
          <template #item="{item}">
            <v-row>
              <span class="mr-3">{{item.info.name}}</span>
              <v-icon x-small class="mr-1" color="primary">{{$t("icons.coachs")}}</v-icon>
              <sc-record-info class="mr-2" :idx="item.coach" store="coachs/item" />
              <v-icon x-small class="mr-1" color="primary">{{$t("icons.rooms")}}</v-icon>
              <sc-record-info class="mr-2" :idx="item.room" store="rooms/item" />
              <v-icon x-small class="mr-1" color="primary">{{$t("icons.services")}}</v-icon>
              <sc-record-info class="mr-2" :idx="item.service" store="services/item" />
              <v-icon x-small class="mr-1" color="primary">{{$t("icons.time")}}</v-icon>
              <i18n path="label.startAt">
                <template #time>{{item.settings.time}}</template>
              </i18n>
            </v-row>
            <div></div>
          </template>
        </v-select>
        <!-- <v-slider
          v-if="service2add.scalar"
          v-model="service2add.scalarcount"
          :label="$t('fields.count2reg')"
          thumb-label="always"
          thumb-color="blue"
          track-color="success"
          :max="service2add.remainscalar"
          min="0"
          ticks
        ></v-slider>-->
        <v-select
          v-if="tariff2add"
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
          @click="addService"
          v-if="allowAddService"
          color="success"
          class="rounded-pill elevation-10"
        >
          <i18n path="button.addservice" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TariffInfo from "@/components/TariffInfo";
//import AskDateDialog from "@/components/dialogs/AskDateDialog";

export default {
  name: "DialogBuyAnonymService",
  components: { TariffInfo /*AskDateDialog*/ },
  props: {
    value: Boolean,
    inclub: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tariff2add: null,
      tags2buy: null,
      service2add: null,
      serviceTariffs: [],
      workout2assign: null,
      availableWorkouts: [],
    };
  },
  computed: {
    allowAddService() {
      return (
        this.tariff2add &&
        this.service2add &&
        (this.service2add.workout ? this.workout2assign : true)
      );
    },
    availableServices() {
      const tariffed = this.$store.getters["services/tariffed"];
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
      this.tags2buy = null;
      this.tariff2add = null;
      this.service2add = null;
      if (v) {
        this.$store.dispatch("services/LOAD");
        this.$store.dispatch("tariffs/LOAD");
        this.$store.dispatch("dicts/LOAD");
      }
    },
  },
  mounted() {
    if (!this.$store.getters["services/isItems"])
      this.$store.dispatch("services/LOAD");
    if (!this.$store.getters["tariffs/isItems"])
      this.$store.dispatch("tariffs/LOAD");
    if (!this.$store.getters["dicts/isItems"])
      this.$store.dispatch("dicts/LOAD");
  },
  methods: {
    onService2addchanged(v) {
      if (!v) return;
      this.tags2buy = null;
      this.serviceTariffs = this.$store.getters["tariffs/list"](
        this.service2add.tariffs
      );
      this.tariff2add =
        this.serviceTariffs.length == 1 ? { ...this.serviceTariffs[0] } : null;
      this.workout2assign = null;
      this.registerServ();
    },
    addService() {
      let wo = {};
      if (this.workout2assign) {
        wo = {
          idx: this.workout2assign.idx,
          coach: this.workout2assign.coach,
          room: this.workout2assign.room,
          beginat: this.workout2assign.beginat,
          duration: this.workout2assign.duration,
          color: this.workout2assign.color,
        };
      }
      if (!this.service2add.count) {
        this.service2add.count = 1;
      }
      this.$emit("onadd", {
        tariff: this.tariff2add,
        tags: this.tags2buy,
        workout: wo,
        service: this.service2add,
        start: this.$moment().valueOf(),
      });
    },
    registerServ() {
      this.workout2assign = null;
      this.$set(this.service2add, "sels", true);

      // if (this.service2add.visits && !this.service2add.scalar) {
      //   this.$set(this.service2add, "count2assign", 1);
      // }
      if (this.service2add.workout) {
        // to show dialog
        this.availableWorkouts = [];
        const now = this.$moment();
        this.$api
          .getAvailableWorkouts(this.service2add.idx)
          .then((response) => {
            this.availableWorkouts = [
              ...response.filter((e) => {
                try {
                  if (e.fixdate) {
                    const from = this.$moment(e.fixdate).startOf("day");
                    const to = from.clone().endOf("day");
                    if (now.isAfter(from) && now.isBefore(to)) return true;
                  } else {
                    if (e.dayofweek == now.day()) return true;
                  }
                  return false;
                } catch (error) {
                  return false;
                }
              }),
            ];
            if (this.availableWorkouts.length == 1)
              this.workout2assign = { ...this.availableWorkouts[0] };
          });
        this.d_preregister = true;
        // } else if (this.service2add.visitcontrol) {
        //   // auto decrement vcount
        //   this.$set(this.service2add, "sels", true);
      }
      // if (!this.service2add.visitcontrol) {
      //   this.$set(this.service2add, "sels", true);
      // }
    },
  },
};
</script>

<style>
</style>