<template>
  <v-content>
    <AccountInfo @toNewCampaign="toNewCampaign"/>
    <SalonManager :isNewCampaign="isNewCampaign"/>
  </v-content>
</template>

<script>
import SalonManager from "../components/SalonManager";
import AccountInfo from "../components/AccountInfo";

export default {
  data() {
    return {
      isNewCampaign: false
    };
  },
  components: { AccountInfo, SalonManager },
  methods: {
    toNewCampaign: function() {
      this.isNewCampaign = !this.isNewCampaign;
    }
  }
};
</script>
