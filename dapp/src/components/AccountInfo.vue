<template>
  <v-content>
    <v-dialog v-model="dialog" hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-card-text>
          <v-text-field
            ref="fromAddress"
            v-model="address"
            :rules="[() => !!address || 'This field is required']"
            label="转账地址"
            clear-icon="mdi-close-circle"
            required
            disabled
            box
          ></v-text-field>
          <v-text-field
            ref="amount"
            v-model="amount"
            :rules="[
                () => !!amount || 'This field is required']"
            label="数量"
            type="number"
            :hint="'最大:' + tokenBalance + ' AHBC'"
            suffix="AHBC"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
          <v-text-field
            ref="toAddress"
            v-model="toAddress"
            :rules="[() => !!toAddress || 'This field is required',
              ()=>isAddress(toAddress) || 'addrress is invalid']"
            label="接收地址"
            clear-icon="mdi-close-circle"
            required
            clearable
            box
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="transfer()" :disabled="!isTransfer()">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <v-card-text primary-title class="text-xs-center">
        <div>
          <div class="orange--text text--lighten-1" v-show="isAdmin">管理员</div>
        </div>
      </v-card-text>
      <v-avatar slot="offset" class="mx-auto d-block" size="130">
        <img src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg">
      </v-avatar>
    </div>
    <v-card-text class="text-xs-center">
      <div>
        <span class="grey--text">{{tokenBalance}}</span>
        <strong class="subheading">&#32;AHBC</strong>
      </div>
    </v-card-text>
    <v-card-text class="text-xs-center">
      <v-btn color="success" round class="font-weight-light" @click="dialog = true">发送</v-btn>
      <v-btn
        color="success"
        v-show="isAdmin"
        round
        class="font-weight-light"
        @click="toNewCampaign()"
      >创建</v-btn>
    </v-card-text>
  </v-content>
</template>

<script>
import SalonToken from "../js/SalonToken";
import Salon from "../js/Salon";
import Tp from "tp-js-sdk";
import { constants } from "fs";

export default {
  data() {
    return {
      address: "",
      toAddress: "",
      amount: "",
      tokenBalance: 0,
      totalSupply: 0,
      dialog: false,
      isAdmin: false
    };
  },
  beforeCreate:async function() {
   await Salon.init();
   await SalonToken.init();
   console.log(Salon.fromAddress);
   this.address= Salon.fromAddress;
   this.isAdministrator();
  },
  mounted: async function() {
    try {
      await Salon.init();
      await SalonToken.init();
      // this.getBalance();
      this.isAdministrator();
    } catch (error) {
      alert(error);
    }
  },
  methods: {
    getTotalSupply: async function() {
      await SalonToken.totalSupply();
    },
    getBalance: async function() {
      this.tokenBalance = await SalonToken.getBalance();
    },
    transfer: async function() {
      const res = await SalonToken.transfer(this.toAddress, this.amount);
      this.dialog = false;
    },
    isAddress: function(address) {
      return SalonToken.isAddress(address);
    },
    isTransfer: function() {
      return this.isAddress(this.toAddress) && this.amount;
    },
    toNewCampaign: function() {
      this.$emit("toNewCampaign");
    },
    isAdministrator: async function() {
      this.isAdmin = await Salon.isAdministrator().catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style>
</style>
