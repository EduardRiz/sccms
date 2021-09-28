<template>
  <v-dialog v-model="value" persistent max-width="400">
    <v-card color="deep-purple lighten-5">
      <v-card-title>
        <span>{{title_}}</span>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input',false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-4">
        <slot>{{text_}}</slot>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn
          ref="mainBtn"
          text
          outlined
          rounded
          @click="$emit('input',false), $emit('click:ok')"
          class="mr-4"
          color="blue darken-1"
        >
          <v-icon v-text="icon_" class="mr-2"></v-icon>
          {{button_}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    mode: {
      type: String,
      default() {
        return "delete";
      }
    },
    value: { type: Boolean }
  },
  computed: {
    title_() {
      return this.$t("dialog.ttl." + this.mode);
    },
    text_() {
      return this.$t("dialog.txt." + this.mode);
    },
    button_() {
      return this.$t("dialog.btn." + this.mode);
    },
    icon_() {
      return this.$t("dialog.ico." + this.mode);
    }
  }
  // mounted() {
  //   if (!this.$refs.mainBtn) return;
  //   this.$nextTick(() => this.$refs.mainBtn.$el.focus());
  // }
};
</script>

<style>
</style>