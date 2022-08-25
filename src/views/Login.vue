<template>
  <!-- <v-content class="idcs-background fill-height"> -->
  <v-container class="fill-height idcs-background fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="5" lg="4" xl="3">
        <v-card class="elevation-12 login-class yellow lighten-5">
          <v-card-title class="primary white--text">
            {{$t('login.title')}}
            <v-spacer></v-spacer>
            <SelectLocale class="justify-end" />
          </v-card-title>
          <v-card-text class="mt-4">
            <v-alert
              v-model="showAlert"
              border="left"
              colored-border
              type="error"
              elevation="2"
              :dismissible="true"
              transition="fade-transition"
            >{{alertMessage}}</v-alert>
            <v-form ref="form" :lazy-validation="true" id="lform">
              <v-text-field
                v-model.trim="user"
                :placeholder="$t('login.login')"
                name="username"
                outlined
                autofocus
                shaped
                :rules="userRules"
                prepend-icon="mdi-account"
                @keypress.enter="$refs.password.focus()"
                required
              />
              <v-text-field
                v-model.trim="pass"
                id="password"
                ref="password"
                :placeholder="$t('login.pass')"
                outlined
                shaped
                name="password"
                :rules="userRules"
                prepend-icon="mdi-lock"
                type="password"
                @keypress.enter="login"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="mt-n8">
            <v-spacer />
            <v-btn color="primary mr-2" rounded @click="login">{{$t('login.b_login')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div class="info-panel">
      <div class="info-panel-msg" v-for="msg in infoMessages" :key="msg.idx">
        <sc-info-message :item="msg" test />
      </div>
    </div>
  </v-container>
  <!-- </v-content> -->
</template>

<script>
import SelectLocale from "@/components/Select-locale";

export default {
  components: {
    SelectLocale,
    "sc-info-message": () => import("@/components/controls/InfoMessage.vue"),
  },
  name: "Login",
  data() {
    return {
      showAlert: false,
      alertMessage: "",
      infoMessages: [],
      user: "",
      userRules: [(v) => !!v || this.$t("error.required")],
      pass: "",
      domen: "",
      wsid: null,
    };
  },
  mounted() {
    fetch("http://localhost:8083/gettoken")
      .then((r) => r.json())
      .then((d) => {
        sessionStorage.setItem("token", d.token);
        this.wsid = d.wsid;
      });
    //window.history.replaceState({}, document.title, "/#/login");
    this.$api.loadInfoMessages().then((r) => (this.infoMessages = [...r]));
  },
  methods: {
    showAlertMessage(m) {
      this.showAlert = true;
      this.alertMessage = m;
      setTimeout(() => {
        this.showAlert = false;
      }, 4000);
    },
    async login() {
      if (!this.$refs.form.validate()) return;
      this.showAlert = false;
      try {
        if (
          await this.$store.dispatch("session/LOGIN", {
            pars: {
              username: this.user,
              pass: this.pass,
              wsid: this.wsid,
            },
            __vm: this,
          })
        ) {
          this.$router.push("/");
        }
      } catch (e) {
        console.dir(e);
        this.showAlertMessage(e);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.login-class {
  border-radius: 25px !important;
}
.info-panel {
  position: absolute;
  margin-bottom: 5px;
  bottom: 0;
  width: 100%;
}
.info-panel-msg {
  margin: auto;
  margin-bottom: 5px;
  width: 40%;
}
</style>>

