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
    <v-footer app>{{footer}}</v-footer>
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
