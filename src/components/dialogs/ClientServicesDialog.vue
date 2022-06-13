<template>
  <v-dialog v-model="isActive" persistent width="90%">
    <v-card color="yellow lighten-5">
      <v-card-title>
        <i18n path="dialogs.clientsservices" />
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items_"
          item-key="idx"
          class="transparent table-custom"
          :footer-props="foot_props"
          :no-data-text="$t('label.nodata')"
        >
          <template #item.created="{ item }">
            <span v-if="item">{{item.created | dt-time}}</span>
          </template>
          <template #item.workout="{ item }">
            <v-icon>{{item.workout?"mdi-check":""}}</v-icon>
          </template>
          <template #item.service="{ item }">
            <sc-record-info v-if="item" :idx="item.service" store="services/item" />
          </template>
          <template #item.scalar="{ item }">
            <v-icon>{{item.scalar?"mdi-check":""}}</v-icon>
          </template>
          <template #item.visitcontrol="{ item }">
            <span v-if="item.visitcontrol">{{item.remainvisits}}</span>
          </template>
          <template #item.scalar="{ item }">
            <span v-if="item.scalar">{{item.remainscalar}}</span>
          </template>
          <template #item.days="{ item }">
            <sc-week-days
              v-if="item.time"
              :days="item.time.days"
              :class="'ml-n1 '+(item.testcode==2?'red--text':'')"
            />
          </template>
          <template #item.time="{ item }">
            <span>{{item.time.hours | time_interval}}</span>
          </template>
          <template #item.fromDate="{ item }">{{item.fromDate | dt-only}}</template>
          <template #item.testcode="{ item }">
            <ServiceTestField :item="item" />
          </template>
          <template #item.toDate="{ item }">
            <span>{{item.toDate | dt-only}}</span>
            <v-btn v-if="isCanProlog" icon color="primary" @click.stop="openProlong(item)">
              <v-icon>mdi-calendar-end</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="d_prolong" persistent width="400">
      <v-card class="yellow lighten-5">
        <v-card-title>
          <i18n path="dialogs.prolongt">
            <template #client v-if="item">{{item.name}}</template>
          </i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_prolong=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-center">
          <div>
            <i18n path="dialogs.prolong" />
          </div>
          <v-date-picker v-model="prolongto" :min="$moment().format('YYYY-MM-DD')"></v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="startProlong" color="primary" :disabled="!prolongto">
            <v-icon class="mr-2">mdi-check</v-icon>
            <i18n path="button.prolong" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import ServiceTestField from "@/components/controls/ServiceTestField";

export default {
  name: "ClientServicesList",
  components: { ServiceTestField },
  props: {
    items: Array,
    value: Boolean,
    canProlong: { type: Boolean, default: false },
  },
  data() {
    return {
      item: null,
      blocked: false,
      prolongto: null,
      d_edit: false,
      d_prolong: false,
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.service"),
          value: "service",
        },
        {
          text: this.$t("fields.aworkout"),
          value: "workout",
        },
        {
          text: this.$t("fields.ascalar"),
          value: "scalar",
        },
        {
          text: this.$t("fields.visitcontrol"),
          value: "visitcontrol",
        },
        {
          text: this.$t("fields.days"),
          value: "days",
        },
        {
          text: this.$t("fields.time"),
          value: "time",
        },
        {
          text: this.$t("fields.fromDate"),
          value: "fromdate",
        },
        {
          text: this.$t("fields.toDate"),
          value: "todate",
        },
        {
          text: this.$t("fields.status"),
          value: "testcode",
          sortable: false,
        },
      ],
      foot_props: {
        itemsPerPageOptions: [10, 14, 20, 50, 100], // -> Add this example
        showFirstLastPage: true,
        firstIcon: "mdi-arrow-collapse-left",
        lastIcon: "mdi-arrow-collapse-right",
        prevIcon: "mdi-less-than",
        nextIcon: "mdi-greater-than",
        itemsPerPageText: this.$t("label.rowPerPage"),
      },
    };
  },
  computed: {
    isCanProlog() {
      try {
        return this.canProlong;
      } catch (error) {
        return false;
      }
    },
    isActive() {
      return this.value;
    },
    items_() {
      return this.items;
    },
  },
  methods: {
    openProlong(i) {
      this.item = { ...i };
      this.prolongto = this.item.toDate.split(" ")[0];
      this.d_prolong = true;
    },
    startProlong() {
      if (!this.prolongto) return;
      if (this.prolongto == this.min) {
        this.d_prolong = false;
        return false;
      }
      this.$api
        .apiPostRequest("cms/clserv/prolong/" + this.item.idx, {
          data: this.prolongto,
        })
        .then((response) => {
          if (response) {
            const i = this.items.findIndex((e) => e.idx == this.item.idx);
            console.log(i);
            if (i != -1) {
              this.items.splice(i, 1, { ...response });
            }
          }
          this.d_prolong = false;
        });
    },
  },
  mounted() {
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
  },
};
</script>

<style>
</style>