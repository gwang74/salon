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
            <h3 class="headline mb-0">沙龙ID:{{salons.campaignID}}</h3>
            <br>
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
            <span>奖励比例</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="toRegister()">{{registe}}</v-btn>
          <v-btn flat color="orange" @click="toCheckin()">{{checkin}}</v-btn>
          <v-btn flat color="orange" v-show="isAdmin" @click="addQuestion = true">问答</v-btn>
          <v-btn flat color="orange" v-show="isAdmin" @click="toCloseCampaign()">{{closeCampaign}}</v-btn>
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
            :rules="[() => !!questioner || 'This field is required',
              ()=>isAddress(questioner) || 'addrress is invalid']"
            label="回答者"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="replier"
            v-model="replier"
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
import { constants } from "fs";

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
      addQuestion: false,
      color: "",
      message: "",
      address: "",
      search: "",
      questioner: "",
      replier: ""
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
        this.color = "error";
      });
      if (res) {
        this.message = "创建成功";
        this.color = "success";
      } else {
        this.message = "创建失败";
        this.color = "error";
      }
      this.snackbar = true;
      this.dialog = false;
      this.loading = false;
    },
    toRegister: async function() {
      const res = await Salon.register(this.salons.campaignID).catch(err => {
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
    toCheckin: async function() {
      const res = await Salon.checkin(this.salons.campaignID).catch(err => {
        console.log(err);
      });
      if (res) {
        this.checkin = "已签到";
        this.message = "签到成功!";
        this.color = "success";
      } else {
        this.message = "签到失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    toAddQuestion: async function() {
      const res = await Salon.toAddQuestion(
        this.salons.campaignID,
        this.questioner,
        this.replier
      ).catch(err => {
        console.log(err);
      });
      if (res) {
        this.message = "添加成功!";
        this.color = "success";
      } else {
        this.message = "添加失败!";
        this.color = "error";
      }
      this.snackbar = true;
    },
    toCloseCampaign: async function() {
      this.loading = true;
      let res = await Salon.closeCampaign(this.salons.campaignID).catch(err => {
        this.message = "关闭失败!";
        this.color = "error";
        this.snackbar = true;
        this.loading = false;
      });
      if (res) {
        this.closeCampaign = "已关闭";
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
      if (!this.search) {
        return;
      }
      let res = await Salon.getSalonInfo(this.search);
      if (res && res.ID != 0) {
        if (!res.end) {
          this.salons.campaignID = res.ID;
          this.salons.topic = res.topic;
          this.salons.speaker = res.speaker;
          this.salons.sponsor = res.sponsor;
          this.isSalon = true;
        } else {
          this.message = "抱歉,沙龙已关闭";
          this.color = "warning";
          this.snackbar = true;
          this.isSalon = false;
        }
      } else {
        this.color = "warning";
        this.message = "沙龙不存在,请确认沙龙ID是否正确";
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
    isAddQuestion: function() {
      return (
        this.questioner &&
        this.replier &&
        this.isAddress(this.questioner) &&
        this.isAddress(this.replier)
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
