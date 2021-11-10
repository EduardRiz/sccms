<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-toolbar class="mb-2 orange lighten-5">
      <i18n path="home.total">
        <template #count>{{intoClubCount}}</template>
      </i18n>
      <v-spacer></v-spacer>
      <v-btn icon x-small @click="tickleConnection">
        <v-icon>{{connected?"mdi-bell":"mdi-bell-off"}}</v-icon>
      </v-btn>
    </v-toolbar>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-card class="yellow lighten-4">
              <v-card-title>
                <v-text-field
                  append-icon="mdi-magnify"
                  prepend-inner-icon="mdi-account"
                  autofocus
                  v-model="searchData"
                  :error-messages="clientSearchError"
                  @click:append="searchClient"
                  @keydown.enter="searchClient"
                  @keydown.escape="searchData=null"
                  clearable
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                  append-icon="mdi-magnify"
                  prepend-inner-icon="mdi-key"
                  v-model="searchKey"
                  :error-messages="keySearchError"
                  @click:append="searchClientKey"
                  @keydown.enter="searchClientKey"
                  @keydown.escape="searchKey=null"
                  clearable
                ></v-text-field>
              </v-card-title>
              <v-card-text v-if="foundedClients">
                <v-list three-line class="yellow lighten-4">
                  <template v-for="item in foundedClients">
                    <v-list-item :key="item.idx" class="ma-1 yellow lighten-5 pointer-cursor">
                      <v-list-item-avatar @click="getAvailableClientServices(item)">
                        <v-img :src="$api.publicImgLink(item.img, true)" />
                      </v-list-item-avatar>
                      <v-list-item-content @click="getAvailableClientServices(item)">
                        <v-list-item-title v-html="item.info.name"></v-list-item-title>
                        <v-list-item-subtitle v-html="item.info.description"></v-list-item-subtitle>
                        <v-list-item-subtitle v-html="item.card"></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon fab large>mdi-arrow-right-bold-outline</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-text v-if="foundedKeys">
                <v-list two-line class="yellow lighten-4">
                  <template v-for="item in foundedKeys">
                    <v-list-item :key="item.idx" class="ma-1 yellow lighten-5 pointer-cursor">
                      <v-list-item-avatar>
                        <v-icon fab>mdi-key</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content @click="getAvailableClientServicesByKey(item)">
                        <v-list-item-title v-html="item.client"></v-list-item-title>
                        <v-list-item-subtitle>
                          <i18n path="home.keyid">
                            <template #keyid>{{item.keyid}}</template>
                            <template #keyname>{{item.boxkey}}</template>
                            <template #from>{{item.fromdate| dt-time}}</template>
                          </i18n>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon fab large>mdi-arrow-right-bold-outline</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
            <v-btn icon fab @click="editClient" bottom right dark class="pink mt-n7">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" v-if="current_client.idx">
            <v-card v-if="clientRegisteredServices.length" class="orange lighten-4">
              <v-card-title>
                <v-avatar>
                  <v-img alt="Avatar" :src="$api.publicImgLink(current_client.img, true)" />
                </v-avatar>
                <span class="ml-6">{{current_client.info.name}}</span>
              </v-card-title>
              <v-card-text>
                <v-list three-line class="orange lighten-5">
                  <template v-for="item in clientRegisteredServices">
                    <v-list-item :key="item.idx" :class="item.sels?'yellow lighten-4':''">
                      <v-list-item-avatar>
                        <v-icon fab>mdi-human-scooter</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-chip>{{item.count}}</v-chip>
                          <span class="mx-2">{{item.audit.updated | dt-time}}</span>
                          <sc-record-info :idx="item.service" store="services/item" />
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="item.workout">
                          <v-icon x-small color="primary" class="mx-2">{{$t("icons.workouts")}}</v-icon>
                          <sc-record-info :idx="item.workout.idx" store="workouts/item" />
                          <v-icon x-small color="primary" class="mx-2">{{$t("icons.rooms")}}</v-icon>
                          <sc-record-info :idx="item.workout.room" store="rooms/item" class="ml-1" />
                          <v-icon x-small color="primary" class="mx-2">{{$t("icons.coachs")}}</v-icon>
                          <sc-record-info
                            :idx="item.workout.coach"
                            store="coachs/item"
                            class="ml-1"
                          />
                          <div v-if="item.settings">
                            <v-icon>mdi-clock</v-icon>
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon @click="cancelRegistration(item)">
                          <v-icon>{{item.sels?"mdi-close":"mdi-check"}}</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-card v-if="current_client.idx" class="orange lighten-4">
          <v-card-title>
            <v-avatar>
              <v-img alt="Avatar" :src="$api.publicImgLink(current_client.img, true)" />
            </v-avatar>
            <span class="ml-6">{{current_client.info.name}}</span>
            <v-spacer></v-spacer>
            <v-btn icon class="error" dark @click="closeClient">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-expansion-panels v-model="panels">
              <v-expansion-panel class="orange lighten-5">
                <v-expansion-panel-header>
                  <span>{{availabledClientServices.length}}</span>
                  <i18n path="home.available" />
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list three-line class="orange lighten-5">
                    <template v-for="item in availabledClientServices">
                      <v-list-item
                        :key="item.idx"
                        :class="item.sels?'yellow lighten-4':''"
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
                            <sc-record-info :idx="item.service" store="services/item" class="ml-4" />
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
                            <i18n path="home.worktime" :class="(item.testcode==3?'red--text':'')">
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
              <v-expansion-panel class="orange lighten-5">
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
                            <sc-record-info :idx="item.service" store="services/item" class="ml-4" />
                            <sc-record-info :idx="item.workout" store="workouts/item" class="ml-4" />
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
                            <i18n path="home.worktime" :class="(item.testcode==3?'red--text':'')">
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
            <v-btn icon fab class="primary" dark @click="startBuyService">
              <v-icon>mdi-human-scooter</v-icon>
            </v-btn>
            <v-btn icon fab class="primary" dark @click="startBuyAbonement">
              <v-icon>mdi-table-multiple</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              fab
              icon
              class="success"
              dark
              @click="registerClientOut"
              v-if="this.foundedKeys.length"
            >
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
    <sc-client-dialog v-model="d_client" :item="item" @save="onNewClient" />
    <!-- <v-dialog v-model="d_buyService" width="800">
      <v-card class="teal lighten-5">
        <v-card-title>
          <i18n path="dialogs.buyService"></i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_buyService=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="service2buy"
            prepend-icon="mdi-human-scooter"
            :label="$t('fields.service')"
            :placeholder="$t('fields.service')"
            :items="$store.getters['services/tariffed']"
            return-object
            item-value="idx"
            item-text="info.name"
          ></v-select>
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
          <AskDateDialog v-model="date2buy" v-if="tariff2buy" />
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
    </v-dialog> -->
    <sc-dialog-buy-service v-model="d_buyService" :client="current_client.idx" @onbuy="transformAvailableService" />
    <sc-dialog-buy-abonement v-model="d_buyAbonement" :client="current_client.idx" @onbuy="transformAvailableService" />
    <!-- <v-dialog v-model="d_buyAbonement" width="800">
      <v-card class="teal lighten-5">
        <v-card-title>
          <i18n path="dialogs.buyAbonement"></i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_buyAbonement=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="abonement2buy"
            prepend-icon="mdi-table-multiple"
            :label="$t('fields.abonement')"
            :placeholder="$t('fields.abonement')"
            :items="$store.getters['abonements/tariffed']"
            return-object
            item-value="idx"
            item-text="info.name"
            menu-props="offsetY"
          >
            <template #item="{item}">
              <div>
                <div class="text-h6">{{item.info.name}}</div>
                <sc-services-list :item="item" />
              </div>
            </template>
          </v-select>
          <v-select
            v-if="abonement2buy"
            v-model="tariff2buy"
            prepend-icon="mdi-grid"
            :label="$t('fields.tariff')"
            :placeholder="$t('fields.tariff')"
            :items="$store.getters['tariffs/list'](abonement2buy.tariffs)"
            return-object
            item-value="idx"
            item-text="info.name"
            menu-props="offsetY"
          >
            <template #item="{item}">
              <TariffInfo :tariff="item" />
            </template>
          </v-select>
          <TariffInfo v-if="tariff2buy" :tariff="tariff2buy" />
          <AskDateDialog v-model="date2buy" v-if="tariff2buy" />
          <v-select
            v-model="tags2buy"
            :label="$t('fields.buytag')"
            :placeholder="$t('fields.buytag')"
            :items="$store.getters['dicts/tags']"
            item-value="name"
            multiple
            chips
            deletable-chips
            item-text="name"
            menu-props="offsetY"
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
            @click="buyAbonement"
            v-if="date2buy&&tariff2buy&&abonement2buy"
            color="success"
            class="rounded-pill elevation-10"
          >
            <i18n path="button.buy" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->
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
          ></v-select>
          <v-slider
            v-if="isScalarService"
            v-model="clientServices[servIndex2assign].count2assign"
            :label="$t('fields.count2reg')"
            thumb-label="always"
            thumb-color="blue"
            track-color="success"
            :max="clientServices[servIndex2assign].settings.vcount"
            min="0"
            ticks
          ></v-slider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!(servIndex2assign=>0 && clientServices[servIndex2assign].count2assign>0)"
            text
            @click="assignWorkout(true)"
            class="success rounded-pill elevation-10"
          >
            <i18n path="button.ok" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="d_setkey" persistent width="400">
      <v-card class="teal lighten-5">
        <v-card-title>
          <i18n path="dialogs.assignKey"></i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_setkey=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-10">
          <v-select
            v-model="key2assign"
            prepend-icon="mdi-key"
            :label="$t('fields.key')"
            :items="availableKeys"
            return-object
            item-value="idx"
            item-text="name"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="registerVisit" class="success rounded-pill elevation-10">
            <i18n path="button.ok" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar right absolute shaped v-model="lastEvent">{{lastEvent}}</v-snackbar>
  </v-sheet>
