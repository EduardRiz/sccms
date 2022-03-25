<template>
  <v-dialog v-model="isActive" width="800" id="maindlg-1">
    <v-card class="teal lighten-5">
      <v-card-title>
        <i18n path="dialogs.buyAbonement"></i18n>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input',false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-select
            v-model="abonement2buy"
            prepend-icon="mdi-table-multiple"
            :label="$t('fields.abonement')"
            :placeholder="$t('fields.abonement')"
            :items="$store.getters['abonements/tariffed']"
            return-object
            item-value="idx"
            item-text="info.name"
            menu-props="offsetY"
            @change="onNewAbonement"
          >
            <template #item="{item}">
              <div>
                <div class="text-h6">{{item.info.name}}</div>
                <sc-services-list :item="item" />
              </div>
            </template>
          </v-select>
        </v-row>
        <v-row v-if="abonement2buy">
          <v-select
            v-model="tariff2buy"
            prepend-icon="mdi-grid"
            :label="$t('fields.tariff')"
            :placeholder="$t('fields.tariff')"
            :items="$store.getters['tariffs/list'](abonement2buy.tariffs)"
            return-object
            item-value="idx"
            item-text="info.name"
            menu-props="offsetY"
          >
            <template #item="{item}">
              <TariffInfo :tariff="item" />
            </template>
          </v-select>
        </v-row>
        <v-row v-if="tariff2buy">
          <TariffInfo :tariff="tariff2buy" />
        </v-row>
        <v-row v-if="tariff2buy">
          <v-col cols="6">
            <AskDateDialog v-model="date2buy" />
          </v-col>
          <v-col align-self="center" class="text-right" cols="6">
            <i18n path="home.to" class="text-h6">
              <template #date>{{$api.toDate(date2buy, tariff2buy)|dt-time}}</template>
            </i18n>
          </v-col>
        </v-row>
        <v-row v-if="tariff2buy">
          <v-select
            v-model="tags2buy"
            :label="$t('fields.buytag')"
            :placeholder="$t('fields.buytag')"
            :items="$store.getters['dicts/tags']"
            item-value="name"
            multiple
            chips
            deletable-chips
            item-text="name"
            menu-props="offsetY"
          >
            <template #item="{item}">
              <span>{{item.name}}</span>
              <span v-if="item.details" class="ml-4">{{item.details.name}}</span>
            </template>
          </v-select>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="buyAbonement"
          v-if="date2buy&&tariff2buy&&abonement2buy"
          color="success"
          class="rounded-pill elevation-10"
        >
          <i18n path="button.buy" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TariffInfo from "@/components/TariffInfo";
import AskDateDialog from "@/components/dialogs/AskDateDialog";

export default {
  name: "DialogBuyAbonement",
  components: { TariffInfo, AskDateDialog },
  props: {
    value: Boolean,
    client: Number,
  },
  data() {
    return {
      tariff2buy: null,
      tags2buy: null,
      abonement2buy: null,
      date2buy: null,
    };
  },
  computed: {
    isActive: {
      get(){
      return this.value;
      },
      set(v){
        this.$emit("input", v);
      }
    },
  },
  watch: {
    value(v) {
      this.date2buy = this.$moment();
      this.tags2buy = null;
      this.tariff2buy = null;
      this.abonement2buy = null;
      if (v) {
        this.$store.dispatch("abonements/LOAD");
        this.$store.dispatch("tariffs/LOAD");
        this.$store.dispatch("dicts/LOAD");
      }
    },
  },
  methods: {
    onNewAbonement() {
      this.date2buy = this.$moment();
      this.tags2buy = null;
      this.tariff2buy = null;
    },
    buyAbonement() {
      this.$api
        .addAbonement2client({
          client: this.client,
          abonement: this.abonement2buy,
          tariff: this.tariff2buy,
          start: this.date2buy.valueOf(),
          tags: this.tags2buy,
        })
        .then((response) => {
          this.$emit("onbuy", response);
        })
        .finally(() => {
          this.$emit("input", false);
        });
    },
  },
  mounted() {
    // const elem = document.getElementById("maindlg-1");
    // console.log(elem);
    // elem.addEventListener("keydown", (e, k) => {
    //   console.log("event", e, k);
    // },true);
  },
};
</script>

<style>
</style>