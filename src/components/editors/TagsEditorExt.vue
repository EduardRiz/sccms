<template>
  <div>
    <v-row dense>
      <v-col cols="3">
        <v-text-field
          v-model="ntag"
          append-icon="mdi-plus-circle"
          :label="$t('fields.tags')"
          @click:append="add"
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
  name: "TagsEditorExt",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    source: {
      type: Object,
      default() {
        return { info: { tags: [] } };
      },
    },
  },
  data() {
    return {
      ntag: null,
      tags_: this.value,
    };
  },
  computed: {
    tags() {
      try {
        return this.source.info.tags;
      } catch (error) {
        return [];
      }
    },
  },
  watch: {
    value: {
      handler(v) {
        console.log("change", v);
        this.tags_ = v ? [...v] : [];
      },
    },
  },
  mounted() {
    console.log("m", this.value);
  },
  methods: {
    add() {
      if (!this.tags) this.tags = [];
      if (this.ntag && this.tags.indexOf(this.ntag) == -1) {
        this.source.push(this.ntag);
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