<template>
  <v-list class="orange lighten-5">
    <template v-for="item in registeredClientServices">
      <v-list-item :key="item.idx">
        <v-list-item-avatar>
          <v-icon fab>mdi-human-scooter</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            <span>{{item.created}}</span>
            <span class="ml-2">{{item.details.info.name}}</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span>{{item.tariff.info.name}}</span>
            <span class="ml-2">{{item.price | currency}}</span>
            <v-chip class="my-2 ml-2 text" v-if="item.details.timed">
              <v-icon class="mr-1">mdi-timer-outline</v-icon>
              <span>{{item | spend_filter}}</span>
              <!-- <span>{{item.tariff.duration | spend_filter}}</span> -->
            </v-chip>
          </v-list-item-subtitle>
          <v-divider></v-divider>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-row dense v-if="current_visitlog">
          <v-col cols="8">
            <table width="100%">
              <tr>
                <td colspan="2">
                  <i18n path="home.clientin" class="mr-4" />
                  <span>{{current_visitlog.fromdate}}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i18n path="home.stime" />
                </td>
                <td><span>{{spendedTime | f_spendtime}}</span></td>
              </tr>
              <tr v-if="purchasedTime">
                <td>
                  <i18n path="home.ptime" />
                </td>
                <td>{{purchasedTime}}</td>
              </tr>
            </table>
          </v-col>
          <v-col cols="3" align-self="center" class="text-center text-h5" v-if="purchasedTime">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-icon class="mr-1">mdi-timer-outline</v-icon>
                  <v-chip :color="etimecolor">
                    <v-icon class="mx-1" v-if="etimecolor=='error'">mdi-plus</v-icon>
                    <span class="text-h6">{{extraTime | absolute}}</span>
                    <span class="ml-2">min</span>
                  </v-chip>
                </div>
              </template>
              <i18n path="tt.extratime" />
            </v-tooltip>
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import moment from "moment"
export default {
  name: "RegisteredClientServices",
  props: {
    services: Array,
    visitlog: Object,
  },
  filters: {
    absolute(v) {
      return Math.abs(v);
    },
    f_spendtime(v){
      return v+" (~"+moment.duration(v,"minutes").humanize()+")";
    }
  },
  computed: {
    registeredClientServices() {
      return this.services;
    },
    current_visitlog() {
      return this.visitlog;
    },
    spendedTime() {
      try {
        const from = this.$moment(
          this.current_visitlog.fromdate,
          "YYYY-MM-DD hh:mm:ss"
        );
        const diff = from.diff(this.$moment(), "minutes", true);
        return Math.abs(Math.ceil(diff));
      } catch (error) {
        return "";
      }
    },
    purchasedTime() {
      let ptime = 0;
      try {
        this.registeredClientServices.forEach((serv) => {
          try {
            if (serv.details.timed) {
              ptime += parseInt(serv.spendmin);
            }
          } catch (error) {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      }
      return ptime;
    },
    extraTime() {
      try {
        return this.spendedTime - this.purchasedTime;
      } catch (error) {
        return 0;
      }
    },
    etimecolor() {
      return this.extraTime > 0 ? "error" : "success";
    },
  },
};
</script>

<style>
</style>