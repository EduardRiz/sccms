<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <TariffTable alltypes/>
  </v-sheet>
</template>

<script>
import TariffTable from "@/components/TariffsTable.vue";

export default {
  name: "Tariffs",
  components: { TariffTable },
};
</script>

<style>
</style>