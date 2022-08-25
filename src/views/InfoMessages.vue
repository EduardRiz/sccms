<template>
  <v-sheet class="sc-page-sheet">
    <v-row align="center" align-content="center">
      <i18n
        :path="'menu.'+$route.name.toLowerCase()"
        class="ml-4 primary--text text-uppercase text-h4"
      ></i18n>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
      </v-col>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
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
      <template v-slot:item.msgtype="{ item }">
        <span>{{item.msgtype | msgtype($t("msgs.types"))}}</span>
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
          <sc-dialog-title object="imsgs" :item="item" />
          <v-spacer></v-spacer>
          <v-btn @click="d_edit=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="item.msgtitle"
                  :label="$t('msgs.title')"
                  :rules="[v=>!!v||$t('error.required')]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select v-model="item.msgtype" :label="$t('msgs.type')" :items="$t('msgs.types')"></v-select>
              </v-col>
              <v-col cols="12">
                <v-radio-group v-model="item.showmode" mandatory row :hint="$t('msgs.showmode')" persistent-hint>
                  <v-radio value="n"  :label="$t('msgs.pnoone')" />
                  <v-radio value="h"  :label="$t('msgs.phome')" />
                  <v-radio value="l" :label="$t('msgs.plogin')" />
                  <v-radio value="lh"  :label="$t('msgs.ploginhome')" />
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.msgtext"
                  :label="$t('msgs.text')"
                  :rules="[v=>!!v||$t('error.required')]"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <sc-info-message :item="item" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <sc-datetime-picker
                  v-model="item.from_date"
                  :title="$t('fields.fromDate')"
                  :error="errorPeriodMessage"
                />
              </v-col>
              <v-col cols="6">
                <sc-datetime-picker
                  v-model="item.to_date"
                  :title="$t('fields.toDate')"
                  :error="errorPeriodMessage"
                />
              </v-col>
            </v-row>
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
    <sc-confirm-dialog
      v-model="d_confirm"
      :mode="dmode"
      @click:ok="remove"
    >{{$t("dialog.txt.delete")}}</sc-confirm-dialog>
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";

export default {
  name: "InfoMessages",
  mixins: [commonmixin],
  components: {
    "sc-datetime-picker": () =>
      import("@/components/controls/DateTimePicker.vue"),
    "sc-info-message": () => import("@/components/controls/InfoMessage.vue"),
  },
  filters: {
    msgtype: (i, types) => {
      try {
        const item = types.find((it) => it.value == i);
        return item.text;
      } catch (error) {
        const item = types.find((it) => it.value == "info");
        return item.text;
      }
    },
  },
  computed: {},
  data() {
    return {
      item: {},
      errorPeriodMessage: null,
      d_edit: false,
      headers: [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 70,
          sortable: false,
        },
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("msgs.title"),
          value: "msgtitle",
        },
        {
          text: this.$t("msgs.text"),
          value: "msgtext",
        },
        {
          text: this.$t("msgs.type"),
          value: "msgtype",
        },
        {
          text: this.$t("fields.fromDate"),
          value: "from_date",
        },
        {
          text: this.$t("fields.toDate"),
          value: "to_date",
        },
      ],
    };
  },
  methods: {
    edit(i) {
      this.errorPeriodMessage = null;
      this.item = { ...i };
      this.d_edit = true;
    },
    save() {
      this.errorPeriodMessage = null;
      if (!this.$refs.form.validate()) return;
      const from = this.$moment(this.item.from_date);
      const to = this.$moment(this.item.to_date);
      if (!from.isBefore(to)) {
        this.errorPeriodMessage = this.$t("msgs.periodErr");
        return;
      }
      this.$api.saveInfoMessage(this.item).then((r) => {
        const i = this.items.findIndex((i) => i.idx == r.idx);
        if (i != -1) this.items.splice(i, 1, r);
        else this.items.push(r);
        this.d_edit = false;
      });
    },
    remove() {
      this.$api.deleteInfoMessage(this.item.idx).then((r) => {
        if (r) {
          const i = this.items.findIndex((i) => i.idx == this.item.idx);
          if (i != -1) this.items.splice(i, 1);
        }
        this.d_edit = false;
      });
    },
  },
  mounted() {
    this.$api.loadInfoMessages().then((r) => (this.items = [...r]));
  },
};
</script>

<style>
</style>