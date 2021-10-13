<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-row align="center" align-content="center">
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-select v-model="filter.tag" :items="tags" :label="$t('fields.tags')" clearable></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="records"
      :search="search"
      item-key="idx"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar>
          <v-img alt="Avatar" :src="$api.publicImgLink(item.img)" />
        </v-avatar>
      </template>
      <template v-slot:item.info.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:body.append>
        <div class="add-button-div">
          <v-btn fab absolute bottom @click="edit(null)" dark class="pink">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <sc-client-dialog v-model="d_edit" :item="item" />
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import ClientDialog from "@/components/ClientDialog";
const store_module = "clients";

export default {
  name: "Clients",
  mixins: [commonmixin],
  components: { "sc-client-dialog": ClientDialog },
  computed: {
    records() {
      return this.$store.getters[store_module + "/items"];
    },
    tags() {
      return this.$store.getters[store_module + "/tags"];
    },
  },
  data() {
    return {
      item: null,
      d_edit: false,
      filter: {},
      headers: [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
        {
          text: this.$t("fields.name"),
          value: "info.name",
        },
        {
          text: this.$t("fields.avatar"),
          value: "image",
        },
        {
          text: this.$t("fields.description"),
          value: "info.description",
        },
        {
          text: this.$t("fields.status"),
          value: "info.status",
        },
        {
          text: this.$t("fields.tags"),
          value: "info.tags",
          filter: (value) => {
            if (!this.filter.tag) return true;
            return value && value.indexOf(this.filter.tag) != -1;
          },
        },
      ],
    };
  },
  methods: {
    edit(i) {
      this.item = i ? { ...i } : null;
      this.d_edit = true;
    },
  },
  mounted() {
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
  },
};
</script>

<style>
</style>