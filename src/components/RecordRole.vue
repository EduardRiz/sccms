<template>
  <span>{{role_}}</span>
</template>

<script>
export default {
  name: "RecordRoleIcon",
  props: { role: String },
  computed: {
    role_() {
      if (this.role) {
        const e = this.$t("roles").find((el) => el.value == this.role);
        return e ? e.text : "";
      }
      return "";
    },
  },
};
</script>

<style>
</style>