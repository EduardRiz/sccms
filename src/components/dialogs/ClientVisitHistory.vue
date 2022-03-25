<template>
  <v-dialog v-model="isActive" persistent width="90%">
    <v-card class="orange lighten-4">
      <v-card-title>
        <i18n path="dialogs.history">
          <tpl #client>{{current_client.name}}</tpl>
        </i18n>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" icon color="error">
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
                <td>{{r.count | fcount}}</td>
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
</template>

<script>
export default {
  name: "ClientVisitHistory",
  props: {
    client: Number,
    value: Boolean,
  },
  data() {
    return {
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
  computed: {
    isActive() {
      return this.value;
    },
  },
  filters: {
    fcount(v) {
      if (!v) return "";
      return v;
    },
  },
  watch: {
    value(v) {
      if (!v) return;
      this.$api.loadClientHistory(this.client).then((r) => {
        this.history = [...r];
      });
    },
  },
  methods: {},
};
</script>

<style>
</style>