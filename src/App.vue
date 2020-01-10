<template>
  <v-app>
    <v-container fluid>
    <v-tabs
      fixed-tabs
      background-color='primary'
      dark
    >
      <v-tab to="/">Registry</v-tab>
      <v-tab to="/graph">Graph</v-tab>
    </v-tabs>
    </v-container>
    <v-container>
      <router-view/>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
});
</script>
