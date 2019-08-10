<template>
  <v-tabs background-color="teal lighten-4" right>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab href="#tab-1">
      <v-icon left>group</v-icon>沙龙
    </v-tab>
    <v-tab href="#tab-2">
      <v-icon left>person</v-icon>我
    </v-tab>
    <v-tabs-items>
      <v-tab-item :key="1" :value="'tab-1'">
        <SalonInfo />
      </v-tab-item>
      <v-tab-item :key="2" :value="'tab-2'">
        <AccountInfo @toNewCampaign="toNewCampaign" :isBalance="isBalance" />
        <SalonManager :isNewCampaign="isNewCampaign" @toGetBalance="toGetBalance" />
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import SalonManager from "../components/SalonManager";
import AccountInfo from "../components/AccountInfo";
import SalonInfo from "../components/SalonInfo";

export default {
  data() {
    return {
      isNewCampaign: false,
      isBalance: false
    };
  },
  components: { AccountInfo, SalonManager, SalonInfo },
  methods: {
    toNewCampaign: function() {
      this.isNewCampaign = !this.isNewCampaign;
    },
    toGetBalance: function() {
      this.isBalance = !this.isBalance;
    }
  }
};
</script>
