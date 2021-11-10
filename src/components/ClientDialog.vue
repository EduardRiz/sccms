<template>
  <v-dialog v-model="isActive" persistent width="800">
    <v-card color="yellow lighten-5">
      <v-card-title>
        <sc-dialog-title object="client" :item="item" />
        <v-spacer></v-spacer>
        <v-btn @click="close" icon color="error">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-4">
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="6" class="camera-container">
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
            <v-col cols="6">
              <v-text-field
                v-model="item_.info.name"
                :label="$t('fields.name')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-text-field>
              <v-select
                v-model="item_.info.status"
                :items="$t('statuses')"
                :label="$t('fields.status')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-select>
              <v-text-field
                v-model="item_.card"
                :label="$t('fields.card')"
                :rules="[v=>!!v||$t('error.required')]"
              ></v-text-field>
              <v-checkbox
                error
                v-model="allowExistsCard"
                v-if="isExistsCard"
                class="orange-text"
                :label="$t('fields.cardExists')"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8"></v-col>
            <v-col cols="4"></v-col>
          </v-row>
          <v-textarea
            v-model="item_.info.description"
            :label="$t('fields.description')"
            :rows="2"
            auto-grow
          ></v-textarea>
          <TagsEditor v-model="item_.info.tags" />
          <sc-record-audit :audit="item_.audit" />
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
    <sc-confirm-dialog v-model="d_confirm" @click:ok="remove">{{$t("dialog.txt.delete")}}</sc-confirm-dialog>
  </v-dialog>
</template>

<script>
import { WebCam } from "vue-web-cam";
const store_module = "clients";
const DEF = { info: { status: "OK" } };

export default {
  name: "client-dialog",
  components: { WebCam },
  props: {
    value: Boolean,
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
      allowExistsCard: false,
      isExistsCard: false,
      item_: DEF,
    };
  },
  computed: {
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
    // item_() {
    //   if (!this.item) return { info: { status: "OK" } };
    //   if (!this.item.info) return { info: { status: "OK" } };
    //   return this.item;
    // },
    isActive() {
      return this.value;
    },
  },
  watch: {
    value() {
      this.item_ = this.$api.copy(this.item, DEF);
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
      this.isExistsCard = this.$store.getters["clients/testCard"](
        this.item_.card
      );
      if (this.isExistsCard && !this.allowExistsCard) return;
      const rec = this.item_;
      if (this.img) rec.img = this.img;
      this.$store.dispatch(store_module + "/SAVE", rec).then((response) => {
        this.$emit("save", response);
        this.close();
      });
    },
    remove() {
      this.$store
        .dispatch(store_module + "/DELETE", this.item.idx)
        .then(() => {
          this.$emit("input", false);
        })
        .finally(() => {
          this.$emit("remove");
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
};
</script>

<style scoped>
.camera-container {
  position: relative;
}
</style>