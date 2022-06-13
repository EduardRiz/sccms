<template>
  <v-dialog v-model="isActive" persistent width="90%">
    <v-card color="yellow lighten-5">
      <v-card-title>
        <i18n path="dialogs.clients_purchases" />
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          item-key="idx"
          sort-desc
          sort-by="created"
          class="transparent table-custom"
        >
          <template #item.price="{ item }">
            <span>{{item.price | currency}}</span>
          </template>
          <template #item.action="{ item }">
            <v-tooltip bottom>
              <template #activator="{on, attrs}">
                <v-btn
                  icon
                  v-if="!item.usedat && item.sportclub==$store.getters['session/scidx'] && $moment().isSameOrBefore(item.to_date, 'date')"
                  color="error"
                  v-on="on"
                  v-bind="attrs"
                  @click.stop="reversal(item)"
                >
                  <v-icon>mdi-cart-remove</v-icon>
                </v-btn>
              </template>
              <i18n path="tt.reversal" />
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ClientPurchasesDialog",
  props: {
    client: Number,
    value: Boolean,
  },
  data() {
    return {
      items: [],
      headers: [
        {
          text: this.$t("fields.created"),
          value: "created",
        },
        {
          text: this.$t("fields.saletype"),
          value: "ttype",
        },
        {
          text: this.$t("fields.tariff"),
          value: "tariff",
        },
        {
          text: this.$t("fields.sale"),
          value: "sale",
        },
        {
          text: this.$t("fields.lastvisit"),
          value: "usedat",
        },
        {
          text: this.$t("fields.valid"),
          value: "to_date",
        },
        {
          text: this.$t("fields.price"),
          align: "right",
          value: "price",
        },
        {
          text: this.$t("fields.action"),
          value: "action",
        },
      ],
    };
  },
  computed: {
    isActive() {
      return this.value;
    },
  },
  watch: {
    value(v) {
      if (v) this.loadClientPurchases(this.client);
    },
  },
  methods: {
    reversal(item) {
      this.$api.reversalSale(item.idx).then((r) => {
        if (r) {
          const ind = this.items.indexOf(item);
          if (ind != -1) this.items.splice(ind, 1);
          this.$emit("onreversal", { sale: item });
        }
      });
    },
    loadClientPurchases(c) {
      this.$api.loadClientPurchases(c).then((r) => (this.items = [...r]));
    },
  },
  mounted() {},
};
</script>

<style>
</style>