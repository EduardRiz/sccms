<template>
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
                <sc-record-info :idx="item.workout.coach" store="coachs/item" class="ml-1" />
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
</template>

<script>
export default {
  name: "ClientRegisteredServices",
  props: {
    items: Array,
    client: Object,
  },
  computed: {
    current_client() {
      return this.client;
    },
    clientRegisteredServices() {
      return this.items;
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