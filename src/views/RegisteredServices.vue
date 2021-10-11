<template>
  <v-sheet class="fill-height ma-2 idcs-fill-width">
    <v-row align="center" align-content="center">
      <i18n path="menu.regservs" class="ml-4 text-h6" />
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-select v-model="filter.tag" :items="userTags" :label="$t('fields.tags')" clearable></v-select>
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
      <template v-slot:item.status="{ item }">
        <sc-record-status :status="item.info.status" />
      </template>
      <template v-slot:item.client="{ item }">
        <sc-record-info v-model="item.client" store="clients/item" prop="name" />
      </template>
      <template v-slot:item.abonement="{ item }">
        <sc-record-info v-model="item.abonement" store="soldabonements/item" prop="name" />
      </template>
      <template v-slot:body.append>
        <div class="add-button-div">
          <v-btn fab absolute bottom @click="edit({})" dark class="pink">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="d_edit" persistent width="500">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <i18n path="dialogs.client">
            <template #idx>{{item.idx}}</template>
          </i18n>
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
                  v-model="item.info.statusCode"
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
            <TagsEditor v-model="item.info.tags" />
          </v-form>
          <sc-record-audit :audit="item.audit" />
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
    <ConfirmDialog v-model="d_confirm" :mode="dmode" @click:ok="remove">{{$t("dialog.txt.delete")}}</ConfirmDialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
const store_module = "regservices";

export default {
  name: "RegisteredServices",
  mixins: [commonmixin],
  computed: {
    records() {
      return this.$store.getters[store_module + "/items"];
    },
    userTags() {
      if (!this.tags.length) this.updateTags();
      return this.tags;
    },
  },
  data() {
    return {
      item: { info: {} },
      tags: [],
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
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.abonement"),
          value: "abonement",
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
    updateTags() {
      try {
        this.records.forEach((e) => {
          if (e.info.tags) {
            this.tags = this.tags.concat(e.info.tags);
          }
        });
      } catch (error) {
        console.log(error);
      }
      this.tags = this.tags.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    },
    edit(i) {
      this.item = { ...i };
      this.d_edit = true;
    },
    save() {
      if (this.item.info.tags && this.item.info.tags.length)
        this.item.tagsStr = this.item.info.tags.join(",");
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        this.updateTags();
        this.d_edit = false;
      });
    },
    remove() {
      this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
        this.updateTags();
        this.d_edit = false;
      });
    },
  },
  mounted() {
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    if (!this.$store.getters["clients/isItems"]) {
      this.$store.dispatch("clients/LOAD");
    }
    if (!this.$store.getters["soldabonements/isItems"]) {
      this.$store.dispatch("soldabonements/LOAD");
    }
  },
};
</script>

<style>
</style>