<template>
  <v-sheet class="sc-page-sheet">
    <v-row class="my-2">
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          clearable
          @keydown.enter="loadData"
          @keydown.escape="loadData(1)"
          @click:append="loadData"
          @click:clear="loadData(1)"
        ></v-text-field>
      </v-col>
      <v-btn icon class="error ma-4" dark to="/">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="idx"
      class="transparent table-custom"
      :footer-props="foot_props"
      :no-data-text="$t('label.nodata')"
      :options.sync="pagination"
      :page.sync="currentPage"
      :server-items-length="totalItems"
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="showServs(item)">
          <v-icon color="primary">{{$t("icons.services")}}</v-icon>
        </v-btn>
        <v-btn icon :to="`/?c=${item.card}`" v-if="item.card">
          <v-icon color="success">mdi-play</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar v-if="item.img">
          <v-img alt="Avatar" :src="$api.publicImgLink(item.img)" />
        </v-avatar>
      </template>
      <!-- <template v-slot:item.display_name="{ item }">{{item.display_name}}</template> -->
      <template v-slot:item.frozen="{ item }">
        <v-chip
          v-if="item.profile && item.profile.frozenfrom"
          color="primary"
          dark
        >{{item.profile.frozenfrom}}</v-chip>
      </template>
      <template v-slot:item.status="{ item }">
        <sc-record-status :status="item.status" :statusi="item.statusi" />
      </template>
      <template v-slot:footer.prepend>
        <v-btn fab @click="edit(null)" dark class="pink my-1">
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <sc-client-dialog v-model="d_edit" :item="item" @save="onsave" @remove="onremove" />
    <sc-client-services-dialog v-model="d_clservs" :items="services" canProlong />
  </v-sheet>
</template>

<script>
import commonmixin from "@/mixins/commonlist.js";
import ClientDialog from "@/components/dialogs/ClientDialog";
import ClientServicesDialog from "@/components/dialogs/ClientServicesDialog";

export default {
  name: "Clients",
  mixins: [commonmixin],
  components: {
    "sc-client-dialog": ClientDialog,
    "sc-client-services-dialog": ClientServicesDialog,
  },
  data() {
    return {
      item: null,
      blocked: false,
      d_edit: false,
      services: [],
      d_clservs: false,
      headers: [
        {
          text: this.$t("fields.action"),
          value: "action",
          width: 170,
          sortable: false,
        },
        {
          text: this.$t("fields.avatar"),
          value: "image",
          sortable: false,
        },
        {
          text: this.$t("fields.name"),
          value: "name",
        },
        {
          text: this.$t("fields.card"),
          value: "card",
        },
        {
          text: this.$t("fields.phone"),
          value: "phone",
        },
        {
          text: this.$t("fields.email"),
          value: "email",
        },
        {
          text: this.$t("fields.frozen"),
          value: "frozen",
          sortable: false,
        },
        {
          text: this.$t("fields.lastvisit"),
          value: "lastvisit",
        },
        {
          text: this.$t("fields.activeservs"),
          value: "activeservices",
        },
        {
          text: this.$t("fields.status"),
          value: "status",
          sortable: false,
        },
      ],
    };
  },
  watch: {},
  methods: {
    onsave(ni) {
      const i = this.items.indexOf(this.item);
      if (i != -1) this.items.splice(i, 1, ni);
      else this.items.push(ni);
      this.d_edit = false;
    },
    onremove(di) {
      const i = this.items.findIndex((e) => e.idx == di);
      if (i != -1) this.items.splice(i, 1);
      this.d_edit = false;
    },
    showServs(i) {
      this.services = [];
      this.$api.apiGetRequest("cms/clserv/client/" + i.idx).then((response) => {
        this.services = [...response];
      });
      this.d_clservs = true;
    },
    edit(i) {
      this.item = i;
      this.d_edit = true;
    },
    /* called from mixins on watch pagination */
    loadData(q) {
      if (q == 1) this.search = null;
      this.$api
        .apiGetRequest("cms/clients/ext", {
          search: this.search,
          page: this.pagination.page - 1,
          size: this.pagination.itemsPerPage,
          sort: this.sortByParam("idx"),
        })
        .then((response) => {
          this.items = [...response.content];
          this.totalItems = response.totalElements;
        });
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>