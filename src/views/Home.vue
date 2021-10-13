<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-row>
      <v-col cols="6">
        <v-card class="yellow lighten-4">
          <v-card-title>
            <i18n path="home.profile" />
            <v-spacer></v-spacer>
            <v-text-field
              append-icon="mdi-magnify"
              v-model="searchData"
              @click:append="searchClient"
              @keydown.enter="searchClient"
              clearable
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-list three-line class="yellow lighten-4">
              <template v-for="item in foundedClients">
                <v-list-item :key="item.idx" class="ma-1 yellow lighten-5">
                  <v-list-item-avatar @click="getAvailableClientServices(item)">
                    <v-img :src="$api.imageClientLink(item.idx)" />
                  </v-list-item-avatar>
                  <v-list-item-content @click="getAvailableClientServices(item)">
                    <v-list-item-title v-html="item.info.name"></v-list-item-title>
                    <v-list-item-subtitle v-html="item.info.description"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action class="d-inline">
                    <v-btn @click="getRegisteredClientServices(item)" icon>
                      <v-icon>mdi-clipboard-clock-outline</v-icon>
                    </v-btn>
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
      <v-col cols="6">
        <v-card v-if="current_client.idx" class="orange lighten-4">
          <v-card-title>
            <v-avatar>
              <v-img alt="Avatar" :src="$api.imageClientLink(current_client.idx)" />
            </v-avatar>
            <span class="ml-6">{{current_client.info.name}}</span>
          </v-card-title>
          <v-card-text>
            <v-list three-line class="orange lighten-5">
              <template v-for="item in clientServices">
                <v-list-item
                  :key="item.idx"
                  :class="item.sels?'yellow lighten-4':''"
                  @click="checkServ(item)"
                >
                  <v-list-item-avatar>
                    <v-icon fab>mdi-human-scooter</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span>{{item.info.name}}</span>
                      <sc-record-info v-model="item.workout" store="workouts/item" class="ml-4" />
                    </v-list-item-title>
                    <v-list-item-subtitle v-html="item.info.description"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
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
            <v-btn icon fab class="primary" dark @click="d_buyAbonement=true">
              <v-icon>mdi-table-multiple</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon fab class="error" dark @click="closeClient">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn icon fab class="success" dark @click="registerVisit">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          v-if="current_client.idx && clientRegisteredServices.length"
          class="orange lighten-4"
        >
          <v-card-title>
            <v-avatar>
              <v-img alt="Avatar" :src="$api.imageClientLink(current_client.idx)" />
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
                      <span>{{item.info.name}}</span>
                      <span>{{item.audit.created}}</span>
                      <sc-record-info v-model="item.service" store="services/item" class="ml-4" />
                    </v-list-item-title>
                    <v-list-item-subtitle v-html="item.info.description"></v-list-item-subtitle>
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
    <sc-client-dialog v-model="d_client" :item="item" @save="onNewClient" />
    <v-dialog v-model="d_buyService" width="400">
      <v-card>
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
            :items="$store.getters['services/items']"
            return-object
            item-value="idx"
            item-text="info.name"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="buyService">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="d_buyAbonement" width="400">
      <v-card>
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
            :items="$store.getters['abonements/items']"
            return-object
            item-value="idx"
            item-text="info.name"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="buyAbonement">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="d_assignworkout" width="400">
      <v-card>
        <v-card-title>
          <i18n path="dialogs.assignWorkout"></i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_assignworkout=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="workout2assign"
            prepend-icon="mdi-calendar-month"
            :label="$t('fields.workout')"
            :placeholder="$t('fields.workout')"
            :items="availableWorkouts"
            return-object
            item-value="idx"
            item-text="info.name"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="assignWorkout">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import ClientDialog from "@/components/ClientDialog";
const default_record = { info: {} };
export default {
  name: "Home",
  components: { "sc-client-dialog": ClientDialog },
  data() {
    return {
      d_client: false,
      item: {},
      d_buyService: false,
      service2buy: null,
      d_buyAbonement: false,
      abonement2buy: null,
      d_assignworkout: false,
      workout2assign: null,
      servIndex2assign: null,
      searchData: null,
      foundedClients: [],
      clientServices: [],
      availableWorkouts: [],
      clientRegisteredServices: [],
      current_client: default_record,
    };
  },
  watch: {
    searchData(v) {
      if (!v) this.foundedClients = [];
    },
  },
  methods: {
    assignWorkout() {
      const i = this.clientServices[this.servIndex2assign];
      i.workout = this.workout2assign.idx;
      i.sels = !i.sels;
      this.clientServices.splice(this.servIndex2assign, 1, i);
      this.d_assignworkout = false;
    },
    checkServ(i) {
      this.servIndex2assign = this.clientServices.indexOf(i);
      if (i.info.params && i.info.params.isworkout) {
        this.availableWorkouts = [];
        this.$api
          .getAvailableWorkouts(i.service)
          .then((response) => {
            this.availableWorkouts = [ ...response];
            this.d_assignworkout = true;
          });
      } else {
        i.sels = !i.sels;
        this.clientServices.splice(this.servIndex2assign, 1, i);
      }
    },
    closeClient() {
      this.searchData = null;
      this.clientServices = [];
      this.foundedClients = [];
      this.availableWorkouts = [];
      this.abonement2buy = null;
      this.service2buy = null;
      this.current_client = default_record;
      this.show_info = false;
    },
    registerVisit() {
      this.$api
        .registerVisit2client(this.clientServices)
        .then((response) => {
          console.log(response);
        })
        .finally(() => {
          this.closeClient();
        });
    },
    buyService() {
      this.$api
        .addService2client({
          client: this.current_client.idx,
          service: this.service2buy.idx,
        })
        .then((response) => {
          this.clientServices.push(response);
        })
        .finally(() => {
          this.d_buyService = false;
        });
    },
    buyAbonement() {
      this.$api
        .addAbonement2client({
          client: this.current_client.idx,
          abonement: this.abonement2buy.idx,
        })
        .then((response) => {
          try {
            this.clientServices = this.clientServices.concat([...response]);
          } catch (error) {
            console.log(error);
          }
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
    searchClient() {
      if (!this.searchData) return;
      this.$api.searchClient(this.searchData).then((response) => {
        this.foundedClients = [...response];
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
    getAvailableClientServices(item) {
      this.$api
        .getClientServices(item.idx)
        .then((response) => {
          this.clientServices = [...response];
        })
        .finally(() => {
          this.current_client = { ...item };
        });
    },
  },
  mounted() {
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
    if (!this.$store.getters["abonements/isItems"]) {
      this.$store.dispatch("abonements/LOAD");
    }
    if (!this.$store.getters["workouts/isItems"]) {
      this.$store.dispatch("workouts/LOAD");
    }
  },
};
</script>
