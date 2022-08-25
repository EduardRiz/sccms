<template>
  <v-sheet class="fill-height idcs-fill-width dash-back">
    <sc-dashboard-panel />
    <v-main class="vertical-center raduis-25">
      <v-row justify="center">
        <v-col cols="8">
          <v-card class="main-card raduis-25">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon class="error" dark @click="closeClient">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row justify="space-around">
                <v-col cols="11">
                  <v-card class="services-card raduis-25 orange lighten-5">
                    <v-card-title>
                      <i18n path="home.anonymservices" />
                    </v-card-title>
                    <v-card-text>
                      <v-list three-line class="orange lighten-5">
                        <template v-for="item in availabledClientServices">
                          <v-list-item
                            :key="item.idx"
                            :class="item.sels?'selected-service':''"
                            @click="registerServ(item)"
                            :disabled="item.testcode>0"
                          >
                            <v-list-item-avatar>
                              <v-icon fab>mdi-human-scooter</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-chip
                                  v-if="item.settings&&item.settings.visits"
                                  class="mr-4"
                                  :color="item.testcode==4?'grey':'primary'"
                                  :disabled="item.testcode>0"
                                >{{item.settings.vcount-(item.count2assign?item.count2assign:0)}}</v-chip>
                                <sc-record-info
                                  :idx="item.service"
                                  store="services/item"
                                  class="ml-4"
                                />
                                <v-icon
                                  x-small
                                  v-if="item.settings.isworkout"
                                  class="mx-1 primary--text"
                                >{{$t('icons.workouts')}}</v-icon>
                                <sc-record-info
                                  :idx="item.workout_"
                                  store="workouts/item"
                                  class="ml-4"
                                />
                                <span>
                                  <v-btn text @click.stop="tryReversal(item)" small color="error">
                                    <v-icon class="mr-1">mdi-cash-refund</v-icon>
                                    <i18n path="button.reversal" />
                                  </v-btn>
                                </span>
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                <i18n path="home.from" :class="(item.testcode==1?'red--text':'')">
                                  <template #date>{{item.fromDate|dt-only}}</template>
                                </i18n>
                                <i18n path="home.to" class="ml-4">
                                  <template #date>{{item.toDate|dt-only}}</template>
                                </i18n>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="d-flex">
                                <sc-week-days
                                  v-if="item.time"
                                  :days="item.time.days"
                                  :class="'ml-n1 '+(item.testcode==2?'red--text':'')"
                                />
                                <i18n
                                  path="home.worktime"
                                  :class="(item.testcode==3?'red--text':'')"
                                >
                                  <template #time>{{item.time.hours | time_interval}}</template>
                                </i18n>
                              </v-list-item-subtitle>
                              <v-divider></v-divider>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-btn icon v-if="item.testcode<=0">
                                <v-icon>{{item.sels?"mdi-checkbox-marked-outline":"mdi-checkbox-blank-outline"}}</v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn icon fab class="primary" dark @click="d_buyService=true">
                        <v-icon>mdi-human-scooter</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn v-if="boxkey" @click="registerClientOut" fab>
                        <v-icon>mdi-exit-run</v-icon>
                      </v-btn>
                      <v-btn
                        :class="isAvailableRegister?'success':'grey lighten-1'"
                        @click="assignKey"
                        :disabled="!isAvailableRegister"
                        color="success"
                        class="rounded-pill elevation-10 mr-2"
                      >
                        <i18n path="button.register" />
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
    <sc-dialog-buy-service
      v-model="d_buyService"
      :client="current_client.idx"
      @onbuy="transformAvailableService"
      inclub
    />
    <v-dialog v-model="d_preregister" persistent width="800">
      <v-card class="teal lighten-5">
        <v-card-title>
          <i18n path="dialogs.assignWorkout"></i18n>
          <v-spacer></v-spacer>
          <v-btn @click="assignWorkout(false)" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-10">
          <v-select
            v-if="isWorkoutService"
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
          <v-slider
            v-if="isScalarService"
            v-model="clientServices[servIndex2assign].count2assign"
            :label="$t('fields.count2reg')"
            thumb-label="always"
            thumb-color="blue"
            track-color="success"
            :max="clientServices[servIndex2assign].settings.vcount"
            min="1"
            ticks
          ></v-slider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!isAllowAssignWorkout"
            text
            @click="assignWorkout(true)"
            class="success rounded-pill elevation-10"
          >
            <i18n path="button.ok" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <sc-dialog-set-key v-model="d_setkey" @onKey="registerVisit" />
    <sc-confirm-dialog
      v-model="d_confirm"
      mode="reversal"
      @click:ok="reversal"
    >{{$t("dialog.txt.reversal")}}</sc-confirm-dialog>
  </v-sheet>
