<template>
  <v-sheet class="sc-page-sheet">
    <v-row>
      <v-spacer></v-spacer>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-tabs v-model="tab" align-with-title>
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="item in items" :key="item">
        <i18n :path="'dict.'+item" />
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="times">
        <v-row align="center" align-content="center">
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" clearable></v-text-field>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="records"
          :search="search"
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
          <template v-slot:item.days="{ item }">
            <span v-if="item.details">
              <v-chip v-for="i in item.details.days" :key="i">{{$t("week")[i-1].text}}</v-chip>
            </span>
          </template>
          <template v-slot:item.hours="{ item }">
            <span v-if="item.details">{{item.details.hours | time_interval}}</span>
          </template>
          <!-- <template v-slot:body.append>
            <div class="add-button-div">
              <v-btn fab absolute bottom @click="edit(null)" dark class="pink">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>-->
          <template v-slot:footer.prepend>
            <div v-if="$store.getters['session/testPowerUser']">
              <v-btn fab @click="edit(null)" color="pink my-1">
                <v-icon color="white">mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item key="tags">
        <div class="py-4 pl-16">
          <v-chip v-for="tag in tags" :key="tag.idx" class="mx-2">
            <v-icon left @click="editTag(tag)" color="primary" v-if="$store.getters['session/testPowerUser']">mdi-pencil</v-icon>
            <span>{{tag.name}}</span>
            <span v-if="tag.details" class="ml-4">{{tag.details.name}}</span>
            <v-icon right @click="(item={...tag},d_confirm=true)" color="error" v-if="$store.getters['session/testPowerUser']">mdi-delete</v-icon>
          </v-chip>
        </div>
        <div class="mb-4 ml-4">
          <v-btn fab @click="editTag(null)" dark class="pink" v-if="$store.getters['session/testPowerUser']">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="d_edit" persistent width="1200" @keydown.escape="d_edit=false">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <i18n path="dialogs.time">
            <template #idx>{{item.idx}}</template>
          </i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_edit = false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="item.name"
              :label="$t('fields.name')"
              :rules="[v=>!!v||$t('error.required')]"
            ></v-text-field>
            <sc-time-editor v-model="item.details.hours" />
            <v-select
              v-model="item.details.days"
              :label="$t('fields.days')"
              :items="$t('week')"
              multiple
              chips
              clearable
              deletable-chips
              :rules="[v=>!!v||$t('error.required')]"
            ></v-select>
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
    <v-dialog v-model="d_editTag" persistent width="400">
      <v-card color="yellow lighten-5">
        <v-card-title>
          <i18n path="dialogs.tag">
            <template #idx>{{item.idx}}</template>
          </i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_editTag = false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="formTag" lazy-validation>
            <v-text-field
              v-model="item.name"
              :label="$t('fields.name')"
              :rules="[v=>!!v||$t('error.required')]"
            ></v-text-field>
            <v-textarea v-model="item.details.name" :label="$t('fields.description')"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="d_confirm=true" color="primary">
            <i18n path="button.delete" />
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="saveTag" color="primary">
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
import TimeEditor from "@/components/TimeEditor.vue";
import commonmixin from "@/mixins/commonlist.js";
const store_module = "dicts";

export default {
  name: "Dictionaries",
  components: {
    "sc-time-editor": TimeEditor,
  },
  mixins: [commonmixin],
  computed: {
    records() {
      return this.$store.getters[store_module + "/times"];
    },
    tags() {
      return this.$store.getters[store_module + "/tags"];
    },
  },
  data() {
    return {
      tab: null,
      items: ["times", "tags"],
      d_edit: false,
      d_editTag: false,
      headers: [
        {
          text: this.$t("fields.name"),
          value: "name",
        },
        {
          text: this.$t("fields.days"),
          value: "days",
        },
        {
          text: this.$t("fields.hours"),
          value: "hours",
        },
      ],
      item: { details: {} },
    };
  },
  methods: {
    editTag(t) {
      if (!t) t = { details: {}, type: "tags" };
      this.item = { ...t };
      this.d_editTag = true;
    },
    defrec() {
      let def = {
        details: { days: [1, 2, 3, 4, 5, 6, 7], hours: [] },
      };
      for (let k = 0; k < 25; k++) {
        def.details.hours[k] = 0;
      }
      return def;
    },
    edit(i) {
      this.item = this.$api.copy(i, this.defrec());
      this.d_edit = true;
    },
    save() {
      if (!this.$refs.form.validate()) return;
      try {
        if (this.item.details.hours.indexOf(1) == -1) return;
        this.item.type = "times";
        this.item.details.days.sort();
      } catch (error) {
        console.log(error);
        return;
      }
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        this.d_edit = false;
      });
    },
    saveTag() {
      if (!this.$refs.formTag.validate()) return;
      this.$store.dispatch(store_module + "/SAVE", this.item).then(() => {
        this.d_editTag = false;
      });
    },
    remove() {
      if (this.item.idx == undefined) return;
      this.$store.dispatch(store_module + "/DELETE", this.item.idx).then(() => {
        this.d_edit = false;
        this.d_editTag = false;
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
    if (!this.$store.getters["dicts/isItems"]) {
      this.$store.dispatch("dicts/LOAD");
    }
    //    this.init();
  },
};
</script>

<style>
</style>