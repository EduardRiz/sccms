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
      <template v-slot:item.fromDate="{ item }">
        <span>{{item.fromDate | dt-only}}</span>
      </template>
      <template v-slot:item.toDate="{ item }">
        <span>{{item.toDate | dt-only}}</span>
      </template>
      <template v-slot:item.price="{ item }">
        <span>{{(item.tariff.price*100) | currency}}</span>
      </template>
      <template v-slot:item.client="{ item }">
        <sc-record-info :idx="item.client" store="clients/item" prop="name"/>
      </template>
    </v-data-table>
    <!-- <v-dialog v-model="d_edit" persistent width="500">
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
    <ConfirmDialog v-model="d_confirm" :mode="dmode" @click:ok="remove">{{$t("dialog.txt.delete")}}</ConfirmDialog> -->
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
const store_module = "soldabonements";

export default {
  name: "SoldAbonements",
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
      // item: { info: {} },
      // d_edit: false,
      filter: {},
      headers: [
        {
          text: this.$t("fields.created"),
          value: "audit.created",
        },
        {
          text: this.$t("fields.client"),
          value: "client",
        },
        {
          text: this.$t("fields.abonement"),
          value: "abonement.info.name",
        },
        {
          text: this.$t("fields.tariff"),
          value: "tariff.info.name",
        },
        {
          text: this.$t("fields.price"),
          value: "price",
        },
        {
          text: this.$t("fields.fromDate"),
          value: "fromDate",
        },
        {
          text: this.$t("fields.toDate"),
          value: "toDate",
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
    // edit(i) {
    //   this.item = { ...i };
    //   this.d_edit = true;
    // },
    // save() {
    //   if (this.item.info.tags && this.item.info.tags.length)
    //     this.item.tagsStr = this.item.info.tags.join(",");
    //   this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
    //     this.updateTags();
    //     this.d_edit = false;
    //   });
    // },
    // remove() {
    //   this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
    //     this.updateTags();
    //     this.d_edit = false;
    //   });
    // },
  },
  mounted() {
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
    if (!this.$store.getters["clients/isItems"]) {
      this.$store.dispatch("clients/LOAD");
    }
  },
};
</script>

<style>
</style>