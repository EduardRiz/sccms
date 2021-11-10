<template>
  <nav>
    <v-navigation-drawer
      v-if="$store.getters['session/isLogged']"
      v-model="drawer"
      class="teal lighten-5"
      width="320"
      disable-resize-watcher
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="display-2">mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <div class="subtitle-2">{{$store.getters['session/username']}}</div>
            <div>{{$store.getters['session/name']}}</div>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mb-5"></v-divider>
        <v-list-item-group>
          <template>
            <template v-for="(item,k) in upperMenu">
              <template
                v-if="!item.side && !item.divider && !item.menu && $api.testRoles(item.role)"
              >
                <v-list-item link :key="item.text" class="hidden-lg-and-up" :to="item.route">
                  <v-list-item-icon>
                    <v-icon>{{item.icon}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{$t('menu.'+item.text)}}</v-list-item-content>
                </v-list-item>
              </template>
              <template v-else-if="item.divider">
                <v-divider :key="k"></v-divider>
              </template>
              <template v-if="item.side && $api.testRoles(item.role)">
                <v-list-item link :key="item.text" :to="item.route">
                  <v-list-item-icon>
                    <v-icon>{{$t('icons.'+item.text)}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{$t('menu.'+item.text)}}</v-list-item-content>
                </v-list-item>
              </template>
            </template>
          </template>
          <v-list-item @click="logoff">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{$t('menu.logout')}}</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider class="mb-5"></v-divider>
      <SelectLocale />
    </v-navigation-drawer>

    <v-app-bar v-if="$store.getters['session/isLogged']" app dark class="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <i18n path="title" class="hidden-sm-only"></i18n>
      </v-toolbar-title>-->
      <v-toolbar-title v-if="$route.name" class="ml-4">
        <span>{{$store.getters['session/scname']}}</span>
        <i18n :path="'menu.'+$route.name.toLowerCase()" class="ml-4"></i18n>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-for="item in upperMenu">
        <template v-if="item.menu && $api.testRoles(item.role)">
          <v-menu v-model="item.fmenu" offset-y :key="item.text">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text>
                <v-icon class="mr-1">{{$t('icons.'+item.text)}}</v-icon>
                <i18n :path="'menu.'+item.text" />
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <template v-for="(subitem, index) in item.menu">
                <v-list-item
                  v-if="$api.testRoles(subitem.role)"
                  :key="index"
                  link
                  :to="subitem.route"
                >
                  <v-list-item-icon>
                    <v-icon>{{$t('icons.'+subitem.text)}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{$t('menu.'+subitem.text)}}</v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </template>
        <template v-else-if="!item.side && !item.divider && $store.getters['user/role']">
          <v-btn
            text
            class="ml-2 hidden-md-and-down"
            :key="item.text"
            :to="item.route"
            active-class="link-active"
          >
            <v-icon class="mr-3">{{ item.icon }}</v-icon>
            {{$t('menu.'+item.text)}}
          </v-btn>
        </template>
        <template
          v-else-if="!item.side && !item.divider && ($store.getters['user/role']==item.role)"
        >
          <v-btn
            text
            class="ml-2 hidden-md-and-down"
            :key="item.text"
            :to="item.route"
            active-class="link-active"
          >
            <v-icon class="mr-3" v-text="$t('icon.'+item.text)"></v-icon>
            {{$t('menu.'+item.text)}}
          </v-btn>
        </template>
        <template v-if="item.divider">
          <v-divider vertical :key="item.text"></v-divider>
        </template>
      </template>
      <v-btn icon to="/" class="ml-2">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>
  </nav>
</template>
<script>
import SelectLocale from "@/components/Select-locale";

export default {
  components: { SelectLocale },
  name: "AppHeader",
  data() {
    return {
      drawer: false,
      upperMenu: this.$api.upper_menu,
    };
  },
  computed: {},
  mounted() {
    this.$root.$on("SetHeaderTitle", (arg1) => {
      console.log(arg1);
    });
  },

  methods: {
    async logoff() {
      await this.$store.dispatch("session/LOGOUT");
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
</style>
