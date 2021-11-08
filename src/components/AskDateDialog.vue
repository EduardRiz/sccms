<template>
  <v-menu
    ref="menu"
    v-model="dateSelect"
    :close-on-content-click="false"
    max-width="290px"
    :return-value.sync="date2buy"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="formatedDate"
        :label="$t('fields.dateofbuy')"
        prepend-icon="mdi-calendar"
        readonly
        class="date-text-field"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date2buy"
      no-title
      scrollable
      first-day-of-week="1"
      :locale="$i18n.locale"
      :min="new Date().toISOString()"
    >
      <v-spacer></v-spacer>
      <v-btn text color="error" @click="dateSelect = false">
        <i18n path="button.cancel" />
      </v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(date2buy)">
        <i18n path="button.ok" />
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  hame: "DateDialog",
  props: {
    value: Object,
  },
  data() {
    return {
      dateSelect: false,
      date2buy: new Date().toISOString(),
    };
  },
  watch: {
    date2buy() {
      this.$emit("input", this.$moment(this.date2buy));
    },
  },
  computed: {
    formatedDate() {
      try {
        this.$moment.locale(this.$i18n.locale);
        return this.date2buy ? this.$moment(this.date2buy).format("LL") : "";
      } catch (error) {
        console.log(error);
        return "";
      }
    },
  },
  mounted() {
    this.$emit("input", this.$moment(this.date2buy));
  },
};
</script>

<style scoped>
.date-text-field {
  width: 290px;
}
</style>