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
      :items-per-page.sync="itemPerPage"
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
      <template v-slot:item.isworkout="{ item }">
        <v-icon>{{item.params.isworkout?"mdi-check":""}}</v-icon>
      </template>
      <template v-slot:item.isscalar="{ item }">
        <v-icon>{{item.params.isscalar?"mdi-check":""}}</v-icon>
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
    <v-dialog v-model="d_edit" persistent fullscreen>
      <v-card color="yellow lighten-5">
        <v-card-title>
          <sc-dialog-title object="service" :item="item" />
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
            <v-row class="ml-0">
              <v-checkbox :label="$t('fields.isWorkout')" v-model="item.params.isworkout"></v-checkbox>
              <v-checkbox
                :label="$t('fields.isScalar')"
                v-model="item.params.isscalar"
                class="ml-4"
              ></v-checkbox>
            </v-row>
            <v-row>
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

            <TagsEditor v-model="item.info.tags" class="mt-10" />
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
    <v-dialog v-model="d_editTariff" fullscreen>
      <v-card class="orange lighten-5">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="d_editTariff=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <TariffTable :sels="tariffs" isSelectable @onSave="updateTariffs" type="SERVICE" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <ConfirmDialog v-model="d_confirm" :mode="dmode" @click:ok="remove">{{$t("dialog.txt.delete")}}</ConfirmDialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import TariffTable from "@/components/TariffsTable.vue";

const store_module = "services";
const DEF = { info: { status: "OK" }, params: {}, tariffs: [] };

export default {
  name: "Services",
  mixins: [commonmixin],
  components: {
    TariffTable,
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
        //console.log(a)
        return a;
      } catch (error) {
        //console.log(error)
        return [];
      }
    },
  },
  data() {
    return {
      item: DEF,
      d_edit: false,
      d_editTariff: false,
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
          text: this.$t("fields.description"),
          value: "info.description",
        },
        {
          text: this.$t("fields.isWorkout"),
          value: "isworkout",
        },
        {
          text: this.$t("fields.isScalar"),
          value: "isscalar",
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
    save() {
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
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    if (!this.$store.getters["tariffs/isItems"]) {
      this.$store.dispatch("tariffs/LOAD");
    }
  },
};
</script>

<style>
</style>