</template>

<script>
import Dashboard from "@/components/home/DashboardPanel.vue";
import BuyService from "@/components/home/BuyService.vue";
import SetKey from "@/components/home/SetKey.vue";

export default {
  name: "AnonymClientHome",
  components: {
    "sc-dialog-buy-service": BuyService,
    "sc-dialog-set-key": SetKey,
    "sc-dashboard-panel": Dashboard,
  },
  data() {
    return {
      d_confirm: false,
      d_setkey: false,
      d_buyService: false,
      d_buyAbonement: false,
      d_preregister: false,
      d_client_history: false,

      item: {},
      panels: 0,
      workout2assign: null,
      servIndex2assign: null,
      clientServices: [],
      availableWorkouts: [],
      keys: [],
      current_client: {},
    };
  },
  computed: {
    boxkey() {
      return this.$route.query.k;
    },
    isWorkoutService() {
      try {
        if (this.servIndex2assign == null) return false;
        return this.clientServices[this.servIndex2assign].workout;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    isAllowAssignWorkout() {
      try {
        if (this.clientServices[this.servIndex2assign].count2assign == 0)
          return false;
        if (this.isWorkoutService && !this.workout2assign) return false;
        return true;
      } catch (error) {
        return false;
      }
    },
    isScalarService() {
      try {
        if (this.servIndex2assign == null) return false;
        return this.clientServices[this.servIndex2assign].scalar;
      } catch (error) {
        return false;
      }
    },
    isAvailableRegister() {
      let result = false;
      try {
        this.clientServices.forEach((e) => {
          if (e.sels) result = true;
        });
      } catch (error) {
        console.log(error);
      }
      return result;
    },
    availabledClientServices() {
      return this.clientServices.filter((e) => e.testcode <= 0);
    },
    unavailabledClientServices() {
      return this.clientServices.filter((e) => e.testcode > 0);
    },
    isAssignedKeys() {
      return this.keys.length > 0;
    },
    assignedKey() {
      return this.keys.length ? this.keys[0].keyname : null;
    },
  },
  methods: {
    tryReversal(i) {
      this.item = { ...i };
      this.d_confirm = true;
    },
    reversal() {
      this.$api.reversalServiceBuy(this.item.idx, this.item.sale).then(() => {
        this.clientServices.splice(this.clientServices.indexOf(this.item), 1);
      });
    },
    testAvailability(i) {
      if (!i) return;
      const from = this.$moment(i.fromDate);
      const to = this.$moment(i.toDate);
      this.$set(i, "testcode", 0);
      if (this.$store.getters["session/services"].indexOf(i.service) == -1) {
        this.$set(i, "testcode", 5);
      } else if (from.isAfter() || to.isBefore()) {
        this.$set(i, "testcode", 1);
      } else if (i.time.days.indexOf(this.$moment().isoWeekday()) == -1) {
        this.$set(i, "testcode", 2);
      } else if (i.time.hours[this.$moment().hour()] != 1) {
        this.$set(i, "testcode", 3);
      } else if (i.settings && i.settings.visits) {
        this.$set(i, "testcode", i.settings.vcount <= 0 ? 4 : -4);
      }
    },
    assignWorkout(confirm) {
      try {
        const i = this.clientServices[this.servIndex2assign];
        if (confirm) {
          if (this.workout2assign) {
            i.workout_ = this.workout2assign.idx;
            i.workout = {
              idx: this.workout2assign.idx,
              coach: this.workout2assign.coach,
              room: this.workout2assign.room,
              settings: { ...this.workout2assign.settings },
            };
          }
          this.$set(i, "sels", true);
        } else {
          this.$set(i, "count2assign", 0);
        }
      } catch (error) {
        console.log(error);
      }
      this.d_preregister = false;
    },
    registerServ(i) {
      this.workout2assign = null;
      this.$set(i, "count2assign", 0);

      if (i.sels) {
        this.$set(i, "sels", false);
      } else {
        // not selected
        this.servIndex2assign = this.clientServices.indexOf(i);
        if (i.settings.visits && !i.scalar) {
          this.$set(i, "count2assign", 1);
        }
        if (i.workout || i.scalar) {
          // to show dialog
          this.availableWorkouts = [];
          const now = this.$moment();
          this.$api.getAvailableWorkouts(i.service).then((response) => {
            this.availableWorkouts = [
              ...response.filter((e) => {
                try {
                  const s = e.settings;
                  if (s.fix) {
                    const from = this.$moment(s.date).startOf("day");
                    const to = from.clone().endOf("day");
                    if (now.isAfter(from) && now.isBefore(to)) return true;
                  } else {
                    if (s.days == now.isoWeekday()) return true;
                  }
                  return false;
                } catch (error) {
                  return false;
                }
              }),
            ];
          });
          this.d_preregister = true;
        } else if (i.settings.visits) {
          // auto decrement vcount
          // this.$set(i, "count2assign", 1);
          this.$set(i, "sels", true);
        }
        if (!i.settings.visits) this.$set(i, "sels", true);
      }
    },
    closeClient() {
      this.$router.push("/");
    },
    registerVisit(key) {
      if (key && !key.idx) return;
      this.$api
        .registerVisit2client(
          this.current_client.idx,
          key,
          this.clientServices.filter((e) => e.sels)
        )
        .then((response) => {
          if (response != 1) console.log(response);
        })
        .finally(() => {
          this.closeClient();
        });
    },
    assignKey() {
      if (!this.isAssignedKeys) {
        this.d_setkey = true;
      } else this.registerVisit(false);
    },
    registerClientOut() {
      if (!this.boxkey) return;
      this.$api
        .registerClientOut(this.current_client.idx, parseInt(this.boxkey))
        .then((response) => {
          if (!response) console.error(response);
        })
        .finally(() => {
          this.closeClient();
        });
    },
    transformAvailableService(response) {
      try {
        let serv = response[response.length - 1];
        this.testAvailability(serv);
        this.clientServices.push(serv);
        // response.forEach((e) => this.testAvailability(e));
        // this.clientServices = [
        //   ...response.sort(function (a, b) {
        //     return a.testcode < b.testcode ? -1 : 1;
        //   }),
        // ];
      } catch (error) {
        console.log(error);
      }
    },
    getAnonymousClient() {
      this.current_client = {};
      this.clientServices = [];
      this.keys = [];
      this.$api.getAnonymousClient().then((response) => {
        this.current_client = { ...response };
      });
    },
  },
  mounted() {
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
    if (!this.$store.getters["rooms/isItems"]) {
      this.$store.dispatch("rooms/LOAD");
    }
    if (!this.$store.getters["coachs/isItems"]) {
      this.$store.dispatch("coachs/LOAD");
    }
    if (!this.$store.getters["workouts/isItems"]) {
      this.$store.dispatch("workouts/LOAD");
    }
    this.getAnonymousClient();
  },
};
</script>
<style scoped>
.selected-service {
  background-color: #dddddd;
  border-radius: 12px;
}
.pointer-cursor {
  cursor: pointer;
}
.dash-back {
  background: url("~@/assets/background.jpg");
  background-repeat: round;
}
.main-card {
  background-color: #f0f8ff42;
}
.profile-card {
  border-radius: 25px;
}
.services-card {
  background-color: #f0f8ffa6;
}
.client-info {
  width: 100%;
}
.client-info td {
  padding-top: 10px;
  padding-bottom: 10px;
}
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 100%;
}
.raduis-25 {
  border-radius: 25px;
}
.radius-12 {
  border-radius: 12px !important;
}
.exit-btn {
  margin-bottom: 10px;
  margin-right: 10px;
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.1);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.1);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.1);
  cursor: pointer;
  border-radius: 6px;
}
.exit-btn:hover {
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.5);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.5);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.5);
}
.exit-btn:active {
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0);
}
</style>
