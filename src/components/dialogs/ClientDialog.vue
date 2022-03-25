<template>
  <v-dialog v-model="isActive" persistent width="1024" @keydown.escape="close">
    <v-card color="yellow lighten-5">
      <v-card-title>
        <sc-dialog-title object="client" :item="item" icon="client" />
        <v-spacer></v-spacer>
        <v-btn @click="close" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-4">
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="4" class="camera-container">
              <v-btn
                absolute
                fab
                icon
                @click="startStream"
                :class="(isCameraActive?'pink':'blue')+' mt-n6 ml-2'"
                dark
              >
                <v-icon>{{isCameraActive?"mdi-stop":"mdi-webcam"}}</v-icon>
              </v-btn>
              <v-btn
                absolute
                right
                fab
                @click="captureImage"
                class="mt-n6 mr-2"
                v-if="isCameraActive"
              >
                <v-icon>{{isCapturedImage?"mdi-restore":"mdi-camera"}}</v-icon>
              </v-btn>
              <web-cam
                v-show="isCameraActive && !isCapturedImage"
                class="webcam-class"
                ref="webcam"
                :device-id="deviceId"
                width="100%"
                height="272"
                @started="isCameraActive=true"
                @stopped="isCameraActive=false"
                @error="onError"
                @cameras="onCameras"
                @camera-change="onCameraChange"
              />
              <v-img
                v-if="isCameraActive && isCapturedImage"
                :src="img"
                height="272"
                width="364"
                eager
              ></v-img>
              <v-img
                v-if="!isCameraActive"
                :src="$api.publicImgLink(item_.img, true)"
                height="272"
                width="364"
                eager
              ></v-img>
            </v-col>
            <v-col cols="8">
              <v-row>
                <v-col cols="5">
                  <v-text-field
                    v-model="item_.name"
                    :label="$t('fields.name')"
                    :rules="[$rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="item_.card" :label="$t('fields.card')"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="item_.status"
                    :items="$t('statuses')"
                    :label="$t('fields.status')"
                    :rules="[$rules.required]"
                    menu-props="offsetY"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <VuePhoneNumberInput
                    ref="phedit"
                    v-model="item_.phone"
                    size="lg"
                    default-country-code="LV"
                    :preferred-countries="['LV','EE','LT']"
                    required
                    :error="isPhoneError"
                    clearable
                    class="mt-4"
                    :border-radius="10"
                    :translations="{countrySelectorLabel: $t('phone.country'),  countrySelectorError: $t('phone.error'),  phoneNumberLabel: $t('phone.number'),  example: $t('phone.example')}"
                    @update="isPhoneError=false"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="item_.email"
                    :label="$t('fields.email')"
                    :rules="[$rules.email]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="item_.profile.address" :label="$t('fields.address')"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-if="isFrozen">
                  <i18n path="dialogs.frozen" class="text-h6 primary--text">
                    <template #date>{{item_.profile.frozenfrom}}</template>
                  </i18n>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <sc-record-audit :audit="item_.audit" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="d_confirm=true" color="primary">
          <v-icon color="error" class="mr-2">mdi-cancel</v-icon>
          <i18n path="button.block" />
        </v-btn>
        <v-btn v-if="!isFrozen" text @click="d_freeze=true" color="primary">
          <v-icon class="mr-2">mdi-snowflake</v-icon>
          <i18n path="button.freeze" />
        </v-btn>
        <v-btn v-else text @click="unfreeze" color="primary">
          <v-icon class="mr-2">mdi-snowflake-off</v-icon>
          <i18n path="button.unfreeze" />
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="save" color="primary">
          <v-icon color="success" class="mr-2">mdi-content-save</v-icon>
          <i18n path="button.save" />
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="d_freeze" persistent width="400">
      <v-card class="yellow lighten-5">
        <v-card-title>
          <i18n path="dialogs.freeze">
            <template #client v-if="item">{{item.name}}</template>
          </i18n>
          <v-spacer></v-spacer>
          <v-btn @click="d_freeze=false" icon color="error">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-center">
          <div>
            <i18n path="dialogs.freezefrom" />
          </div>
          <v-date-picker v-model="frozenfrom" :min="$moment().format('YYYY-MM-DD')"></v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="freeze" color="primary" :disabled="!frozenfrom">
            <v-icon class="mr-2">mdi-snowflake</v-icon>
            <i18n path="button.freeze" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <sc-confirm-dialog
      v-model="d_confirm"
      @click:ok="remove"
      mode="block"
    >{{$t("dialog.txt.block")}}</sc-confirm-dialog>
  </v-dialog>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import { WebCam } from "vue-web-cam";
const DEF = { status: "OK", profile: {} };

