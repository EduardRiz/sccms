<template>
  <v-sheet class="fill-height idcs-fill-width transparent">
    <sc-dashboard-panel />
    <v-btn
      absolute
      fab
      width="100"
      height="100"
      class="success mt-3"
      @click="editClient"
      dark
      right
    >
      <v-icon x-large>mdi-account-plus</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-col cols="6" class="search-panel">
        <v-row>
          <v-col cols="12">
            <v-card class="grey lighten-5">
              <v-card-title>
                <v-text-field
                  ref="client1"
                  append-icon="mdi-magnify"
                  prepend-inner-icon="mdi-account"
                  autofocus
                  v-model="searchData"
                  :label="$t('home.findlbl')"
                  :rules="[v=>(!!v&&v.length>2)||$t('home.finderr')]"
                  :error-messages="searchError"
                  @click:append="globalClientSearch"
                  @keyup.escape="searchData=null"
                  @keydown.enter="globalClientSearch"
                  @keydown.tab.prevent="$refs.key1.focus()"
                  @keydown.escape="searchData=null"
                  clearable
                ></v-text-field>
                <v-spacer v-if="$store.getters['session/isAutocard']"></v-spacer>
                <v-btn
                  to="/anonymhome"
                  fab
                  class="blue"
                  dark
                  v-if="$store.getters['session/isAutocard']"
                >
                  <v-icon x-large>mdi-incognito</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text
                v-if="availableSearcData"
                class="founded-items"
                :style="{height:foundedHeight}"
              >
                <v-row justify="center" v-if="foundedClients.length">
                  <v-col cols="12" dense>
                    <div class="text-center">
                      <i18n path="home.cllist">
                        <template #size>{{foundedClients.length}}</template>
                      </i18n>
                    </div>
                    <v-divider></v-divider>
                  </v-col>
                  <v-card
                    v-for="item in foundedClients"
                    :key="item.idx"
                    @click.stop="gotoClientHome(item)"
                    width="290"
                    class="orange lighten-5 ma-2 founded-item"
                  >
                    <v-card-title>
                      <v-avatar class="mr-4">
                        <v-img :src="$api.publicImgLink(item.img, true)" />
                      </v-avatar>
                      <span v-html="item.card"></span>
                    </v-card-title>
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12">
                          <v-icon class="mr-1" small color="primary">mdi-account</v-icon>
                          <span v-html="item.name"></span>
                        </v-col>
                        <v-col cols="12" v-if="item.phone">
                          <v-icon class="mr-1" small color="primary">mdi-phone</v-icon>
                          <span>{{item.phone}}</span>
                        </v-col>
                        <v-col cols="12" v-if="item.email">
                          <div>
                            <v-icon class="mr-1" small color="primary">mdi-email</v-icon>
                            <span>{{item.email}}</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-row>
                <v-row justify="center" v-if="foundedKeys.length">
                  <v-col cols="12">
                    <div class="text-center">
                      <i18n path="home.klist">
                        <template #size>{{foundedKeys.length}}</template>
                      </i18n>
                    </div>
                    <v-divider></v-divider>
                  </v-col>
                  <v-card
                    v-for="item in foundedKeys"
                    :key="item.idx"
                    @click="gotoClientHome(null,item)"
                    width="290"
                    class="blue lighten-5 ma-2 founded-item"
                  >
                    <v-card-title>
                      <v-avatar class="mr-4">
                        <v-icon fab>mdi-key</v-icon>
                      </v-avatar>
                      <span v-html="item.boxkey"></span>
                    </v-card-title>
                    <v-card-text class="text-right">
                      <i18n path="home.keyinfo">
                        <template #from>{{item.fromdate| dt-time}}</template>
                      </i18n>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <sc-client-dialog v-model="d_client" :item="item" @save="onNewClient" />
  </v-sheet>
</template>

<script>
import ClientDialog from "@/components/dialogs/ClientDialog";
import Dashboard from "@/components/home/DashboardPanel.vue";

