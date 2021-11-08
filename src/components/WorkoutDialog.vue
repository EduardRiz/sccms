<template>
  <v-dialog v-model="isActive" persistent width="1024">
    <v-card color="yellow lighten-5">
      <v-card-title>
        <sc-dialog-title object="workout" :item="item" />
        <v-spacer></v-spacer>
        <v-btn @click="$emit('input',false)" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="item.info.name"
                :label="$t('fields.name')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="item.info.status"
                :items="$t('statuses')"
                :label="$t('fields.status')"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="item.settings.color"
                :items="$store.getters['sysvars/colors']"
                :label="$t('fields.color')"
              >
                <template #item="{item}">
                  <div :style="{'background-color':item,width:'100%',height:'20px'}"></div>
                </template>
                <template #selection="{item}">
                  <div :style="{'background-color':item,width:'100%',height:'20px'}"></div>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-select
                v-model="item.service"
                :label="$t('fields.service')"
                :items="$store.getters['services/items']"
                item-text="info.name"
                item-value="idx"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="item.coach"
                :label="$t('fields.coach')"
                :items="$store.getters['coachs/items']"
                item-text="info.name"
                item-value="idx"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="item.room"
                :label="$t('fields.room')"
                :items="$store.getters['rooms/items']"
                item-text="info.name"
                item-value="idx"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-switch v-model="item.settings.fix" :label="$t('fields.wofix')"></v-switch>
            </v-col>
            <v-col cols="3" v-if="item.settings.fix">
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="item.settings.date"
                    :label="$t('fields.wodate')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="item.settings.date" @input="menu1 = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" v-if="!item.settings.fix">
              <v-select
                v-model="item.settings.days"
                :label="$t('fields.wodays')"
                :items="$t('week')"
                clearable
                :rules="[v=>!!v||$t('error.required')]"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="item.settings.time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="item.settings.time"
                    :label="$t('fields.wotime')"
                    prepend-icon="mdi-clock-time-four-outline"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="item.settings.time"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu.save(item.settings.time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                v-model="item.settings.duration"
                :label="$t('fields.woduration')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-textarea
            v-model="item.info.description"
            :label="$t('fields.description')"
            :rows="2"
            auto-grow
          ></v-textarea>
          <TagsEditor v-model="item.info.tags" />
          <sc-record-audit :audit="item.audit" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="d_confirm=true" color="error" v-if="item.idx">
          <i18n path="button.delete" />
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="clone" color="primary">
          <i18n path="button.clone" />
        </v-btn>
        <v-btn text @click="save" color="success">
          <i18n path="button.save" />
        </v-btn>
      </v-card-actions>
    </v-card>
    <ConfirmDialog v-model="d_confirm" @click:ok="remove">{{$t("dialog.txt.delete")}}</ConfirmDialog>
  </v-dialog>
</template>

<script>
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const store_module = "workouts";
const DEF = { info: { status: "OK" }, settings: {} };

export default {
  name: "workout-dialog",
  components: {
    ConfirmDialog,
  },
  props: {
    value: Boolean,
    record: Object,
  },
  data() {
    return {
      menu2: false,
      menu1: false,
      item: { ...DEF },
      d_confirm: false,
    };
  },
  watch: {
    record: {
      handler(v) {
        this.item = this.record ? JSON.parse(JSON.stringify(v)) : { ...DEF };
        if (!this.item.settings.color)
          this.item.settings.color = this.$store.getters["sysvars/nextcolor"]();
      },
      deep: true,
    },
  },
  computed: {
    isActive() {
      return this.value;
    },
  },
  methods: {
    clone() {
      this.$delete(this.item, "idx");
    },
    save() {
      if (!this.$refs.form.validate()) return;
      this.$store
        .dispatch(store_module + "/SAVE", this.item)
        .then(() => {
          this.$emit("input", false);
        })
        .finally(() => {
          this.$emit("update");
        });
    },
    remove() {
      this.$store
        .dispatch(store_module + "/DELETE", this.item.idx)
        .then(() => {
          this.$emit("input", false);
        })
        .finally(() => {
          this.$emit("update");
        });
    },
  },

  mounted() {
    if (!this.$store.getters["coachs/isItems"]) {
      this.$store.dispatch("coachs/LOAD");
    }
    if (!this.$store.getters["sysvars/isColors"]) {
      this.$store.dispatch("sysvars/LOAD_COLORS");
    }
    if (!this.$store.getters["rooms/isItems"]) {
      this.$store.dispatch("rooms/LOAD");
    }
    if (!this.$store.getters["services/isItems"]) {
      this.$store.dispatch("services/LOAD");
    }
    if (!this.$store.getters[store_module + "/isItems"]) {
      this.$store.dispatch(store_module + "/LOAD");
    }
  },
};
</script>

<style>
</style>