<template>
  <span>
    <v-icon v-if="icon" class="mr-2" color="primary">{{iconcode}}</v-icon>

    <i18n path="dialogs.ryba">
      <template #prefix>
        <i18n :path="pref" />
      </template>
      <template #object>
        <i18n :path="'dialogs.'+object" />
      </template>
      <template #idx v-if="item">{{item.idx}}</template>
    </i18n>
  </span>
</template>

<script>
export default {
  name: "DialogTitle",
  props: { object: String, item: Object, icon: String },
  computed: {
    iconcode() {
      return this.$t("icons." + this.icon);
    },
    pref() {
      if (!this.item) return "";
      return this.item.idx ? "dialogs.edit" : "dialogs.create";
    },
  },
};
</script>

<style>
</style>