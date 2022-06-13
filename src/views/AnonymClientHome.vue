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
                <v-col :cols="(boxkey && !isAvailableRegister)?10:11">
                  <v-card class="services-card raduis-25 orange lighten-5">
                    <v-card-title class="used-services-panel-header">
                      <i18n path="home.anonymservices" />
                    </v-card-title>
                    <v-card-text>
                      <sc-list-registered-services
                        :services="registeredClientServices"
                        :visitlog="current_visitlog"
                        v-if="registeredClientServices.length"
                      />
                      <v-list three-line class="orange lighten-5">
                        <template v-for="item in availabledClientServices">
                          <v-list-item :key="item.service.idx" class="selected-service">
                            <v-list-item-avatar>
                              <v-icon fab>mdi-human-scooter</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-chip
                                  v-if="item.service.scalar"
                                  class="mr-4"
                                  :color="item.service.scalarcount==0?'grey':'primary'"
                                >{{item.service.count}}</v-chip>
                                <v-chip
                                  v-else-if="item.visitcontrol"
                                  class="mr-4"
                                >{{item.service.count}}</v-chip>
                                <sc-record-info
                                  :idx="item.service.idx"
                                  store="services/item"
                                  class="ml-4"
                                />
                                <v-icon
                                  x-small
                                  v-if="item.service.workout"
                                  class="mx-1 primary--text"
                                >{{$t('icons.workouts')}}</v-icon>
                                <sc-record-info
                                  v-if="item.workout"
                                  :idx="item.workout.idx"
                                  store="workouts/item"
                                  class="ml-4"
                                />
                                <!-- <span>
                                  <v-btn text @click.stop="tryReversal(item)" small color="error">
                                    <v-icon class="mr-1">mdi-cash-refund</v-icon>
                                    <i18n path="button.reversal" />
                                  </v-btn>
                                </span>-->
                              </v-list-item-title>
                              <!-- <v-list-item-subtitle>
                                <i18n path="home.from" :class="(item.testcode==1?'red--text':'')">
                                  <template #date>{{item.fromDate|dt-only}}</template>
                                </i18n>
                                <i18n path="home.to" class="ml-4">
                                  <template #date>{{item.toDate|dt-only}}</template>
                                </i18n>
                              </v-list-item-subtitle>-->
                              <v-list-item-subtitle>
                                <span>{{item.tariff.info.name}}</span>
                                <span
                                  v-if="item.service.timed"
                                  class="ml-4"
                                >{{item.tariff.duration.spendmin+'min'}}</span>
                                <i18n path="home.price" class="ml-4 text-h6">
                                  <template
                                    #price
                                  >{{item.tariff.price*item.service.count | currencyEur}}</template>
                                </i18n>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle>
                                <sc-week-days
                                  v-if="item.tariff.time"
                                  :days="item.tariff.time.days"
                                  :class="'ml-n1 '+(item.testcode==2?'red--text':'')"
                                />
                                <i18n
                                  path="home.worktime"
                                  :class="(item.testcode==3?'red--text':'')"
                                >
                                  <template #time>{{item.tariff.time.hours | time_interval}}</template>
                                </i18n>
                              </v-list-item-subtitle>
                              <v-divider></v-divider>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-btn icon color="error" @click="deleteService(item)">
                                <v-icon>mdi-delete</v-icon>
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
                      <!-- <v-btn v-if="boxkey && !isAvailableRegister" @click="registerClientOut" fab>
                        <v-icon>mdi-exit-run</v-icon>
                      </v-btn>-->
                      <v-btn
                        :class="isAvailableRegister?'success':'grey lighten-1'"
                        @click="assignKey"
                        :disabled="!isAvailableRegister"
                        color="success"
                        class="rounded-pill elevation-10 mr-2"
                      >
                        <v-icon class="mx-1">mdi-checkbox-multiple-marked-outline</v-icon>
                        <i18n path="button.register" />
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="1" v-if="boxkey && !isAvailableRegister" align-self="center">
                  <v-img
                    src="~@/assets/Exit_red.png"
                    class="exit-btn"
                    max-width="80px"
                    width="80px"
                    @click="registerClientOut"
                    :style="{visibility:!isAvailableRegister?'visible':'hidden'}"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
    <sc-dialog-buy-anonym-service
      v-model="d_buyService"
      :client="current_client.idx"
      @onadd="transformAvailableService"
      inclub
    />
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
import BuyAnonymService from "@/components/home/BuyAnonymService.vue";
import ListRegisteredService from "@/components/home/RegisteredClientServices.vue";
import SetKey from "@/components/home/SetKey.vue";

export default {
  name: "AnonymClientHome",
  components: {
    "sc-dialog-buy-anonym-service": BuyAnonymService,
    "sc-dialog-set-key": SetKey,
    "sc-dashboard-panel": Dashboard,
    "sc-list-registered-services": ListRegisteredService,
  },
  data() {
    return {
      d_confirm: false,
      d_setkey: false,
      d_buyService: false,
      d_client_history: false,

      item: { service: {} },
      panels: 0,
      clientServices: [],
      registeredClientServices: [],
      current_visitlog: {},
      keys: [],
      current_client: {},
    };
  },
  computed: {
    availabledClientServices() {
      return this.clientServices.filter((e) => e.testcode <= 0);
    },
    isAvailableRegister() {
      return this.clientServices.length;
    },
    boxkey() {
      return this.$route.query.k;
    },
    // test , is client in zale
    isAssignedKeys() {
      return !!this.$route.query.k;
    },
  },
  methods: {
    deleteService(i) {
      const ind = this.clientServices.indexOf(i);
      if (ind != -1) {
        this.clientServices.splice(ind, 1);
      }
    },
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
      this.$set(i, "testcode", 0);
      if (
        this.$store.getters["session/services"].indexOf(i.service.idx) == -1
      ) {
        this.$set(i, "testcode", 91);
      }
      if ((i.visitcontrol || i.scalarcontrol) && i.count <= 0) {
        this.$set(i, "testcode", 95);
      }
    },
    closeClient() {
      this.$router.push("/");
    },
    registerVisit(key) {
      if (key && !key.idx) return;
      this.$api
        .registerAnonymVisit(
          this.current_client.idx,
          key,
          this.boxkey,
          this.clientServices
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
    transformAvailableService(serv) {
      try {
        this.testAvailability(serv);
        this.clientServices.push(serv);
        //console.log(serv);
        this.d_buyService = false;
      } catch (error) {
        console.log(error);
      }
    },
    getAnonymousClient() {
      this.current_client = {};
      this.clientServices = [];
      this.keys = [];
      this.$api.getAnonymousClient(this.boxkey).then((response) => {
        try {
          this.current_client = { ...response.client };
          this.registeredClientServices = [...response.services];
          this.current_visitlog = { ...response.visitlog };
        } catch (error) {
          console.log();
        }
      });
      if (!this.boxkey) this.d_buyService = true;
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
