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
      <template v-slot:item.info.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:item.services="{ item }">
        <sc-services-list :item="item" />
      </template>
      <template v-slot:body.append>
        <div class="add-button-div">
          <v-btn fab absolute bottom @click="edit(null)" dark class="pink">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="d_edit" persistent fullscreen>
      <v-card color="yellow lighten-5">
        <v-card-title>
          <sc-dialog-title object="abonement" :item="item" />
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
            <v-textarea
              v-model="item.info.description"
              :label="$t('fields.description')"
              :rows="2"
              auto-grow
            ></v-textarea>
            <v-divider></v-divider>
            <v-row class="my-2">
              <v-col cols="12">
                <i18n path="fields.services" />
                <v-card class="orange lighten-5">
                  <v-card-title>
                    <v-select
                      v-model="item.services"
                      :items="$store.getters['services/items']"
                      item-value="idx"
                      item-text="info.name"
                      chips
                      multiple
                      deletable-chips
                      menu-props="closeOnContentClick"
                      @change="addService"
                    ></v-select>
                  </v-card-title>
                  <v-card-text>
                    <table>
                      <tr v-for="serv in item.services" :key="serv">
                        <td>
                          <sc-record-info class="text-h6 mr-6" :idx="serv" store="services/item" />
                        </td>
                        <ServiceSettings :item="item" :idx="serv" />
                      </tr>
                    </table>
                  </v-card-text>
                  <v-card-actions></v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12">
                <i18n path="fields.tariffs" />
                <v-data-table :items="tariffs" :headers="tariffs_hdrs" class="orange lighten-5">
                  <template v-slot:item.price="{ item }">{{item.price*100 | currency}}</template>
                  <template v-slot:item.days="{ item }">
                    <sc-week-days v-if="item.time" :days="item.time.days" />
                  </template>
                  <template v-slot:item.duration="{ item }">
                    <span>{{item.duration | duration_filter}}</span>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <sc-record-status v-if="item.info" :status="item.info.status" />
                  </template>
                  <template v-slot:item.hours="{ item }">
                    <span v-if="item.time">{{item.time.hours | time_interval}}</span>
                  </template>
                  <template v-slot:body.append>
                    <div class="add-button-div">
                      <v-btn fab absolute bottom @click="d_editTariff=true" dark class="pink">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <TagsEditor v-model="item.info.tags" class="mt-10" />
            <sc-record-audit :audit="item.audit" />"
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="d_confirm=true" color="primary" v-if="item.idx">
            <i18n path="button.delete" />
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="save" color="primary">
            <i18n path="button.save" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDialog v-model="d_confirm" :mode="dmode" @click:ok="remove">{{$t("dialog.txt.delete")}}</ConfirmDialog>
    <v-dialog v-model="d_editTariff" fullscreen>
      <v-card class="orange lighten-5">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="d_editTariff=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <TariffTable :sels="tariffs" isSelectable @onSave="updateTariffs" type="ABONEMENT" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import ServiceSettings from "@/components/ServiceSettings.vue";
import TariffTable from "@/components/TariffsTable.vue";
const store_module = "abonements";
const DEF = { info: { status: "OK" }, tariffs: [], settings: {} };

export default {
  name: "Abonements",
  mixins: [commonmixin],
  components: {
    TariffTable,
    ServiceSettings,
  },
  computed: {
    records() {
      return this.$store.getters[store_module + "/items"];
    },
    tags() {
      return this.$store.getters[store_module + "/tags"];
    },
    tariffs() {
      try {
        let a = [];
        this.item.tariffs.forEach((idx) => {
          a.push(this.$store.getters["tariffs/item"](idx));
        });
        return a;
      } catch (error) {
        return [];
      }
    },
  },
  data() {
    return {
      // servs: [],
      // servsett: {},
      item: { ...DEF },
      d_edit: false,
      d_editTariff: false,
      filter: {},
      tariffs_hdrs: [
        {
          text: this.$t("fields.name"),
          value: "info.name",
        },
        {
          text: this.$t("fields.days"),
          value: "days",
        },
        {
          text: this.$t("fields.hours"),
          value: "hours",
        },
        {
          text: this.$t("fields.duration"),
          value: "duration",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
        },
        {
          text: this.$t("fields.tags"),
          value: "tags",
        },
        {
          text: this.$t("fields.status"),
          value: "status",
        },
      ],
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
          text: this.$t("fields.description"),
          value: "info.description",
        },
        {
          text: this.$t("fields.services"),
          value: "services",
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
    updateTariffs(a) {
      if (!this.item.tariffs) this.item.tariffs = [];
      this.item.tariffs = [...a];
      this.d_editTariff = false;
    },
    edit(i) {
      this.item = this.$api.copy(i, DEF);
      this.d_edit = true;
    },
    addService() {
      //      console.log(a, this.item.services);
      if (!this.item.settings) this.$set(this.item, "settings", {});
      this.item.services.forEach((e) => {
        const serv = this.$store.getters["services/item"](e);
        let servsett = {};
        if (serv.params && serv.params.isscalar)
          servsett = { visits: true, vcount: 30, scalar: true };
        this.$set(this.item.settings, "s" + e, servsett);
      });
    },
    save() {
      if (!this.$refs.form.validate()) return;
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
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
    if (!this.$store.getters["tariffs/isItems"]) {
      this.$store.dispatch("tariffs/LOAD");
    }
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
  },
};
</script>

<style>
</style>