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
        <v-btn icon @click="edit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.info.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:item.time="{ item }">
        <span>{{item.settings | timeOfWork}}</span>
      </template>
      <template v-slot:footer.prepend>
        <v-btn fab @click="edit(null)" dark class="pink my-1">
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="d_edit" persistent width="800" @keydown.escape="d_edit=false">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <sc-dialog-title object="club" :item="item" />
          <v-spacer></v-spacer>
          <v-btn @click="d_edit=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="item.info.name"
                  :label="$t('fields.name')"
                  :rules="[v=>!!v||$t('error.required')]"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="item.info.status"
                  :items="$t('statuses')"
                  :label="$t('fields.status')"
                ></v-select>
              </v-col>
            </v-row>
            <v-select
              v-model="item.services"
              :items="$store.getters['services/items']"
              item-value="idx"
              item-text="info.name"
              chips
              multiple
              menu-props="closeOnContentClick"
              deletable-chips
              append-outer-icon="mdi-check-all"
              @click:append-outer="selall"
            ></v-select>
            <v-row>
              <v-col cols="6">
                <v-menu
                  v-if="item.settings"
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="item.settings.timeon"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.settings.timeon"
                      :label="$t('fields.clubstart')"
                      prepend-icon="mdi-clock-time-four-outline"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu1"
                    v-model="item.settings.timeon"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menu1.save(item.settings.timeon)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-if="item.settings"
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="item.settings.timeoff"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.settings.timeoff"
                      :label="$t('fields.clubstop')"
                      prepend-icon="mdi-clock-time-four-outline"
                      v-bind="attrs"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="item.settings.timeoff"
                    format="24hr"
                    full-width
                    @click:minute="$refs.menu2.save(item.settings.timeoff)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-textarea
              v-model="item.info.description"
              :label="$t('fields.description')"
              :rows="2"
              auto-grow
            ></v-textarea>
            <TagsEditor v-model="item.info.tags" />
            <sc-record-audit :audit="item.audit" />
          </v-form>
        </v-card-text>
        <v-card-actions>
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
const store_module = "clubs";
const DEF_ITEM = {
  info: { status: "OK", tags: [] },
  services: [],
  settings: {},
};

export default {
  name: "Clubs",
  mixins: [commonmixin],
  computed: {
    records() {
      return this.$store.getters[store_module + "/items"];
    },
    tags() {
      return this.$store.getters[store_module + "/tags"];
    },
  },
  filters: {
    timeOfWork(v) {
      if (!v) return "";
      return (v.timeon ? v.timeon : "") + " - " + (v.timeoff ? v.timeoff : "");
    },
  },
  data() {
    return {
      menu1: false,
      menu2: false,
      item: { ...DEF_ITEM },
      d_edit: false,
      filter: { tag: "" },
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
          text: this.$t("fields.time"),
          value: "time",
          align: "center",
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
      this.item = this.$api.copy(i, DEF_ITEM);
      this.d_edit = true;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        if (this.$store.getters["session/scidx"] == this.item.idx) {
          this.$store.dispatch("session/REFRESHCLUB");
        }
        this.d_edit = false;
      });
    },
    remove() {
      this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
        if (this.$store.getters["session/scidx"] == this.item.idx)
          this.$store.dispatch("session/LOGOUT");
        this.d_edit = false;
      });
    },
    selall() {
      try {
        this.$set(this.item, "services", []);
        console.log(this.item.services);
        if (this.item.services.length == 0) {
          this.$store.getters["services/items"].forEach((e) => {
            this.item.services.push(e.idx);
          });
          console.log(this.item.services);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
  },
};
</script>

<style>
</style>