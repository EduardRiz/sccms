<template>
  <div id="splocales">
    <v-speed-dial
      v-model="fab"
      direction="bottom"
      top
      right
      small
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" dark small fab class="transparent">
          <country-flag :country="currentLocale" fab size="normal" />
        </v-btn>
      </template>
      <template v-for="l in locales">
        <v-btn v-if="$i18n.locale!=l" @click="$api.setLocale(l)" fab :value="l" small :key="l">
          <country-flag :country="localeFlag(l)" size="normal" />
        </v-btn>
      </template>
    </v-speed-dial>
  </div>
</template>
<script>
import CountryFlag from "vue-country-flag";

export default {
  components: { CountryFlag },
  props: {
    width: {
      type: String,
      default: "20",
    },
  },
  data() {
    return {
      fab: false,
      locales: ["lv", "ru", "en"],
    };
  },
  computed: {
    currentLocale() {
      return this.localeFlag(this.$i18n.locale?this.$i18n.locale:"en");
    },
  },
  mounted() {},
  methods: {
    localeFlag(l) {
      return l == "en" ? "gb" : l;
    },
  },
};
</script>


<style >
.locale-flag-active {
  opacity: 1 !important;
}
.locale-flag-passive {
  opacity: 0.2 !important;
}
#splocales .v-speed-dial {
  position: absolute;
}
</style>