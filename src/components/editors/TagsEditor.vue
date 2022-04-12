<template>
  <div>
    <v-row dense>
      <v-col cols="4">
        <v-autocomplete
          v-model="ntag1"
          append-icon="mdi-plus-circle"
          :search-input.sync="ntag"
          @click:append="add"
          :items="items"
          hide-no-data
          hide-selected
          :error-messages="errMessage"
          :label="$t('fields.tags')"
          @keypress.enter="add"
          @update:search-input="onchange"
        ></v-autocomplete>
      </v-col>
      <v-col cols="8" align-self="center">
        <v-chip close v-for="i in tags" :key="i" @click:close="rem(i)" class="ma-1">{{i}}</v-chip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TagsEditor",
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    source: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      ntag: null,
      ntag1: null,
      tags: this.value,
    };
  },
  watch: {
    value: {
      handler(v) {
        this.tags = v ? [...v] : [];
        this.ntag = null;
        this.ntag1 = null;
      },
    },
  },
  computed: {
    errMessage() {
      if (this.required) {
        if (this.value.length == 0) return this.$t("error.required");
      }
      return null;
    },
    items() {
      return this.source;
    },
  },
  methods: {
    onchange() {
      if (!this.tags) this.tags = [];
      if (this.ntag1 && this.tags.indexOf(this.ntag1) == -1) {
        this.tags.push(this.ntag1);
        this.$emit("input", this.tags);
      }
    },
    add() {
      if (!this.tags) this.tags = [];
      if (this.ntag && this.tags.indexOf(this.ntag) == -1) {
        this.tags.push(this.ntag);
        this.$emit("input", this.tags);
      }
      this.ntag = null;
    },
    rem(i) {
      this.value.splice(this.tags.indexOf(i), 1);
    },
  },
};
</script>

<style>
</style>