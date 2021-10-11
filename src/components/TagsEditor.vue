<template>
  <div>
    <v-row dense>
      <v-col cols="3">
        <v-text-field
          v-model="ntag"
          append-icon="mdi-plus-circle"
          @click:append="add"
          label="Tags"
          @keypress.enter="add"
        ></v-text-field>
      </v-col>
      <v-col cols="9" align-self="center">
        <v-chip close v-for="i in tags" :key="i" @click:close="rem(i)" class="ml-2">{{i}}</v-chip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TagsEditor",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      ntag: null,
      tags: this.value,
    };
  },
  watch: {
    value: {
      handler(v) { this.tags = v?[...v]:[];},
    },
  },
  methods: {
    add() {
      if (!this.tags) this.tags = [];
      if (this.ntag) this.tags.push(this.ntag);
      this.$emit("input", this.tags);
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