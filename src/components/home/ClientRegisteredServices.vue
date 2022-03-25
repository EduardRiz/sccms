<template>
  <v-card class="transparent" v-if="current_client.idx" flat>
    <!-- <v-card-title>
      <v-avatar>
        <v-img alt="Avatar" :src="$api.publicImgLink(current_client.img, true)" />
      </v-avatar>
      <span class="ml-6">{{current_client.name}}</span>
      <v-spacer></v-spacer>
      <v-btn fab icon color="primary" @click="d_client_history=true">
        <v-icon>mdi-history</v-icon>
      </v-btn>
    </v-card-title>-->
    <v-card-text>
      <v-list three-line class="orange lighten-5" v-if="clientRegisteredServices.length">
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
              <v-list-item-subtitle v-if="item.workout.idx">
                <v-icon x-small color="primary" class="mx-2">{{$t("icons.workouts")}}</v-icon>
                <sc-record-info :idx="item.workout.idx" store="workouts/item" />
                <v-icon x-small color="primary" class="mx-2">{{$t("icons.rooms")}}</v-icon>
                <sc-record-info :idx="item.workout.room" store="rooms/item" class="ml-1" />
                <v-icon x-small color="primary" class="mx-2">{{$t("icons.coachs")}}</v-icon>
                <sc-record-info :idx="item.workout.coach" store="coachs/item" class="ml-1" />
                <div v-if="item.settings">
                  <v-icon>mdi-clock</v-icon>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <div>
        <i18n v-if="clientRegisteredServices.length==0" path="label.regservnotfounds" />
        <v-btn fab icon color="primary" @click="d_client_history=true">
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </div>
    </v-card-text>
    <v-dialog v-model="d_client_history" fullscreen>
      <v-card class="orange lighten-4">
        <v-card-title>
          <i18n path="dialogs.history">
            <tpl #client>{{current_client.name}}</tpl>
          </i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_client_history=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th v-for="h in headers" :key="h">
                  <i18n :path="'fields.'+h" />
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="r in history">
                <tr :key="r.idx">
                  <td>{{r.created | dt-time}}</td>
                  <td>{{r.club}}</td>
                  <td>{{r.service}}</td>
                  <td>{{r.count}}</td>
                  <td>{{r.workout}}</td>
                  <td>{{r.coach}}</td>
                  <td>{{r.room}}</td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "ClientRegisteredServicesPanel",
  props: {
    client: Object,
  },
  computed: {
    current_client() {
      return this.client;
    },
  },
  data() {
    return {
      d_client_history: false,
      clientRegisteredServices: [],
      history: [],
      headers: [
        "created",
        "club",
        "service",
        "count",
        "workout",
        "coach",
        "room",
      ],
    };
  },
  watch: {
    d_client_history(v) {
      if (v && this.history.length == 0) {
        this.$api.loadClientHistory(this.current_client.idx).then((r) => {
          this.history = [...r];
        });
      }
    },
    client: {
      handler() {
        this.clientRegisteredServices = [];
        this.history = [];
        this.d_client_history = false;
        if (this.client && this.client.idx) {
          this.$api
            .getRegisteredClientServices(this.client.idx)
            .then((response) => {
              this.clientRegisteredServices = [...response];
            });
        }
      },
      deep: true,
    },
  },
  methods: {
    cancelRegistration(v) {
      console.log(v);
    },
  },
};
</script>

<style>
</style>