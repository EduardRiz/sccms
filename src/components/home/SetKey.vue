<template>
  <v-dialog v-model="isActive" persistent width="400" @keydown.escape="$emit('input', false)">
    <v-card class="teal lighten-5">
      <v-card-title>
        <i18n path="dialogs.assignKey"></i18n>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-10">
        <v-subheader v-if="error" class="error--text">{{error}}</v-subheader>
        <v-autocomplete
          autofocus
          v-model="key2assign"
          prepend-icon="mdi-key"
          :label="$t('fields.key')"
          :items="availableKeys"
          return-object
          :search-input.sync="searchInput"
          item-value="idx"
          :error="error!=null"
          @keydown.enter="acceptKey"
          item-text="name"
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="acceptKey" class="success rounded-pill elevation-10" v-if="key2assign">
          <i18n path="button.ok" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogSetKey",
  props: {
    value: Boolean,
  },
  data() {
    return {
      key2assign: null,
      availableKeys: [],
      error: null,
      searchInput: null,
    };
  },
  computed: {
    isActive: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    value() {
      this.key2assign = null;
      this.error = null;
      this.searchInput = null;
      this.availableKeys = [];
      this.$api.getAvailableKeys().then((response) => {
        this.availableKeys = [...response];
      });
    },
  },
  methods: {
    acceptKey() {
      if (this.key2assign != null) this.$emit("onKey", this.key2assign);
      else {
        if (this.searchInput != null) {
          const s = this.searchInput.toLowerCase();
          this.key2assign = this.availableKeys.find((e) => {
            if (e.name.toLowerCase() == s || e.keyid.toLowerCase() == s)
              return e;
          });
          if (this.key2assign != null) {
            this.$emit("onKey", this.key2assign);
            return;
          }
        }
        this.error = this.$t("error.keysNotFound", { key: this.searchInput });
        this.searchInput = null;
      }
    },
  },
  beforeDestroy() {
    this.$root.$off("app-event/hid");
  },
  mounted() {
    this.$root.$on("app-event/hid", (e) => {
      if (!this.$store.getters["session/testWsid"](e.detail.wsid)) return;
      const key = e.detail.data.replaceAll("\r","");
      this.searchInput = key;
      this.acceptKey();
    });
  },
};
</script>

<style>
</style>