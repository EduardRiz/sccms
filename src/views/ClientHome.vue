<template>
  <v-sheet class="fill-height idcs-fill-width dash-back">
    <sc-dashboard-panel />
    <v-main class="vertical-center raduis-25">
      <v-row justify="center">
        <v-col cols="10">
          <v-card class="main-card raduis-25">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon class="error" dark @click="closeClient">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row justify="space-around">
                <v-col cols="5" lg="4" xl="3">
                  <v-card class="profile-card raduis-25">
                    <v-card-text>
                      <v-row dense>
                        <v-col>
                          <v-badge
                            color="green"
                            :content="current_client.today"
                            :value="current_client.today"
                            bordered
                            overlap
                          >
                            <v-btn icon color="primary" @click="d_client_history=true">
                              <v-icon>mdi-history</v-icon>
                            </v-btn>
                          </v-badge>
                        </v-col>
                        <v-col align-self="center" class="text-right" v-if="isFrozen">
                          <v-icon color="primary">mdi-snowflake</v-icon>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" class="text-center">
                          <v-badge
                            color="blue"
                            :content="assignedKey"
                            :value="assignedKey"
                            icon="mdi-key"
                            bordered
                            overlap
                            bottom
                          >
                            <v-avatar height="100" width="100">
                              <v-img
                                alt="Avatar"
                                :src="$api.publicImgLink(current_client.img, true)"
                              />
                            </v-avatar>
                          </v-badge>
                        </v-col>
                        <v-col cols="12" class="text-center text-h6">{{current_client.card}}</v-col>
                        <v-col cols="12" class="text-center text-h6">{{current_client.name}}</v-col>
                        <v-col v-if="current_client.email">
                          <div v-if="current_client.email" class="text-center">
                            <v-icon class="mr-2">mdi-email</v-icon>
                            <span>{{current_client.email}}</span>
                          </div>
                          <div v-if="current_client.phone" class="text-center">
                            <v-icon class="mr-2">mdi-phone</v-icon>
                            <span>{{current_client.phone}}</span>
                          </div>
                          <div v-if="current_client.profile.address" class="text-center">
                            <span>{{current_client.profile.address}}</span>
                          </div>
                        </v-col>
                        <!-- <v-col cols="12">
                          <sc-list-registered-services :client.sync="current_client" />
                        </v-col>-->
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn fab color="primary" @click="d_edit=true">
                        <v-icon large>mdi-account</v-icon>
                      </v-btn>
                      <v-btn fab color="primary" @click="d_clservs=true">
                        <v-icon large>mdi-human-scooter</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <!-- <v-btn
                        fab
                        icon
                        class="success"
                        dark
                        @click="registerClientOut"
                        :disabled="isAvailableRegister"
                        v-if="$route.query.key"
                      >
                        <v-icon>mdi-exit-run</v-icon>
                      </v-btn>-->
                      <v-img
                        src="~@/assets/Exit_red.png"
                        max-width="50px"
                        class="exit-btn"
                        @click="registerClientOut"
                        :style="{visibility:!isAvailableRegister?'visible':'hidden'}"
                        v-if="isAssignedKeys"
                      ></v-img>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="7" v-if="!isFrozen">
                  <v-card class="services-card raduis-25">
                    <v-card-text>
                      <v-expansion-panels v-model="panels">
                        <v-expansion-panel class="orange lighten-5 radius-12">
                          <v-expansion-panel-header>
                            <span>{{availabledClientServices.length}}</span>
                            <i18n path="home.available" />
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
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
                                        v-if="item.scalar"
                                        class="mr-4"
                                        :color="item.testcode==4?'grey':'primary'"
                                        :disabled="item.testcode>0"
                                      >{{item.remainscalar - item.scalarcount}}</v-chip>
                                      <v-chip
                                        v-else-if="item.visitcontrol"
                                        class="mr-4"
                                        :color="item.testcode==4?'grey':'primary'"
                                        :disabled="item.testcode>0"
                                      >{{item.remainvisits - (item.sels?1:0)}}</v-chip>
                                      <sc-record-info
                                        :idx="item.service"
                                        store="services/item"
                                        class="ml-4"
                                      />
                                      <v-icon
                                        x-small
                                        v-if="item.workout"
                                        class="mx-1 primary--text"
                                      >{{$t('icons.workouts')}}</v-icon>
                                      <sc-record-info
                                        v-if="item"
                                        :idx="item.workout_"
                                        store="workouts/item"
                                        class="ml-4"
                                      />
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      <i18n
                                        path="home.from"
                                        :class="(item.testcode==1?'red--text':'')"
                                      >
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
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel class="orange lighten-5 radius-12">
                          <v-expansion-panel-header>
                            <span>{{unavailabledClientServices.length}}</span>
                            <i18n path="home.unavailable" />
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-list three-line class="orange lighten-5">
                              <template v-for="item in unavailabledClientServices">
                                <v-list-item
                                  :key="item.idx"
                                  :class="item.sels?'yellow lighten-4':''"
                                  :disabled="item.testcode>0"
                                >
                                  <v-list-item-avatar>
                                    <v-icon fab color="error">mdi-human-scooter</v-icon>
                                  </v-list-item-avatar>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      <v-chip v-if="item.scalar" class="mr-4">{{item.remainscalar}}</v-chip>
                                      <v-chip
                                        v-else-if="item.visitcontrol"
                                        class="mr-4"
                                      >{{item.remainvisits}}</v-chip>
                                      <sc-record-info
                                        :idx="item.service"
                                        store="services/item"
                                        class="ml-4"
                                      />
                                      <sc-record-info
                                        :idx="item.workout_"
                                        store="workouts/item"
                                        class="ml-4"
                                      />
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      <i18n
                                        path="home.from"
                                        :class="(item.testcode==1?'red--text':'')"
                                      >
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
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn icon fab class="primary" dark @click="d_buyService=true">
                        <v-icon>mdi-human-scooter</v-icon>
                      </v-btn>
                      <v-btn icon fab class="primary" dark @click="d_buyAbonement=true">
                        <v-icon>mdi-table-multiple</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
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
    />
    <sc-dialog-buy-abonement
      v-model="d_buyAbonement"
      :client="current_client.idx"
      @onbuy="transformAvailableService"
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
                <span class="mx-3">{{item.info.name}}</span>
                <v-icon x-small class="mr-1" color="primary">{{$t("icons.coachs")}}</v-icon>
                <sc-record-info class="mr-2" :idx="item.coach" store="coachs/item" />
                <v-icon x-small class="mr-1" color="primary">{{$t("icons.rooms")}}</v-icon>
                <sc-record-info class="mr-2" :idx="item.room" store="rooms/item" />
                <v-icon x-small class="mr-1" color="primary">{{$t("icons.services")}}</v-icon>
                <sc-record-info class="mr-2" :idx="item.service" store="services/item" />
                <v-icon x-small class="mr-1" color="primary">{{$t("icons.time")}}</v-icon>
                <i18n path="label.startAt">
                  <template #time>{{item.beginat}}</template>
                </i18n>
              </v-row>
              <div></div>
            </template>
          </v-select>
          <v-slider
            v-if="isScalarService"
            v-model="clientServices[servIndex2assign].scalarcount"
            :label="$t('fields.count2reg')"
            thumb-label="always"
            thumb-color="blue"
            track-color="success"
            :max="clientServices[servIndex2assign].remainscalar"
            min="0"
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
    <sc-client-visit-history v-model="d_client_history" :client="current_client.idx" />
    <sc-client-dialog
      v-model="d_edit"
      :item="current_client"
      @save="getAvailableClientServices"
      closeFrozen
    />
    <sc-client-services-dialog :items="clientServices" v-model="d_clservs" />
  </v-sheet>
