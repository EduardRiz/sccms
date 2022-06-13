<template>
  <div style="width: 300px">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateText"
          prepend-inner-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="valid" no-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="apply(false)" color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn icon @click="apply(true)" color="success">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "AskValidDate",
  props: {
    value: String,
  },
  data() {
    return {
      menu: false,
      maxdate: this.$moment().format("YYYY-MM-DD"),
      valid: this.maxdate,
    };
  },
  watch: {
    value(v) {
      this.valid = v;
    },
  },
  computed: {
    dateText() {
      return this.value;
    },
  },
  methods: {
    apply(ok) {
      if (ok) {
        this.$emit("input", this.valid);
      } else {
        this.$emit("input", this.maxdate);
      }
      this.valid = null;
      this.menu = false;
    },
  },
};
</script>

<style>
</style>