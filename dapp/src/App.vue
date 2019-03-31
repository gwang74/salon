<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>

    <v-footer dark height="auto">
      <v-card class="flex" flat tile>
        <v-card-title class="teal justify-center">
          <strong class="subheading">安徽区块链技术学习沙龙</strong>
        </v-card-title>

        <v-card-actions class="grey darken-3 justify-center">&copy;2019 —
          <strong>AHBC SALON</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  }
};
</script>

