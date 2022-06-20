<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <i18n
        :path="'menu.'+$route.name.toLowerCase()"
        class="ml-4 primary--text text-uppercase text-h4"
      ></i18n>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-switch :label="$t('label.freekey')" v-model="freeonly"></v-switch>
      </v-col>
      <v-col cols="2">
        <v-select v-model="filter.tag" :items="tags" :label="$t('fields.tags')" clearable></v-select>
      </v-col>
      <v-col cols="2">
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
      <template v-slot:item.visit="{ item }">
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-avatar v-if="item.visit" v-on="on" v-bind="attrs">
              <v-img alt="Avatar" :src="$api.publicImgLink(item.visit.img, true)" lazy-src="/img/default-avatar.jpg" />
            </v-avatar>
          </template>
          <span v-if="item.visit">{{item.visit.display_name+" , "+item.visit.card}}</span>
        </v-tooltip>
      </template>
      <template v-slot:footer.prepend>
        <v-btn
          fab
          @click="edit(null)"
          dark
          class="pink my-1"
          v-if="$store.getters['session/testPowerUser']"
        >
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
            <v-text-field
              v-model="item.name_"
              :label="$t('fields.name')"
              :rules="[v=>!!v||$t('error.required')]"
            ></v-text-field>
            <v-select
              v-model="item.sportclub"
              :items="$store.getters['clubs/items']"
              :label="$t('fields.club')"
              :rules="[v=>!!v||$t('error.required')]"
              item-value="idx"
              item-text="info.name"
            ></v-select>
            <TagsEditor v-model="item.tags" :source="tags" required />
            <v-divider></v-divider>
            <sc-record-audit :audit="item" />
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
const DEF_ITEM = { tags: [] };

export default {
  name: "BoxKeys",
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
      freeonly: true,
      filter: {},
      headers: [
        {
          text: this.$t("fields.keyid"),
          value: "keyid",
        },
        {
          text: this.$t("fields.name"),
          value: "name_",
        },
        {
          text: this.$t("fields.tags"),
          sortable: false,
          value: "tags",
          filter: (value) => {
            if (!this.filter.tag) return true;
            return value && value.indexOf(this.filter.tag) != -1;
          },
        },
        {
          text: this.$t("fields.client"),
          value: "visit",
          sortable: false,
          width: "100px",
          filter: (value) => {
            if (!this.freeonly) return true;
            return value==null;
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
      if (!this.item.tags || this.item.tags.length == 0) return;
      this.item.keyid = this.item.keyid.replace(/(?:\r\n|\r|\n)/g,"")
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

  beforeDestroy() {
    this.$root.$off("app-event/hid");
  },

  mounted() {
    this.freeonly = this.$route.path == '/keys/free'
    try {
      this.$root.$on("app-event/hid", (e) => {
        //console.log(this.$store.getters["session/testWsid"](e.detail.wsid))
        if (!this.$store.getters["session/testWsid"](e.detail.wsid)) return;
        if (!this.d_edit) return;
        this.$set(this.item, "keyid", e.detail.data);
      });
    } catch (error) {
      console.log(error);
    }

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