<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2">
      <v-spacer></v-spacer>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="idx"
      sort-by="created"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="d_edit" persistent width="800" @keydown.escape="d_edit=false">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <i18n path="dialogs.ws">
            <template #wsid>{{item.wsid}}</template>
          </i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_edit=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="item.alias" :label="$t('fields.name')"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="item.autocard" :label="$t('fields.card')"></v-text-field>
              </v-col>
            </v-row>
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
const apiBase = "cms/workstations";

export default {
  name: "Workstations",
  mixins: [commonmixin],
  computed: {},
  data() {
    return {
      item: {},
      d_edit: false,
      headers: [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
        {
          text: this.$t("fields.wsid"),
          value: "wsid",
        },
        {
          text: this.$t("fields.name"),
          value: "alias",
        },
        {
          text: this.$t("fields.card"),
          value: "autocard",
        },
        {
          text: this.$t("fields.valid"),
          value: "valid",
        },
        {
          text: this.$t("fields.mac"),
          value: "mac",
        },
        {
          text: this.$t("fields.license"),
          value: "license",
        },
        {
          text: this.$t("fields.created"),
          value: "created",
        },
      ],
    };
  },
  methods: {
    edit(i) {
      this.item = i ? { ...i } : {};
      this.d_edit = true;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      this.$api.apiPostRequest(apiBase, this.item).then((r) => {
        const index = this.items.findIndex(e => e.wsid == r.wsid);
        if (index == -1) {
            this.items.items.push({
                ...r
            });
        } else {
            Object.assign(this.items[index], r);
        }
        this.d_edit = false;
      });
    },
    remove() {
      this.$api.deleteRequest(apiBase, this.item.wsid).then(() => {
        this.d_edit = false;
      });
    },
  },
  mounted() {
    this.$api.apiGetRequest(apiBase).then((response) => {
      this.items = [...response].sort();
    });
  },
};
</script>

<style>
</style>