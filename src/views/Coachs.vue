<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <v-switch v-model="blocked" :label="$t('label.blocked')" class="ml-3"></v-switch>
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
      :items-per-page.sync="itemPerPage"
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
      <template v-slot:item.info.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:footer.prepend>
        <v-btn
          fab
          @click="edit(null)"
          dark
          class="pink my-1"
          v-if="$store.getters['session/testPowerUser']"
        >
          <v-icon color="white">mdi-account-plus</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="d_edit" persistent width="1200" @keydown.escape="d_edit=false">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <sc-dialog-title object="coach" :item="item" icon="coachs" />
          <v-spacer></v-spacer>
          <v-btn @click="d_edit=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-subheader>
                <i18n path="fields.profile" />
              </v-subheader>
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
                <TagsEditor v-model="item.info.tags" :source="tags" />
                <sc-record-audit :audit="item.audit" />
              </v-form>
              <v-row v-if="$store.getters['session/testPowerUser']">
                <v-btn text @click="d_confirm=true" color="error">
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
              </v-row>
            </v-col>
            <v-col cols="7">
              <LinkedWorkouts :items="workouts" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <sc-confirm-dialog
      v-model="d_confirm"
      mode="delete"
      @click:ok="remove"
    >{{$t("dialog.txt.delete")}}</sc-confirm-dialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import LinkedWorkouts from "@/components/LinkedWorkouts.vue";

const store_module = "coachs";
const DEF_ITEM = {
  info: { status: "OK" },
};

export default {
  name: "Coachs",
  mixins: [commonmixin],
  components: { LinkedWorkouts },
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
      blocked: false,
      workouts: [],
      filter: {},
      headers: [
        {
          text: this.$t("fields.name"),
          value: "info.name",
        },
        {
          text: this.$t("fields.description"),
          value: "info.description",
        },
        {
          text: this.$t("fields.status"),
          value: "info.status",
          filter: (value) => {
            return this.blocked ? value != "OK" : value == "OK";
          },
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
    clone() {
      this.$delete(this.item, "idx");
    },
    edit(i) {
      this.item = this.$api.copy(i, DEF_ITEM);
      this.workouts = [];
      if (this.item.idx) {
        this.$api
          .apiGetRequest("/cms/workouts/coach/" + this.item.idx)
          .then((response) => {
            this.workouts = response;
          });
      }
      this.d_edit = true;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        this.d_edit = false;
      });
    },
    remove() {
      // this.item.info.status = "BLOCKED";
      // this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
      //   this.$api
      //     .apiPostRequest("/cms/workouts/block/coach/" + this.item.idx)
      //     .then((response) => {
      //       this.d_edit = false;
      //     });
      // });
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
  },
};
</script>

<style>
</style>