</template>

<script>
import BuyAbonement from "@/components/home/BuyAbonement.vue";
import Dashboard from "@/components/home/DashboardPanel.vue";
import BuyService from "@/components/home/BuyService.vue";
import SetKey from "@/components/home/SetKey.vue";
//import ListRegServices from "@/components/home/ClientRegisteredServices.vue";
import ClientVisitHistory from "@/components/dialogs/ClientVisitHistory.vue";
import ClientDialog from "@/components/dialogs/ClientDialog";
import ClientServicesDialog from "@/components/dialogs/ClientServicesDialog";
// import SockJS from "sockjs-client";
// import Stomp from "webstomp-client";

export default {
  name: "ClientHome",
  components: {
    "sc-dialog-buy-abonement": BuyAbonement,
    "sc-dialog-buy-service": BuyService,
    "sc-dialog-set-key": SetKey,
    //"sc-list-registered-services": ListRegServices,
    "sc-client-visit-history": ClientVisitHistory,
    "sc-dashboard-panel": Dashboard,
    "sc-client-dialog": ClientDialog,
    "sc-client-services-dialog": ClientServicesDialog,
  },
  data() {
    return {
      d_setkey: false,
      d_edit: false,
      d_buyService: false,
      d_buyAbonement: false,
      d_preregister: false,
      d_client_history: false,
      d_clservs: false,

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
    isFrozen() {
      try {
        if (
          !this.current_client.profile ||
          !this.current_client.profile.frozenfrom
        )
          return false;
        let dt = this.$moment(this.current_client.profile.frozenfrom);
        return dt.startOf("day").isBefore();
      } catch (error) {
        return false;
      }
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
      return this.clientServices.filter(
        (e) => e.testcode > 0 && e.testcode < 80
      );
    },
    isAssignedKeys() {
      return this.keys.length > 0;
    },
    assignedKey() {
      return this.keys.length ? this.keys[0].keyname : null;
    },
  },
  methods: {
    testAvailability(i) {
      if (!i) return;
      const from = this.$moment(i.fromDate);
      const to = this.$moment(i.toDate);
      this.$set(i, "testcode", 0);
      this.$set(i, "scalarcount", 0);
      if (this.$store.getters["session/services"].indexOf(i.service) == -1) {
        this.$set(i, "testcode", 5);
      } else if (i.visitcontrol && i.remainvisits <= 0) {
        this.$set(i, "testcode", 92);
      } else if (i.scalar && i.remainscalar <= 0) {
        this.$set(i, "testcode", 93);
      } else if (from.isAfter() || to.isBefore()) {
        this.$set(i, "testcode", 1);
      } else if (i.time.days.indexOf(this.$moment().day()) == -1) {
        this.$set(i, "testcode", 2);
      } else if (i.time.hours[this.$moment().hour()] != 1) {
        this.$set(i, "testcode", 3);
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
              beginat: this.workout2assign.beginat,
              duration: this.workout2assign.duration,
              color: this.workout2assign.color,
            };
          }
          this.$set(i, "sels", true);
        } else {
          this.$set(i, "scalarcount", 0);
        }
      } catch (error) {
        console.log(error);
      }
      this.d_preregister = false;
    },
    registerServ(i) {
      this.workout2assign = null;
      this.$set(i, "scalarcount", 0);
      if (i.sels) {
        this.$set(i, "sels", false);
      } else {
        // not selected
        this.servIndex2assign = this.clientServices.indexOf(i);
        // if (i.visits && !i.scalar) {
        //this.$set(i, "count2assign", 1);
        // }
        if (i.workout) {
          // to show dialog
          this.availableWorkouts = [];
          const now = this.$moment();
          this.$api.getAvailableWorkouts(i.service).then((response) => {
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
            // set default of msg for no
            if (this.availableWorkouts.length == 0) {
              this.$root.$emit("showmsg", {
                msg: this.$t("error.noworkouts"),
                color: "warning",
              });
            } else {
              if (this.availableWorkouts.length == 1) {
                this.workout2assign = this.availableWorkouts[0];
              }
              this.d_preregister = true;
            }
          });
        } else if (i.scalar) {
          this.d_preregister = true;
        } else if (i.visitcontrol) {
          // auto decrement vcount
          this.$set(i, "sels", true);
        }
        if (!i.visitcontrol) this.$set(i, "sels", true);
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
      if (!this.isAssignedKeys) return;
      this.$api
        .registerClientOut(this.current_client.idx, this.keys[0].boxkey)
        .then((response) => {
          if (!response) console.error(response);
        })
        .finally(() => {
          this.closeClient();
        });
    },
    transformAvailableService(response) {
      try {
        this.clientServices = [];
        response.forEach((e) => this.testAvailability(e));
        this.clientServices = [
          ...response.sort(function (a, b) {
            return a.testcode < b.testcode ? -1 : 1;
          }),
        ];
      } catch (error) {
        console.log(error);
      }
    },
    getAvailableClientServices() {
      this.current_client = {};
      this.clientServices = [];
      this.keys = [];
      this.$api.getClientServices(this.$route.params.idx).then((response) => {
        this.current_client = { ...response.client, today: response.today };
        this.keys = [...response.keys];
        try {
          this.transformAvailableService(response.services);
        } catch (error) {
          console.log(error);
        }
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
    this.getAvailableClientServices();
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
