<template>
  <td class="d-flex">
    <v-switch v-model="sett.visits" :label="$t('fields.servisvisits')" :disabled=sett.scalar></v-switch>
    <v-text-field
      v-if="sett.visits"
      v-model="sett.vcount"
      type="number"
      :label="$t(sett.scalar?'fields.servis_scalar':'fields.servis_visits')"
      min="1"
      class="ml-6"
    ></v-text-field>
  </td>
</template>

<script>
const DEF = { visits: false, vcount: "1" };

export default {
  name: "ServiceSettings",
  props: {
    item: Object,
    idx: Number,
  },
  data() {
    return {
      sett1: { ...DEF },
    };
  },
  computed: {
    id() {
      return "s" + this.idx;
    },
    sett: {
      get() {
        try {
          return this.item.settings[this.id];
        } catch (error) {
          return { ...DEF };
        }
      },
      cache: false,
    },
  },
  watch: {
    item: {
      handler() {
        this.setDefs();
      },
      deep: true,
    },
  },
  methods: {
    setDefs() {
      if (!this.item.settings) this.item.settings = {};
      if (!this.item.settings[this.id])
        this.item.settings = { ...this.item.settings, [this.id]: { ...DEF } };
      //console.log("set def", this.id, v.settings[this.id]);
    },
  },
  mounted() {
    this.setDefs();
  },
};
</script>

<style>
</style>