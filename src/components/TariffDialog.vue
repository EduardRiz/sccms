<template>
  <v-dialog v-model="isActive" persistent fullscreen>
    <v-card color="yellow lighten-5">
      <v-card-title>
        <i18n path="dialogs.tariff">
          <template #idx>{{item_.idx?item_.idx:$t("dialogs.newrec")}}</template>
        </i18n>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input', false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-4">
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="item_.info.name"
                :label="$t('fields.name')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="item_.type"
                :items="$t('tariff_types')"
                :rules="[v=>!!v||$t('error.required')]"
                :label="$t('fields.tariff_type')"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="item_.info.status"
                :items="$t('statuses')"
                :label="$t('fields.status')"
              ></v-select>
            </v-col>
          </v-row>
          <v-textarea
            v-model="item_.info.description"
            :label="$t('fields.description')"
            :rows="2"
            auto-grow
          ></v-textarea>
          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="item_.price"
                type="number"
                clearable
                prefix="€"
                :label="$t('fields.price')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="d-flex">
              <v-select
                v-model="item_.duration.type"
                :items="$t('duration_types')"
                :rules="[v=>!!v||$t('error.required')]"
                :label="$t('fields.duration_type')"
                class="mr-4"
              ></v-select>
              <v-text-field
                v-model="item_.duration.value"
                min="1"
                type="number"
                clearable
                :label="$t('fields.duration')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="item_.time"
                :items="$store.getters['dicts/times']"
                return-object
                item-value="idx"
                item-text="name"
                :rules="[v=>!!v||$t('error.required')]"
                :label="$t('fields.time')"
                @change="setTime"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="item_.time">
            <v-col>
              <i18n path="fields.days" class="subtitle-2" />
              <div>
                <sc-week-days :days="item_.time.days" large />
              </div>
            </v-col>
            <v-col>
              <i18n path="fields.hours" class="subtitle-2" />
              <div class="text-h6 green--text">{{item_.time.hours | time_interval}}</div>
            </v-col>
          </v-row>
          <TagsEditor v-model="item_.info.tags" />
          <sc-record-audit :audit="item_.audit" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="d_confirm=true" color="primary" v-if="item_.idx">
          <i18n path="button.delete" />
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="save" color="primary">
          <i18n path="button.save" />
        </v-btn>
      </v-card-actions>
    </v-card>
    <sc-confirm-dialog v-model="d_confirm" @click:ok="remove">{{$t("dialog.txt.delete")}}</sc-confirm-dialog>
  </v-dialog>
</template>

<script>
import WeekForTime from "@/components/WeekForTime.vue";
const store_module = "tariffs";
const DEF_ITEM = {
  info: { status: "OK" },
  type: "ABONEMENT",
  duration: {
    type: "m",
    value: 1,
  },
};

export default {
  name: "tariff-dialog",
  props: {
    value: Boolean,
    item: Object,
  },
  components: { "sc-week-days": WeekForTime },
  data() {
    return {
      d_confirm: false,
      item_: { ...DEF_ITEM },
    };
  },
  computed: {
    isActive() {
      return this.value;
    },
  },
  watch: {
    item(v) {
      console.log("watch", this.item, v);
      this.item_ = v ? { ...this.item } : { ...DEF_ITEM };
      //console.log("watch", this.item_);
    },
  },
  methods: {
    setTime() {
      this.item_.time = {
        ...this.item_.time.details,
        idx: this.item_.time.idx,
      };
    },
    save() {
      if (!this.$refs.form.validate()) return;

      this.$store
        .dispatch(store_module + "/SAVE", this.item_)
        .then((response) => {
          this.$emit("save", response);
          this.$emit("input", false);
        });
    },
    remove() {
      this.$store
        .dispatch(store_module + "/DELETE", this.item_.idx)
        .then(() => {
          this.$emit("input", false);
        })
        .finally(() => {
          this.$emit("remove");
        });
    },
  },
};
</script>

<style scoped>
</style>