<template>
  <v-app>
    <AppHeader />
    <v-main app>
      <v-container fluid fill-height class="pa-0 main-back">
        <v-fade-transition mode="out-in" appear>
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-main>
    <!-- <v-bottom-navigation v-model="value">
    <v-btn value="recent">
      <span>Recent</span>

      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn value="favorites">
      <span>Favorites</span>

      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn value="nearby">
      <span>Nearby</span>

      <v-icon>mdi-map-marker</v-icon>
    </v-btn>
    </v-bottom-navigation>-->
    <v-footer app>
      <span>{{footer}}</span>
    </v-footer>
    <v-snackbar v-model="show" :color="mColor" transition="v-scroll-x-transition" shaped>
      {{ mText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" icon v-bind="attrs" @click="show=false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: "App",
  components: {
    AppHeader,
  },

  data: () => ({
    socket: null,
    interval: null,
    stompClient: null,
    show: false,
    mText: "",
    hb: null,
    mColor: "blue lighten-1",
    footer: "",
  }),

  methods: {
    connect() {
      if (this.connected) return;
      this.socket = new SockJS(this.$api.api + "/sc-events-queue");
      this.stompClient = Stomp.over(this.socket, { debug: false });
      this.stompClient.connect(
        {},
        (frame) => {
          const { command } = frame;
          switch (command) {
            case "CONNECTED":
              this.showSnap({
                msg: "Synchronization is enabled",
                color: "success",
              });
              this.$store.commit("session/setConnected", true);
              this.$api.ping();
              break;
          }
          //console.log(frame);
          this.connected = true;
          this.stompClient.subscribe("/events", (tick) => {
            try {
              const msg = { ...JSON.parse(tick.body) };
              //console.log(msg);
              // this.showSnap({
              //   msg: tick,
              //   color: "primary",
              // });
              this.$root.$emit("app-event/" + msg.event, msg);
            } catch (error) {
              console.log(error);
            }
          });
        },
        (error) => {
          this.$store.commit("session/setConnected", false);
          this.showSnap({ msg: error.type, color: "error" });
          if (error.type == "close") this.reconnect();
          console.log(error);
        }
      );
    },
    reconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
      if (this.interval) return;
      this.interval = setInterval(() => {
        if (!this.connected) this.connect();
        else {
          clearInterval(this.interval);
          this.interval = null;
        }
      }, 5000);
    },
    showSnap(e) {
      this.mText = e.msg;
      if (e.color) this.mColor = e.color;
      this.show = true;
    },
  },
  mounted() {
    this.$root.$on("set_footer_message", (m) => {
      this.footer = m;
    });
    this.$root.$on("app-events", (m) => {
      this.footer = m;
    });
    this.$root.$on("app-event/refresh", (e) => {
      try {
        if (this.$store.getters["session/testUser"](e.user)) return;
        // Synchro club Object
        if (this.$store.getters["session/testClub"](e.club)) {
          switch (e.detail) {
            case "rooms":
              this.$store.dispatch("rooms/LOAD");
              break;
            case "coachs":
              this.$store.dispatch("coachs/LOAD");
              break;
            case "workouts":
              this.$store.dispatch("workouts/LOAD");
              break;
            case "keys":
              this.$store.dispatch("keys/LOAD");
              break;
          }
        }
        // Synchro global Object
        switch (e.detail) {
          case "abonements":
            this.$store.dispatch("abonements/LOAD");
            break;
          case "services":
            this.$store.dispatch("services/LOAD");
            break;
          case "tariffs":
            this.$store.dispatch("tariffs/LOAD");
            break;
        }
      } catch (error) {
        console.log(e, error);
      }
    });
    this.$root.$on("heartbeat", (m) => {
      if (this.hb && !m) clearInterval(this.hb);
      if (m) {
        if (!this.hb)
          this.hb = setInterval(() => this.$api.ping(), 1000 * 60 * 20);
      } else {
        this.hb = null;
      }
    });
    this.$root.$on("showmsg", (e) => {
      this.showSnap(e);
    });
    this.connect();
  },
};
</script>
<style>
tbody tr:nth-of-type(odd) {
  background-color: cornsilk;
}
thead {
  background-color: #bfe0df;
}
.v-data-footer {
  background-color: #bfe0df;
}
.idcs-fill-width {
  width: 100%;
}
.radius-25 {
  border-radius: 25px;
}
.sc-page-sheet {
  width: 100%;
  height: 98%;
  padding-right: 12px !important;
  padding-left: 12px !important;
  margin: 8px !important;
  border-radius: 25px;
  opacity: 0.92;
}
.main-back {
  background: url("~@/assets/background.jpg");
  background-repeat: round;
}
.div-as-button {
  cursor: pointer;
}

.idcs-dialog-title {
  background-color: #a8e0ff !important;
  border-color: #a8e0ff !important;
  margin-bottom: 16px !important;
}

.idcs-main-list {
  background-color: #fffde7 !important;
  border-color: #fffde7 !important;
}

.add-button-div {
  position: absolute;
  padding-top: 58px;
  margin-left: 10px;
}
</style>