export default {
  name: "client-dialog",
  components: { WebCam, VuePhoneNumberInput },
  props: {
    value: Boolean,
    closeFrozen: {
      type: Boolean,
      default: false,
    },
    item: Object,
  },
  data() {
    return {
      img: null,
      isCapturedImage: false,
      isCameraActive: false,
      camera: null,
      devices: [],
      deviceId: null,
      d_confirm: false,
      d_freeze: false,
      frozenfrom: this.$moment().format("YYYY-MM-DD"),
      item_: DEF,
      phone: null,
      isPhoneError: false,
    };
  },
  computed: {
    isFrozen() {
      try {
        return this.item_.profile.frozenfrom != null;
      } catch (error) {
        return false;
      }
    },
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
    tags() {
      return this.$store.getters["clients/tags"];
    },
    isActive: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    value() {
      this.item_ = this.$api.copy(this.item, DEF);
      if (!this.item_.profile) this.item_.profile = {};
      if (!this.item_.name) this.item_.name = this.item.display_name;
      if (!this.item_.audit) {
        this.item_.audit = {
          created: this.item.created,
          updated: this.item.updated,
        };
      }
      if (this.item_.statusi) {
        try {
          this.item_.status = this.$t("statuses")[this.item_.statusi - 1].value;
        } catch (error) {
          this.item_.status = this.$t("statuses")[2].value;
        }
      }
      if (this.item_.profile.frozenfrom) {
        this.frozenfrom = this.item_.profile.frozenfrom;
      } else {
        this.frozenfrom = this.$moment().format("YYYY-MM-DD");
      }
      this.allowExistsCard = false;
      this.img = null;
      this.isExistsCard = false;
      this.d_confirm = false;
    },
    camera: function (id) {
      this.deviceId = id;
    },
    devices: function () {
      // if (this.devices.length == 1) {
      //   this.camera = this.devices[0].deviceId;
      //   this.deviceId = this.devices[0].deviceId;
      // }
    },
  },
  methods: {
    unfreeze() {
      if (!this.isFrozen) return;
      this.$api
        .apiPostRequest("cms/clients/unfreeze/" + this.item.idx)
        .then((response) => {
          this.$emit("save", response);
          if (this.closeFrozen) this.close();
        });
    },
    freeze() {
      if (!this.item_.profile) this.$set(this.item_, "profile", {});
      if (this.frozenfrom) {
        this.$set(this.item_.profile, "frozenfrom", this.frozenfrom);
      } else {
        this.$delete(this.item_.profile, "frozenfrom");
      }
      this.save();
      this.d_freeze = false;
    },
    startStream() {
      if (this.isCameraActive) {
        this.onStop();
      } else {
        this.isCapturedImage = false;
        if (this.deviceId) this.onStart();
        else if (this.devices.length != 0) {
          this.deviceId = this.devices[0].deviceId;
        }
      }
    },
    captureImage() {
      if (!this.isCapturedImage) {
        this.img = this.$refs.webcam.capture();
      }
      this.isCapturedImage = !this.isCapturedImage;
    },
    close() {
      this.img = null;
      this.onStop();
      this.$emit("input", false);
    },
    save() {
      if (!this.$refs.form.validate()) return;
      const ph = this.$refs.phedit;
      if (this.phone != null && !ph.isValid) {
        this.isPhoneError = true;
        return;
      } else {
        this.item_.phone = ph.results.formattedNumber;
      }
      const rec = this.item_;
      if (this.img) rec.imgsrc = this.img;
      this.$api.apiPostRequest("cms/clients", rec).then((response) => {
        this.$emit("save", response);
        if (this.closeFrozen) this.close();
      });
    },
    remove() {
      this.item_.status = "BLOCKED";
      this.$api.apiPostRequest("cms/clients", this.item_).then((response) => {
        this.$emit("save", response);
        this.close();
      });
    },
    onStarted() {
      this.isCameraActive = true;
    },
    onStopped() {
      this.isCameraActive = false;
    },
    onStop() {
      if (this.isCameraActive) this.$refs.webcam.stop();
    },
    onStart() {
      if (!this.isCameraActive) this.$refs.webcam.start();
    },
    onError(error) {
      console.log("Camera error:", error);
    },
    onCameras(cameras) {
      this.devices = [...cameras];
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
    },
  },
  beforeDestroy() {
    this.$root.$off("app-event/hid");
//    console.log("event off")
  },
  mounted() {
    try {
      this.$root.$on("app-event/hid", (e) => {
        if (!this.$store.getters["session/testWsid"](e.detail.wsid)) return;
        //this.$set(this.item, "card", e.detail.data);
        this.$set(this.item_, "card", e.detail.data);
        //console.log(e.detail.data);
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.camera-container {
  position: relative;
}
</style>