<template>
  <div>
    <v-layout row wrap>
      <v-flex xs2>
        <v-snackbar v-model="snackbar" :multi-line="true" :top="true" :color="color">
          <div>{{message}}</div>
          <v-icon size="16" @click="snackbar = false">mdi-close-circle</v-icon>
        </v-snackbar>
      </v-flex>
    </v-layout>
    <v-dialog fullscreen v-model="dialog" hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat :disabled="!isCreate()" @click="newCampaign()">
              <v-icon>save</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            ref="campaignID"
            v-model="editedItem.campaignID"
            :rules="[() => !!editedItem.campaignID || 'This field is required']"
            label="沙龙ID"
            type="number"
            clear-icon="mdi-close-circle"
            hint="推荐使用日期:YYYYMMDD"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="topic"
            v-model="editedItem.topic"
            :rules="[
                () => !!editedItem.topic || 'This field is required']"
            label="沙龙主题"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="speaker"
            v-model="editedItem.speaker"
            prepend-inner-icon="mdi-qrcode-scan"
            @click:prepend-inner="scanForSpeaker()"
            :rules="[() => !!editedItem.speaker || 'This field is required',
              ()=>isAddress(editedItem.speaker) || 'addrress is invalid']"
            label="主讲人"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="sponsor"
            v-model="editedItem.sponsor"
            prepend-inner-icon="mdi-qrcode-scan"
            @click:prepend-inner="scanForSponsor()"
            :rules="[() => !!editedItem.sponsor || 'This field is required',
              ()=> isAddress(editedItem.sponsor)||'addrress is invalid']"
            label="赞助商"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Salon from "../js/Salon";
import tp from "tp-js-sdk";

export default {
  props: { isNewCampaign: Boolean },
  data() {
    return {
      editedItem: {
        campaignID: "",
        topic: "",
        speaker: "",
        sponsor: ""
      },
      registe: "报名",
      checkin: "签到",
      closeCampaign: "关闭",
      buttonName: "创建",
      dialog: false,
      snackbar: false,
      isSalon: false,
      isAdmin: false,
      addQuestion: false,
      isRegist: false,
      isClose: false,
      color: "",
      message: "",
      address: "",
      search: "",
      questioner: "",
      replier: "",
      speakerPercent: "",
      sponsorPercent: "",
      participantPercent: "",
      questionPercent: "",
      registerFee: ""
    };
  },
  beforeCreate: async function() {
    try {
      this.isAdmin = await Salon.init();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    onBlurInput() {
      window.scroll(0, 0);
    },
    newCampaign: async function() {
      const res = await Salon.newCampaign(
        this.editedItem.campaignID,
        this.editedItem.topic,
        this.editedItem.speaker,
        this.editedItem.sponsor
      ).catch(e => {
        console.log(e);
        this.message = "创建失败";
        this.color = "error";
      });
      if (res.result) {
        this.closeDialog();
        let res = await Salon.waitTransfer(res.data).catch(err => {
          console.log(err);
        });
        if (res) {
          this.message = "创建成功";
          this.color = "success";
          this.toGetBalance();
          this.getSalonInfo(this.editedItem.campaignID);
        } else {
          this.message = "创建失败";
          this.color = "error";
        }
        this.snackbar = true;
      } else {
        this.message = "创建失败!";
        this.color = "error";
        this.snackbar = true;
      }
    },
    isAddress: function(address) {
      return Salon.isAddress(address);
    },
    isCreate: function() {
      return (
        this.editedItem.campaignID &&
        this.editedItem.topic &&
        this.editedItem.speaker &&
        this.editedItem.sponsor &&
        this.isAddress(this.editedItem.speaker) &&
        this.isAddress(this.editedItem.sponsor)
      );
    },
    scanForSpeaker: async function() {
      let address = await tp.invokeQRScanner();
      if (!this.isAddress(address)) {
        if (process.env.VUE_APP_NETWORK === "MOAC") {
          this.message = "请使用MOAC钱包";
        } else {
          this.message = "请使用ETH钱包";
        }
        this.snackbar = true;
        return;
      }
      this.editedItem.speaker = address;
    },
    scanForSponsor: async function() {
      let address = await tp.invokeQRScanner();
      if (!this.isAddress(address)) {
        if (process.env.VUE_APP_NETWORK === "MOAC") {
          this.message = "请使用MOAC钱包";
        } else {
          this.message = "请使用ETH钱包";
        }
        this.snackbar = true;
        return;
      }
      this.editedItem.sponsor = address;
    },
    toGetBalance: function() {
      this.$emit("toGetBalance");
    },
    closeDialog: function() {
      console.log("请稍等交易上链。。。");
      this.color = "success";
      this.message = "请稍等交易上链。。。";
      this.snackbar = true;
      this.dialog = false;
    }
  },
  watch: {
    isNewCampaign: function() {
      this.dialog = true;
    }
  }
};
</script>

<style scoped type="text/css">
.flex {
  margin-top: -12px;
}
.flex1 {
  margin-top: -30px;
  margin-left: -15px;
}
.style-p {
  margin-top: 23px;
}
.style-p1 {
  margin-top: 4px;
}
</style>

