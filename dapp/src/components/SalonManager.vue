<template>
  <div>
    <v-container>
      <v-flex sm4>
        <v-text-field
          v-model="search"
          append-icon="search"
          box
          label="请输入想参加的沙龙ID"
          type="number"
          @click:append="getSalonInfo()"
        ></v-text-field>
      </v-flex>
    </v-container>
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="white--text" color="cyan darken-2" v-show="isSalon">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">沙龙ID:{{salons[0].campaignID}}</h3>
            <br>
            <span>
              主题
              <br>
              {{salons[0].topic}}
            </span>
            <br>
            <span>
              主讲人
              <br>
              {{salons[0].speaker}}
            </span>
            <br>
            <span>
              赞助商
              <br>
              {{salons[0].sponsor}}
            </span>
            <span>奖励比例</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="toRegister(salons[0].campaignID)">报名</v-btn>
          <v-btn flat color="orange" @click="toCheckin(salons[0].campaignID)">签到</v-btn>
          <v-btn
            flat
            color="orange"
            v-show="isAdmin"
            @click="toCloseCampaign(salons[0].campaignID)"
          >关闭</v-btn>
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
            :rules="[() => !!editedItem.speaker || 'This field is required',
              ()=>isAdrress(editedItem.speaker) || 'addrress is invalid']"
            label="主讲人"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="sponsor"
            v-model="editedItem.sponsor"
            :rules="[() => !!editedItem.sponsor || 'This field is required',
              ()=> isAdrress(editedItem.sponsor)||'addrress is invalid']"
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

export default {
  props: { isNewCampaign: Boolean },
  data() {
    return {
      salons: [
        {
          campaignID: "",
          topic: "",
          speaker: "",
          sponsor: ""
        }
      ],
      editedItem: {
        campaignID: "20190322",
        topic: "test",
        speaker: "0x845f235068B96F34e919324ac29fbBF75bf35bef",
        sponsor: "0x652dC7534dC53455B92A54233606217aeF4a10DD"
      },
      registe: "报名",
      checkin: "签到",
      closeCampaign: "关闭",
      buttonName: "创建",
      loading: false,
      dialog: false,
      snackbar: false,
      isSalon: false,
      isAdmin: false,
      color: "",
      message: "",
      address: "",
      search: ""
    };
  },
  beforeCreate: async function() {
    await Salon.init().catch(err => {
      alert("beforeCreate-->" + err);
    });
  },
  methods: {
    newCampaign: async function() {
      this.loading = true;
      const res = await Salon.newCampaign(
        this.editedItem.campaignID,
        this.editedItem.topic,
        this.editedItem.speaker,
        this.editedItem.sponsor
      ).catch(e => {
        this.loading = false;
        console.log(e);
        this.message = "创建失败";
      });
      if (res) {
        this.message = "创建成功";
      } else {
        this.message = "创建失败";
      }
      this.snackbar = true;
      this.dialog = false;
      this.loading = false;
    },
    toRegister: async function(campaignID) {
      const res = await Salon.register(campaignID).catch(err => {
        console.log(err);
      });
      if (res) {
        this.registe = "已报名";
        this.message = "报名成功!";
        this.color = "success";
      } else {
        this.message = "报名失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    toCheckin: async function(campaignID) {
      const res = await Salon.checkin(campaignID).catch(err => {
        console.log(err);
      });
      if (res) {
        this.checkin = "已签到";
      }
    },
    toCloseCampaign: async function(campaignID) {
      this.loading = true;
      let res = await Salon.closeCampaign(campaignID).catch(err => {
        this.message = "关闭失败!";
        this.color = "error";
        this.snackbar = true;
        this.loading = false;
      });
      if (res) {
        this.message = "关闭成功!";
        this.color = "success";
      } else {
        this.message = "关闭失败!";
        this.color = "error";
      }
      this.snackbar = true;
      this.loading = false;
    },
    getSalonInfo: async function() {
      let res = await Salon.getSalonInfo(this.search);
      if (res) {
        if (res.ID) {
          this.isAdmin = await Salon.isAdministrator();
          this.salons[0].campaignID = res.ID;
          this.salons[0].topic = res.topic;
          this.salons[0].speaker = res.speaker;
          this.salons[0].sponsor = res.sponsor;
          this.isSalon = true;
        } else {
          this.message = "抱歉,沙龙已关闭";
          this.color = "warning";
          this.snackbar = true;
        }
      } else {
        this.color = "warning";
        this.message = "沙龙不存在,请确认沙龙ID是否正确";
        this.snackbar = true;
      }
    },
    isAdrress: function(address) {
      return Salon.isAddress(address);
    },
    isCreate: function() {
      return (
        this.editedItem.campaignID &&
        this.editedItem.topic &&
        this.editedItem.speaker &&
        this.editedItem.sponsor &&
        this.isAdrress(this.editedItem.speaker) &&
        this.isAdrress(this.editedItem.sponsor)
      );
    }
  },
  watch: {
    isNewCampaign: function() {
      this.dialog = true;
    }
  }
};
</script>
