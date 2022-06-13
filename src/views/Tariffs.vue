<template>
  <v-sheet class="sc-page-sheet">
    <TariffTable alltypes @onClose="$router.push('/')"/>
  </v-sheet>
</template>

<script>
//import TariffTable from "@/components/TariffsTable.vue";

export default {
  name: "Tariffs",
  components: { TariffTable: () => import("@/components/TariffsTable.vue") },
};
</script>

<style>
</style>