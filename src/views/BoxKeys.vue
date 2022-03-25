<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-select v-model="filter.tag" :items="tags" :label="$t('fields.tags')" clearable></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-col>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
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
        <v-btn icon @click="edit(item)" v-if="$store.getters['session/testPowerUser']">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.sportclub="{ item }">
        <sc-record-info :idx="item.sportclub" store="clubs/item" />
      </template>
      <template v-slot:footer.prepend>
        <v-btn fab @click="edit(null)" dark class="pink my-1" v-if="$store.getters['session/testPowerUser']">
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="d_edit" persistent width="500" @keydown.escape="d_edit=false">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <sc-dialog-title object="key" :item="item" icon="boxkey" />
          <v-spacer></v-spacer>
          <v-btn @click="d_edit=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="item.keyid"
              :label="$t('fields.keyid')"
              :rules="[v=>!!v||$t('error.required')]"
            ></v-text-field>
            <v-text-field v-model="item.name" :label="$t('fields.name')"></v-text-field>
            <v-select
              v-model="item.sportclub"
              :items="$store.getters['clubs/items']"
              :label="$t('fields.club')"
              item-value="idx"
              item-text="info.name"
            ></v-select>
            <TagsEditor v-model="item.tags" :source="tags" required />
            <v-divider></v-divider>
            <sc-record-audit :audit="item.audit" />
          </v-form>
        </v-card-text>
        <v-card-actions v-if="$store.getters['session/testPowerUser']">
          <v-btn text @click="d_confirm=true" color="primary">
            <i18n path="button.delete" />
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="save" color="primary">
            <i18n path="button.save" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <sc-confirm-dialog
      v-model="d_confirm"
      :mode="dmode"
      @click:ok="remove"
    >{{$t("dialog.txt.delete")}}</sc-confirm-dialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

const store_module = "keys";
const DEF_ITEM = {};

export default {
  name: "Users",
  mixins: [commonmixin],
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
      item: { ...DEF_ITEM },
      d_edit: false,
      filter: {},
      headers: [
        {
          text: this.$t("fields.keyid"),
          value: "keyid",
        },
        {
          text: this.$t("fields.name"),
          value: "name",
        },
        {
          text: this.$t("fields.club"),
          value: "sportclub",
        },
        {
          text: this.$t("fields.tags"),
          value: "tags",
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
      this.item = this.$api.copy(i, DEF_ITEM);
      this.d_edit = true;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      if (this.item.tags.length == 0) return;
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        this.d_edit = false;
      });
    },
    remove() {
      this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
        this.d_edit = false;
      });
    },
  },
  mounted() {
    if (this.$store.getters["session/testPowerUser"]) {
      this.headers = [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
        ...this.headers,
      ];
    }
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    if (!this.$store.getters["clubs/isItems"]) {
      this.$store.dispatch("clubs/LOAD");
    }
  },
};
</script>

<style>
</style>