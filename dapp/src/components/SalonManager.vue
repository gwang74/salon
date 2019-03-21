<template>
  <div>
    <v-data-table hide-actions :headers="headers" :items="salons" class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left px-0">{{ props.item.campaignID }}</td>
        <td class="text-xs-left px-0">{{ props.item.topic }}</td>
        <td class="text-xs-left px-0">{{ props.item.speaker }}</td>
        <td class="text-xs-left px-0">{{ props.item.sponsor }}</td>
        <td class="text-xs-left px-0">
          <v-btn color="success" flat @click="toRegister(props.item.campaignID)">{{registe}}</v-btn>
          <v-btn color="success" flat @click="toCheckin(props.item.campaignID)">{{checkin}}</v-btn>
          <v-btn
            color="success"
            flat
            @click="toCloseCampaign(props.item.campaignID)"
          >{{closeCampaign}}</v-btn>
        </td>
      </template>
    </v-data-table>
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
      headers: [
        {
          text: "沙龙ID",
          align: "left",
          sortable: false,
          value: "campaignID"
        },
        {
          text: "沙龙主题",
          align: "left",
          sortable: false,
          value: "topic"
        },
        {
          text: "主讲人",
          align: "left",
          sortable: false,
          value: "speaker"
        },
        {
          text: "赞助商",
          align: "center",
          sortable: false,
          value: "sponsor"
        },
        {
          text: "操作",
          align: "left",
          sortable: false
        }
      ],
      salons: [
        {
          campaignID: "20190313",
          topic: "test",
          speaker: "某某",
          sponsor: "某某"
        },
        {
          campaignID: "20190314",
          topic: "test",
          speaker: "某某",
          sponsor: "某某"
        }
      ],
      editedItem: {
        campaignID: "20190321",
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
      message: "",
      address: ""
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
      ).catch(err => {
        this.loading = false;
        this.isAlert = true;
        alert(err);
        alert("创建失败");
        this.message = "创建失败";
      });
      if (res) {
        alert("创建成功");
      } else {
        alert("创建失败");
      }
      this.dialog = false;
      this.isAlert = true;
      this.loading = false;
    },
    toRegister: async function(campaignID) {
      const res = await Salon.register(campaignID).catch(err => {
        console.log(err);
      });
      if (res) {
        this.registe = "已报名";
      }
    },
    toCheckin: async function(campaignID) {
      const res = await Salon.checkin(campaignID).catch(err => {
        console.log(err);
      });
      if (res) {
        this.checkin = "已签到";
      }
    },
    toCloseCampaign: function(campaignID) {
      this.loading = true;
      Salon.closeCampaign(campaignID)
        .then(res => {
          if (res) {
            alert("关闭成功!");
          } else {
            alert("关闭失败!");
          }
          this.loading = false;
        })
        .catch(err => {
          alert("关闭失败!");
          this.loading = false;
        });
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
