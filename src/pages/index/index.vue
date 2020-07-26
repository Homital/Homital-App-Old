<template>
    <view>
        <!-- <view class="uni-padding-wrap uni-common-mt">
            <view v-if="notloggedin != null && notloggedin">
                <uni-card
                    title="Log in"
                    mode="title"
                    :is-shadow="true"
                    @click="_directToLogin"
                >Log in to check and control your devices.</uni-card>
            </view>
        </view>

        <view v-if="notloggedin != null && !notloggedin"> -->

          <view>
            <view class="uni-padding-wrap uni-common-mt">
                <view class="uni-textarea uni-common-mt">
                    <textarea :value="res"></textarea>
                </view>
                <view class="uni-btn-v uni-common-mt">
                    <button
                        @click="_request"
                        style="width:80%;margin-top:35px;margin-bottom:15px;"
                        v-bind:loading="status == null ? true : false"
                        v-bind:type="status ? 'primary' : 'default'"
                    >{{status == null? 'fetching light status' : status
                    ? 'Switch Off' : 'Switch On'}}</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const auth = require('../../common/authorisation');
import uniCard from '@/components/uni-card/uni-card.vue';
export default {
  data() {
    return {
      status: null,
      res: '',
      loading: false,
      haha: 'warn',
      // notloggedin: null,
    };
  },
  // eslint-disable-next-line vue/no-unused-components
  components: {uniCard},
  async onShow() {
    const tHIS = this;
    // tHIS.notloggedin = null;
    tHIS.status = null;

    // console.log('checking account status');
    // console.log('before' + tHIS.notloggedin);
    // tHIS.notloggedin = uni.getStorageSync('notloggedin');
    // console.log('after' + tHIS.notloggedin);

    const access = await getApp().globalData.access_token;
    console.log('printing access token just after page: ' + access);

    // request for light status
    // to add, if device type is light
    auth.functions.makeAuthenticatedCall(
        (res) => {
          console.log('reached light status callback, resData on/off');
          console.log('request successful: ' + res.statusCode == 200);
          if (res.statusCode == 200) {
            tHIS.status = resData.status.power;
            tHIS.haha = tHIS.status ? 'primary' : 'default';
          } else {
            console.log('request not processed, prompt to login again');
            tHIS.notloggedin = true;
            uni.setStorageSync('notloggedin', true);
            uni.removeStorageSync('refresh_token');
            uni.removeStorageSync('userinfo');
            uni.showToast({
              icon: 'none',
              title: 'Light status can\'t be obtained. Please log in again.',
              duration: 2000,
            });
          }
        },
        getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp',
        {},
        'GET',
    );
  },
  async onPullDownRefresh() {
    _refresh();
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    _request() {
      const tHIS = this;
      if (this.status) {
        console.log('trying to turn off...');
        auth.functions.makeAuthenticatedCall(
            (resData) => {
              if (resData.success) {
                console.log('request success');
                tHIS.status = false;
                tHIS.haha = 'default';
              }
            },
            getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp/poweroff',
            {},
            'POST',
        );
      } else {
        console.log('trying to turn on...');
        auth.functions.makeAuthenticatedCall(
            (resData) => {
              if (resData.success) {
                console.log('request success');
                tHIS.status = true;
                tHIS.haha = 'primary';
              }
            },
            getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp/poweron',
            {},
            'POST',
            1,
        );
      }
    },
    _directToLogin() {
      console.log('directing...');
      uni.navigateTo({
        url: '../login/login',
        success: (res) => {
          console.log('suc');
        },
        fail: () => {
          console.log('fal');
        },
        complete: () => {},
      });
    },
    async _refresh() {
      const tHIS = this;
      // tHIS.notloggedin = null;
      tHIS.status = null;

      // console.log('checking account status');
      // console.log('before' + tHIS.notloggedin);
      // tHIS.notloggedin = uni.getStorageSync('notloggedin');
      // console.log('after' + tHIS.notloggedin);

      const access = await getApp().globalData.access_token;
      console.log('printing access token just after page: ' + access);

      // request for light status
      // to add, if device type is light
      auth.functions.makeAuthenticatedCall(
          (res) => {
            console.log('reached light status callback, resData on/off');
            console.log('request successful: ' + res.statusCode == 200);
            if (res.statusCode == 200) {
              tHIS.status = resData.status.power;
              tHIS.haha = tHIS.status ? 'primary' : 'default';
            } else {
              console.log('request not processed, prompt to login again');
              tHIS.notloggedin = true;
              uni.setStorageSync('notloggedin', true);
              uni.removeStorageSync('refresh_token');
              uni.removeStorageSync('userinfo');
              uni.showToast({
                icon: 'none',
                title: 'Light status can\'t be obtained. Please log in again.',
                duration: 2000,
              });
            }
          },
          getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp',
          {},
          'GET',
      );
    },
  },
};
</script>

<style>


.container {
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
    background-color: #bbff00;
}
</style>
