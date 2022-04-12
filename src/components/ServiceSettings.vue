<template>
  <td class="d-flex">
    <template v-if="isScalar">
      <v-text-field
        v-model="sett.vcount"
        type="number"
        :label="$t('fields.servis_scalar')"
        min="1"
      ></v-text-field>
    </template>
    <template v-else-if="isTimed">
      <v-text-field
        v-model="sett.spendmin"
        type="number"
        :label="$t('fields.servis_timed')"
        min="1"
      ></v-text-field>
    </template>
    <template v-else>
      <v-switch v-model="sett.visits" :label="$t('fields.servisvisits')"></v-switch>
      <v-text-field
        v-if="sett.visits"
        v-model="sett.vcount"
        type="number"
        :label="$t('fields.servis_visits')"
        min="1"
        class="ml-6"
      ></v-text-field>
    </template>
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
    isScalar() {
      try {
        return this.$store.getters["services/item"](this.idx).scalar;
      } catch (error) {
        return false;
      }
    },
    isTimed() {
      try {
        return this.$store.getters["services/item"](this.idx).timed;
      } catch (error) {
        return false;
      }
    },
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
      if (!this.item.settings[this.id]) {
        if (this.isTimed) {
          this.$set(this.item.settings, this.id, { spendmin: 1 });
        } else if (this.isScalar) {
          this.item.settings = { ...this.item.settings, [this.id]: { ...DEF } };
        } else {
          this.item.settings = { ...this.item.settings, [this.id]: { ...DEF } };
        }
      }
    },
  },
  mounted() {
    this.setDefs();
  },
};
</script>

<style>
</style>