<template>
  <div>
    <v-row dense>
      <v-col cols="12" class="text-center">{{tit}}</v-col>
      <v-col cols="7">
        <v-menu
          ref="dmenu"
          v-model="dmenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              :label="$t('msgs.date')"
              prepend-icon="mdi-calendar"
              readonly
              :rules="[$rules.required]"
              :error-messages="errors"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable @input="dmenu = false" :min="mindate" />
        </v-menu>
      </v-col>
      <v-col cols="5">
        <v-menu
          ref="tmenu"
          v-model="tmenu"
          :close-on-content-click="false"
          :return-value.sync="time"
          transition="scale-transition"
          offset-y
          min-width="290px"
          max-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              :label="$t('msgs.time')"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              :error-messages="errors"
              :rules="[$rules.required]"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="tmenu"
            v-model="time"
            format="24hr"
            full-width
            no-title
            @click:minute="$refs.tmenu.save(time)"
          ></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "DateTimePicker",
  props: { value: String, title: String, error: String },
  computed: {
    errors() {
      return this.error;
    },
    tit() {
      return this.title;
    },
    date: {
      get() {
        // if (!this.value) return new Date().toISOString().split("T")[0];
        if (!this.value) return "";
        return this.value.split(" ")[0];
      },
      set(v) {
        this.$emit("input", v + " " + this.time);
      },
    },
    time: {
      get() {
        if (!this.value) return "";
        return this.value.split(" ")[1];
      },
      set(v) {
        this.$emit("input", this.date + " " + v);
      },
    },
  },
  data() {
    return {
      mindate: new Date().toISOString().split("T")[0],
      dmenu: false,
      tmenu: false,
      //time: "12:00",
      //date: new Date().toISOString().split("T")[0],
    };
  },
};
</script>

<style>
</style>