export default {
  name: "Home",
  components: {
    "sc-client-dialog": ClientDialog,
    "sc-dashboard-panel": Dashboard,
  },
  data() {
    return {
      d_client: false,
      item: {},
      searchData: null,
      foundedClients: [],
      foundedKeys: [],
      searchError: null,
    };
  },
  watch: {
    searchData(v) {
      if (v) this.clientSearchError = null;
      if (!v) {
        this.searchData = null;
        this.foundedClients = [];
        this.foundedKeys = [];
        this.$refs.client1.focus();
      }
    },
  },
  computed: {
    availableSearcData() {
      try {
        return this.foundedClients.length + this.foundedKeys.length > 0;
      } catch (error) {
        return false;
      }
    },
    foundedHeight() {
      try {
        const l = this.foundedClients.length + this.foundedKeys.length;
        if (l < 3) return "240px";
        if (l < 5) return "430px";
        return "500px";
      } catch (error) {
        return "0px";
      }
    },
  },
  methods: {
    editClient(cl) {
      this.item = this.$api.copy(cl, null);
      this.d_client = true;
    },
    onNewClient(item) {
      try {
        if (item) this.foundedClients.push(item);
      } catch (error) {
        console.log(error);
      }
    },
    globalClientSearch() {
      this.searchError = null;
      if (!this.searchData || this.searchData.length < 3) return;
      this.$api.globalSearchClient(this.searchData).then((response) => {
        this.foundedClients = [...response.clients];
        this.foundedKeys = [...response.keys];
        if (this.foundedClients.length == 0 && this.foundedKeys.length == 0) {
          this.searchError = this.$t("error.clientNotFound", {
            pattern: this.searchData,
          });
          this.searchData = null;
        }
        if (this.foundedClients.length + this.foundedKeys.length == 1) {
          if (this.foundedClients.length) {
            // this.$router.push("/chome/" + this.foundedClients[0].idx);
            this.gotoClientHome(this.foundedClients[0]);
          } else {
            this.gotoClientHome(null, this.foundedKeys[0]);
            // this.$router.push("/chome/" + this.foundedKeys[0].cidx);
          }
        }
      });
    },
    gotoClientHome(c, k) {
      if (c) {
        if (
          this.$store.getters["session/isAutocard"] &&
          this.$store.getters["session/testAutocard"](c.card)
        ) {
          this.$router.push("/anonymhome");
        } else {
          this.$router.push("/chome/" + c.idx);
        }
      }
      if (k) {
        if (this.$store.getters["session/testAutocard"](k.card)) {
          this.$router.push("/anonymhome?k=" + k.bkidx);
        } else {
          this.$router.push("/chome/" + k.cidx);
        }
      }
    },
  },
  beforeDestroy() {
    this.$root.$off("app-event/hid");
  },
  mounted() {
    try {
      this.$root.$on("app-event/hid", (e) => {
        //        console.log(e, this.$store.getters["session/testWsid"](e.detail.wsid));
        if (!this.$store.getters["session/testWsid"](e.detail.wsid)) return;
        //      console.log(e.detail.data);
        this.searchData = e.detail.data;
        this.globalClientSearch();
      });
      if (this.$route.query.c) {
        this.searchData = this.$route.query.c;
        this.globalClientSearch();
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
<style scoped>
.pointer-cursor {
  cursor: pointer;
}
.founded-items {
  /* height: 500px; */
  overflow: auto;
}
.search-panel {
  margin-top: 70px;
  opacity: 0.96;
}
.founded-item:hover {
  -webkit-box-shadow: 10px 10px 8px 5px rgba(34, 60, 80, 0.19);
  -moz-box-shadow: 10px 10px 8px 5px rgba(34, 60, 80, 0.19);
  box-shadow: 10px 10px 8px 5px rgba(34, 60, 80, 0.19);
}
.founded-item:focus {
  -webkit-box-shadow: 10px 10px 8px 5px rgba(34, 60, 80, 0.19);
  -moz-box-shadow: 10px 10px 8px 5px rgba(34, 60, 80, 0.19);
  box-shadow: 10px 10px 8px 5px rgba(34, 60, 80, 0.19);
}
</style>