</template>

<script>
import ClientDialog from "@/components/ClientDialog";
// import TariffInfo from "@/components/TariffInfo";
// import AskDateDialog from "@/components/AskDateDialog";
import BuyAbonement from "@/components/home/BuyAbonement.vue";
import BuyService from "@/components/home/BuyService.vue";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const default_record = { info: {} };
export default {
  name: "Home",
  components: {
    "sc-client-dialog": ClientDialog,
    // TariffInfo,
    // AskDateDialog,
    "sc-dialog-buy-abonement": BuyAbonement,
    "sc-dialog-buy-service": BuyService,
  },
  data() {
    return {
      d_client: false,
      d_setkey: false,
      d_buyService: false,
      d_buyAbonement: false,
      d_preregister: false,

      lastEvent: null,
      send_message: null,
      connected: false,
      intoClubCount: 0,

      searchKey: null,
      panels: 0,
      item: {},
      key2assign: null,
      service2buy: null,
      date2buy: null,
      tags2buy: null,
      tariff2buy: null,
      abonement2buy: null,
      workout2assign: null,
      servIndex2assign: null,
      searchData: null,
      foundedClients: [],
      foundedKeys: [],
      clientServices: [],
      availableKeys: [],
      availableWorkouts: [],
      clientRegisteredServices: [],
      current_client: default_record,
      keySearchError: null,
      clientSearchError: null,
    };
  },
  watch: {
    searchData(v) {
      this.clientSearchError = null;
      if (!v) {
        this.closeClient();
      }
    },
    searchKey(v) {
      this.keySearchError = null;
      if (!v) {
        this.closeClient();
      }
    },
  },
  computed: {
    isWorkoutService() {
      try {
        if (this.servIndex2assign == null) return false;
        return this.clientServices[this.servIndex2assign].settings.isworkout;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    isScalarService() {
      try {
        if (this.servIndex2assign == null) return false;
        return this.clientServices[this.servIndex2assign].settings.isscalar;
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
  },
  methods: {
    testAvailability(i) {
      if (!i) return;
      const from = this.$moment(i.fromDate);
      const to = this.$moment(i.toDate);
      this.$set(i, "testcode", 0);
      if (from.isAfter() || to.isBefore()) {
        this.$set(i, "testcode", 1);
      } else if (i.time.days.indexOf(this.$moment().day()) == -1) {
        this.$set(i, "testcode", 2);
      } else if (i.time.hours[this.$moment().hour()] != 1) {
        this.$set(i, "testcode", 3);
      } else if (i.settings && i.settings.visits) {
        this.$set(i, "testcode", i.settings.vcount <= 0 ? 4 : -4);
      }
    },
    startBuyService() {
      this.date2buy = this.$moment();
      this.tags2buy = null;
      this.tariff2bu = null;
      this.service2buy = null;
      this.$store.dispatch("services/LOAD");
      this.$store.dispatch("tariffs/LOAD");
      this.$store.dispatch("dicts/LOAD");
      this.d_buyService = true;
    },
    startBuyAbonement() {
      // this.date2buy = this.$moment();
      // this.tags2buy = null;
      // this.tariff2bu = null;
      // this.abonement2buy = null;
      // this.$store.dispatch("abonements/LOAD");
      // this.$store.dispatch("tariffs/LOAD");
      // this.$store.dispatch("dicts/LOAD");
      this.d_buyAbonement = true;
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
        if (i.settings.visits && !i.settings.isscalar) {
          this.$set(i, "count2assign", 1);
        }
        if (i.settings.isworkout || i.settings.isscalar) {
          // to show dialog
          this.availableWorkouts = [];
          this.$api.getAvailableWorkouts(i.service).then((response) => {
            this.availableWorkouts = [...response];
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
      this.panels = 0;
      this.d_setkey = false;
      this.searchData = null;
      this.searchKey = null;
      this.clientServices = [];
      this.foundedClients = [];
      this.foundedKeys = [];
      this.availableWorkouts = [];
      this.availableKeys = [];
      this.abonement2buy = null;
      this.service2buy = null;
      this.tariff2buy = null;
      this.date2buy = null;
      this.tags2buy = null;
      this.key2assign = null;
      this.servIndex2assign = null;
      this.workout2assign = null;
      this.current_client = default_record;
      this.show_info = false;
    },
    registerVisit() {
      this.$api
        .registerVisit2client(
          this.current_client.idx,
          this.key2assign,
          this.clientServices.filter((e) => e.sels)
        )
        .then((response) => {
          if (response != 1) console.log(response);
        })
        .finally(() => {
          this.closeClient();
        });
    },
    buyService() {
      this.$api
        .addService2client({
          client: this.current_client.idx,
          tariff: this.tariff2buy,
          start: this.date2buy.valueOf(),
          tags: this.tags2buy,
          service: this.service2buy,
        })
        .then((response) => {
          this.transformAvailableService(response);
        })
        .finally(() => {
          this.d_buyService = false;
        });
    },
    buyAbonement() {
      this.$api
        .addAbonement2client({
          client: this.current_client.idx,
          abonement: this.abonement2buy,
          tariff: this.tariff2buy,
          start: this.date2buy.valueOf(),
          tags: this.tags2buy,
        })
        .then((response) => {
          this.transformAvailableService(response);
        })
        .finally(() => {
          this.d_buyAbonement = false;
        });
    },
    editClient(cl) {
      if (cl == undefined) cl = null;
      this.item = { ...cl };
      this.d_client = true;
    },
    onNewClient(item) {
      try {
        if (item) this.foundedClients.push(item);
      } catch (error) {
        console.log(error);
      }
    },
    assignKey() {
      if (this.foundedKeys.length == 0) {
        this.availableKeys = [];
        this.$api
          .getAvailableKeys()
          .then((response) => {
            this.availableKeys = [...response];
          })
          .finally(() => {
            this.d_setkey = true;
          });
      } else this.registerVisit();
    },
    searchClient() {
      if (!this.searchData) return;
      this.$api.searchClient(this.searchData).then((response) => {
        this.foundedClients = [...response];
        if (this.foundedClients.length == 0)
          this.clientSearchError = this.$t("error.clientNotFound");
        if (this.foundedClients.length == 1)
          this.getAvailableClientServices(this.foundedClients[0]);
      });
    },
    searchClientKey() {
      if (!this.searchKey) return;
      this.$api.searchOpenedVisitsByBoxKey(this.searchKey).then((response) => {
        this.foundedKeys = [...response];
        if (this.foundedKeys.length == 0)
          this.keySearchError = this.$t("error.keysNotFound");
        if (this.foundedKeys.length == 1)
          this.getAvailableClientServicesByKey(this.foundedKeys[0]);
      });
    },
    registerClientOut() {
      if (this.foundedKeys.length == 0) return;
      this.$api
        .registerClientOut(this.current_client.idx, this.foundedKeys[0].bkidx)
        .then((response) => {
          if (!response) console.error(response);
        })
        .finally(() => {
          this.closeClient();
        });
    },
    getAvailableClientServicesByKey(item) {
      //      const self = this;
      this.$api.getClientServices(item.cidx).then((response) => {
        this.transformAvailableService(response);
      });

      this.$api.getRegisteredClientServices(item.cidx).then((response) => {
        this.clientRegisteredServices = [...response];
      });

      this.$api.getClientById(item.cidx).then((client) => {
        this.current_client = { ...client };
        this.foundedClients = [this.current_client];
        this.foundedKeys = [this.foundedKeys[0]];
      });
    },
    getRegisteredClientServices(item) {
      this.$api
        .getRegisteredClientServices(item.idx)
        .then((response) => {
          this.clientRegisteredServices = [...response];
        })
        .finally(() => {
          this.current_client = { ...item };
        });
    },
    transformAvailableService(response) {
      try {
        console.log("transform", response)
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
    getAvailableClientServices(item) {
      this.$api
        .getClientServices(item.idx)
        .then((response) => {
          this.transformAvailableService(response);
        })
        .finally(() => {
          this.current_client = { ...item };
          this.foundedClients = [this.current_client];
        });
      this.$api.getRegisteredClientServices(item.idx).then((response) => {
        this.clientRegisteredServices = [...response];
      });
    },
    // socket support
    send() {
      console.log("Send message:" + this.send_message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { command: this.send_message };
        this.stompClient.send("/scapi/cmd", JSON.stringify(msg), {});
      }
    },
    connect() {
      this.socket = new SockJS(this.$api.api + "/sc-events-queue");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true;
          console.log(frame);
          this.stompClient.subscribe("/events", (tick) => {
            console.log(tick);
            this.lastEvent = { ...JSON.parse(tick.body).message };
          });
        },
        (error) => {
          console.log(error);
          this.connected = false;
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
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
    this.connect();
  },
};
</script>
<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
