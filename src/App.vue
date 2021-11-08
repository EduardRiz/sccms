<template>
  <v-app>
    <AppHeader />
    <v-main app>
      <v-container fluid fill-height class="pa-0">
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
  </v-bottom-navigation> -->
    <v-footer app><span>{{footer}}</span></v-footer>
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

export default {
  name: "App",
  components: {
    AppHeader,
  },

  data: () => ({
    show: false,
    mText: "",
    mColor: "blue lighten-1",
    footer: "",
  }),
  mounted() {
    this.$root.$on("set_footer_message", (m) => {
      this.footer = m;
    });
    this.$root.$on("showmsg", (e) => {
      this.mText = e.msg;
      if (e.color) this.mColor = e.color;
      this.show = true;
    });
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
