<template>
  <div>
    <v-container>
      <v-flex sm4>
        <v-text-field
          v-model="search"
          append-icon="search"
          prepend-inner-icon="mdi-qrcode-scan"
          @click:prepend-inner="scanForRegiste()"
          box
          label="扫码或输入想参加的沙龙ID"
          type="number"
          @click:append="getSalonInfo(search)"
        ></v-text-field>
      </v-flex>
    </v-container>
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="white--text" color="cyan darken-2" v-show="isSalon">
        <v-card-title primary-title>
          <div>
            <div class="text-xs-right">
              <h3 class="headline mb-0">沙龙ID:{{salons.campaignID}}</h3>
              <v-divider inset dark></v-divider>
            </div>
            <span>
              主题
              <br>
              {{salons.topic}}
            </span>
            <br>
            <span>
              主讲人
              <br>
              {{salons.speaker}}
            </span>
            <br>
            <span>
              赞助商
              <br>
              {{salons.sponsor}}
            </span>
            <br>
            <v-divider dark></v-divider>
            <v-layout row style="height: 58px;">
              <v-flex xs2 class="flex">
                <p class="style-p">报名费:</p>
              </v-flex>
              <v-flex xs3 class=".flex">
                <v-text-field
                  dark
                  v-model="registerFee"
                  suffix="ABST"
                  :disabled="!isAdmin"
                  :append-outer-icon="[ isAdmin ? 'mdi-feather':'']"
                  @click:append-outer="changeFee()"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <div>
              <v-flex xs7>
                <span>奖励比例(主讲:赞助:参与:提问):</span>
              </v-flex>
              <v-layout row wrap style="margin-left: 16px;margin-top: 12px;">
                <v-flex xs1 class="flex1">
                  <v-text-field dark flat v-model="speakerPercent" :disabled="!isAdmin"></v-text-field>
                </v-flex>
                <v-flex xs1 class="flex">
                  <p class="style-p1">:</p>
                </v-flex>
                <v-flex xs1 class="flex1">
                  <v-text-field dark flat v-model="sponsorPercent" :disabled="!isAdmin"></v-text-field>
                </v-flex>
                <v-flex xs1 class="flex">
                  <p class="style-p1">:</p>
                </v-flex>
                <v-flex xs1 class="flex1">
                  <v-text-field dark flat v-model="participantPercent" :disabled="!isAdmin"></v-text-field>
                </v-flex>
                <v-flex xs1 class="flex">
                  <p class="style-p1">:</p>
                </v-flex>
                <v-flex xs2 class="flex1">
                  <v-text-field
                    flat
                    dark
                    v-model="questionPercent"
                    :disabled="!isAdmin"
                    :append-outer-icon="[ isAdmin ? 'mdi-feather':'']"
                    @click:append-outer="changePercent()"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn
            fab
            color="green"
            icon
            dark
            small
            :disabled="isRegist"
            v-show="!isClose"
            @click="toRegiste()"
          >
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
          <v-btn
            fab
            small
            dark
            color="green"
            icon
            v-show="isAdmin && !isClose"
            @click="toCheckin()"
          >
            <v-icon>mdi-account-check</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            icon
            color="green"
            v-show="isAdmin && !isClose"
            @click="addQuestion = true"
          >
            <v-icon>mdi-account-question</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="green"
            icon
            style="margin-left: auto;"
            :disabled="isClose"
            v-show="isAdmin || isClose"
            @click="toCloseCampaign()"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
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
    <v-dialog v-model="addQuestion" persistent="true">
      <v-card>
        <v-card-text>
          <v-text-field
            ref="campaignID"
            v-model="salons.campaignID"
            label="沙龙ID"
            clear-icon="mdi-close-circle"
            disabled
            box
          ></v-text-field>
          <v-text-field
            ref="questioner"
            v-model="questioner"
            prepend-inner-icon="mdi-qrcode-scan"
            @click:prepend-inner="scanForQuestioner()"
            :rules="[() => !!questioner || 'This field is required',
              ()=>isAddress(questioner) || 'addrress is invalid']"
            label="提问者"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="replier"
            v-model="replier"
            prepend-inner-icon="mdi-qrcode-scan"
            @click:prepend-inner="scanForReplier()"
            :rules="[() => !!replier || 'This field is required',
              ()=>isAddress(replier) || 'addrress is invalid']"
            label="回答者"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="addQuestion = false">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="toAddQuestion()" :disabled="!isAddQuestion()">确认</v-btn>
        </v-card-actions>
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
      salons: {
        campaignID: "",
        topic: "",
        speaker: "",
        sponsor: ""
      },
      editedItem: {
        campaignID: "20190322",
        topic: "test",
        speaker: "0xc5Eb69AF3450f789CbAfE343404D91eCAe0755DA",
        sponsor: "0x0224dAfeeE5Fe4de0a8Bc2cFBdD120af68Cb0360"
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
      console.log(res);
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
      this.dialog = false;
    },
    scanForRegiste: async function() {
      let campaignID = await tp.invokeQRScanner();
      console.log(campaignID);
      await this.getSalonInfo(campaignID);
    },
    toRegiste: async function() {
      const res = await Salon.registe(this.salons.campaignID).catch(err => {
        console.log(err);
      });
      if (res) {
        this.toGetBalance();
        this.registe = "已报名";
        this.message = "报名成功!";
        this.getSalonInfo(this.salons.campaignID);
        this.isRegist = true;
        this.color = "success";
      } else {
        this.message = "报名失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    toCheckin: async function() {
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
      const res = await Salon.checkin(this.salons.campaignID, address).catch(
        err => {
          console.log(err);
        }
      );
      if (res) {
        this.toGetBalance();
        this.message = "签到成功!";
        this.isCheckin = true;
        this.color = "success";
      } else {
        this.message = "签到失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    toAddQuestion: async function() {
      const res = await Salon.addQuestion(
        this.salons.campaignID,
        this.questioner,
        this.replier
      ).catch(err => {
        console.log(err);
      });
      if (res) {
        this.message = "添加成功!";
        this.color = "success";
        this.getSalonInfo(this.salons.campaignID);
      } else {
        this.message = "添加失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    toCloseCampaign: async function() {
      let res = await Salon.closeCampaign(this.salons.campaignID).catch(err => {
        this.message = "关闭失败!";
        this.color = "error";
        this.snackbar = true;
      });
      if (res) {
        this.toGetBalance();
        this.closeCampaign = "已关闭";
        this.message = "关闭成功!";
        this.isClose = true;
        this.color = "success";
      } else {
        this.message = "关闭失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    getSalonInfo: async function(campaignID) {
      console.log(campaignID);
      if (!campaignID) {
        return;
      }
      let res = await Salon.getSalonInfo(campaignID).catch(e => {
        console.log(e);
      });
      if (res && res.campaign[2]) {
        let campaign = res.campaign;
        this.speakerPercent = res.speakerPercent;
        this.sponsorPercent = res.sponsorPercent;
        this.participantPercent = res.participantPercent;
        this.questionPercent = res.questionPercent;
        this.registerFee = res.registerFee;

        this.salons.campaignID = campaign[0];
        this.salons.topic = campaign[2];
        this.salons.speaker = campaign[3];
        this.salons.sponsor = campaign[4];
        if (campaign[1]) {
          this.isSalon = true;
          this.isClose = true;
          this.closeCampaign = "已关闭";
          return;
        }
        this.isClose = false;
        this.isSalon = true;
      } else {
        this.message = "抱歉,该沙龙不存在!";
        this.color = "warning";
        this.snackbar = true;
        this.isSalon = false;
      }
    },
    changeFee: async function() {
      await Salon.changeFee(this.registerFee);
    },
    changePercent: async function() {
      if (
        this.speakerPercent +
          this.sponsorPercent +
          this.participantPercent +
          this.questionPercent !=
        100
      ) {
        this.message = "奖励比例总和必须为100%";
        this.snackbar = true;
        return;
      }
      await Salon.changePercentage(
        this.speakerPercent,
        this.sponsorPercent,
        this.participantPercent,
        this.questionPercent
      );
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
    isAddQuestion: function() {
      return (
        this.questioner &&
        this.replier &&
        this.isAddress(this.questioner) &&
        this.isAddress(this.replier)
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
    scanForQuestioner: async function() {
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
      this.questioner = address;
    },
    scanForReplier: async function() {
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
      this.replier = address;
    },
    toGetBalance: function() {
      this.$emit("toGetBalance");
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

