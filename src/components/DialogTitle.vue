<template>
  <i18n path="dialogs.ryba">
    <template #prefix>
      <i18n :path="pref" />
    </template>
    <template #object>
      <i18n :path="'dialogs.'+object" />
    </template>
    <template #idx>{{item.idx}}</template>
  </i18n>
</template>

<script>
export default {
  name: "DialogTitle",
  props: { object: String, item: Object },
  computed: {
    pref() {
      if (!this.item) return "";
      return this.item.idx ? "dialogs.edit" : "dialogs.create";
    },
  },
};
</script>

<style>
</style>