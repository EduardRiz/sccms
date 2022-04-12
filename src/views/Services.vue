<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <v-spacer></v-spacer>
      <v-col cols="2">
        <v-switch v-model="showMyClub" :label="$t('label.myclub')"></v-switch>
      </v-col>
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
      :items-per-page.sync="itemPerPage"
      item-key="idx"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)" v-if="$store.getters['session/testPowerUser']">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.workout="{ item }">
        <v-icon>{{item.workout?"mdi-check":""}}</v-icon>
      </template>
      <template v-slot:item.scalar="{ item }">
        <v-icon>{{item.scalar?"mdi-check":""}}</v-icon>
      </template>
      <template v-slot:item.timed="{ item }">
        <v-icon>{{item.timed?"mdi-check":""}}</v-icon>
      </template>
      <template v-slot:item.info.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:item.idx="{item}">
        <span>{{item.idx}}</span>
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
    <v-dialog v-model="d_edit" persistent fullscreen @keydown.escape="d_edit=false">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <sc-dialog-title object="service" :item="item" icon="services" />
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
                  :rules="[$rules.required]"
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
              <v-checkbox :label="$t('fields.aworkout')" v-model="item.workout"></v-checkbox>
              <!-- <v-checkbox :label="$t('fields.ascalar')" v-model="item.scalar" class="ml-4"></v-checkbox> -->
              <v-radio-group
                row
                class="ml-4"
                :hint="$t('servs.hint')"
                persistent-hint
                v-model="servtype"
                :label="$t('servs.label')"
              >
                <v-radio value="normal" :label="$t('servs.normal')"></v-radio>
                <v-radio value="scalar" :label="$t('servs.scalar')"></v-radio>
                <v-radio value="timed" :label="$t('servs.timed')"></v-radio>
              </v-radio-group>
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

            <TagsEditor v-model="item.info.tags" class="mt-10" :source="tags" />
            <sc-record-audit :audit="item.audit" />
          </v-form>
          <v-row>
            <v-col>
              <v-select
                multiple
                :items="clubs"
                v-model="clubs2add"
                :label="$t('label.clubs2add')"
                menu-props="offsetY,closeOnContentClick"
                chips
                item-text="info.name"
                item-value="idx"
                deletable-chips
                @change="wasChangedClubs=true"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-if="$store.getters['session/testPowerUser']">
          <v-btn text @click="d_confirm=true" color="error" v-if="item.idx">
            <v-icon class="mr-1">mdi-delete</v-icon>
            <i18n path="button.delete" />
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="clone" color="primary">
            <v-icon class="mr-1">mdi-content-copy</v-icon>
            <i18n path="button.clone" />
          </v-btn>
          <v-btn text @click="save" color="success">
            <v-icon class="mr-1">mdi-content-save</v-icon>
            <i18n path="button.save" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="d_editTariff" fullscreen @keydown.escape="d_editTariff=false">
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
    <sc-confirm-dialog
      v-model="d_confirm"
      :mode="dmode"
      @click:ok="remove"
    >{{$t("dialog.txt.delete")}}</sc-confirm-dialog>
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
    servtype: {
      get() {
        try {
          if (this.item.scalar) return "scalar";
          if (this.item.timed) return "timed";
          return "normal";
        } catch (error) {
          return "normal";
        }
      },
      set(v) {
        try {
          this.item.scalar = v == "scalar";
          this.item.timed = v == "timed";
        } catch (error) {
          console.log(error);
        }
      },
    },
    records() {
      if (this.showMyClub) {
        return this.$store.getters[store_module + "/list"](
          this.$store.getters["session/services"]
        );
      }
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
    clubs() {
      return this.$store.getters["clubs/items"];
    },
  },
  data() {
    return {
      showMyClub: true,
      wasChangedClubs: false,
      clubs2add: [this.$store.getters["session/scidx"]],
      item: DEF,
      d_edit: false,
      d_editTariff: false,
      sortBy: "idx",
      sortDesc: true,
      filter: {},
      headers: [
        {
          text: "#",
          value: "idx",
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
          text: this.$t("fields.aworkout"),
          value: "workout",
        },
        {
          text: this.$t("fields.atimed"),
          value: "timed",
        },
        {
          text: this.$t("fields.ascalar"),
          value: "scalar",
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
  watch: {
    item: {
      handler(v) {
        this.wasChangedClubs = true;
        if (v.idx) {
          this.wasChangedClubs = false;
          this.clubs2add = this.clubs.filter((e) => {
            //console.log(v.idx, e.services, e.services.indexOf(v.idx));
            return e.services.indexOf(v.idx) != -1;
          });
        } else {
          this.clubs2add = [this.$store.getters["session/scidx"]];
        }
      },
      deep: true,
    },
  },
  methods: {
    clone() {
      this.$delete(this.item, "idx");
    },
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
      if (!this.$refs.form.validate()) return;
      if (this.wasChangedClubs) this.item.clubs = this.clubs2add;
      this.$store
        .dispatch(store_module + "/SAVE", {
          item: this.item,
          isChanged: this.wasChangedClubs,
          vm: this,
        })
        .then(() => {
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
    if (!this.$store.getters["tariffs/isItems"]) {
      this.$store.dispatch("tariffs/LOAD");
    }
    if (!this.$store.getters["clubs/isItems"]) {
      this.$store.dispatch("clubs/LOAD");
    }
  },
};
</script>

<style>
</style>