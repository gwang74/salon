<template>
  <v-content>
    <AccountInfo @toNewCampaign="toNewCampaign" :isBalance="isBalance"/>
    <SalonManager :isNewCampaign="isNewCampaign" @toGetBalance="toGetBalance"/>
  </v-content>
</template>

<script>
import SalonManager from "../components/SalonManager";
import AccountInfo from "../components/AccountInfo";

export default {
  data() {
    return {
      isNewCampaign: false,
      isBalance: false
    };
  },
  components: { AccountInfo, SalonManager },
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
