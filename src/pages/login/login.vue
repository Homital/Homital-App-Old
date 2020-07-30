<template>
    <view>
        <view class="uni-padding-wrap uni-common-mt">
            <!-- <view class="uni-hello-text">Please log in.</view> -->
            <view class="inputArea">
                <input
                    v-model="username"
                    placeholder="Username/Email"
                    type="text"
                    style="width:80%;margin-top:20px;margin-bottom:20px;"
                    tabindex="1"
                    class="inputClass"
                />
            </view>
            <view class="inputArea">
                <input
                    v-model="password"
                    style="width:80%;margin-top:20px;margin-bottom:20px;"
                    tabindex="1"
                    placeholder="Password"
                    type="password"
                    class="inputClass"
                />
            </view>
            <!-- <view class="uni-textarea uni-common-mt">
                <textarea :value="res"></textarea>
            </view>-->
            <view class="uni-btn-v uni-common-mt">
                <button type="primary" v-bind:loading ='loggingInProcessing'
                style="width:80%;margin-top:20px;margin-bottom:20px;"
                @tap="_login">{{loggingInProcessing == false? 'log in'
                :'logging in'}}</button>
                <button type="primary"
                style="width:80%;margin-bottom:20px;"
                @tap="_register">Register</button>
            </view>
            <!-- <view class="inputArea">
                <text style="float:right;color:blue;"
                @click="_register">>>Or register here>></text>
            </view>-->
                <view class="input">
      <!-- style="float:right;color:blue;" -->
            <text style="width:80%;margin-top:20px;margin-bottom:20px;"
      @click="_forgetPassword">Forgot your password?</text>
    </view>
                    <view class="input">
      <!-- style="float:right;color:blue;" -->
            <text style="width:80%;margin-top:20px;margin-bottom:20px;"
      @click="_changePassword">Change password</text>
    </view>
        </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      success: '',
      valid: false,
      error: '',
      // res:'',
      refresh_token: '',
      loggingInProcessing: false,
      roomList: [],
    };
  },
  methods: {
    _register() {
      uni.navigateTo({
        url: '../login/register',
        success: (res) => {},
        fail: () => {},
        complete: () => {},
      });
    },
    async _login() {
      const tHIS = this;
      if (this.username.length <= 0) {
        uni.showToast({
          title: 'Cannot lah please enter valid username',
          duration: 2000,
        });
        return;
      } else if (this.password.length <= 0) {
        uni.showToast({
          title: 'forgot ur password meh',
          duration: 2000,
        });
        return;
      } else {
        tHIS.loggingInProcessing = true;
        const loginMethod = this.username.includes('@') ?
                    'email' :
                    'username';
        const url =
                    getApp().globalData.base_url +
                    '/auth/user/login?by=' +
                    loginMethod;
        await uni.request({
          url: url,
          data: {
            email: tHIS.username,
            username: tHIS.username,
            password: tHIS.password,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
          },
          success: async (res) => {
            if (res.statusCode == 200) {
              tHIS.valid = true;
              tHIS.refresh_token = res.data.refresh_token;
              //
              console.log('on log in,room temp is:' +
              getApp().globalData.room_temp);
              //
              uni.setStorageSync('userinfo', tHIS.username);
              // uni.setStorageSync('notloggedin', false);
              getApp().globalData.notloggedin = false;
              // uni.setStorageSync('refresh_token', tHIS.refresh_token);
              getApp().globalData.refresh_token = tHIS.refresh_token;
              getApp().globalData.access_token = res.data.access_token;
              getApp().globalData.room_list = [];
              getApp().globalData.request_room_list = true;
              // getApp().globalData.room_added = '';
              // getApp().globalData.room_id_added = '';
              // getApp().globalData.room_role_added = '';
              // getApp().globalData.room_switched_to = '';
              // getApp().globalData.room_switched_to_id = '';
              // getApp().globalData.oom_switched_to_role ='';


              // console.log("userinfo:", uni.getStorageSync('userinfo'));
              await uni.showToast({
                title: 'log in successfully',
                duration: 2000,
              });
              // uni.reLaunch({
              // url: '../me/me'
              // });
              tHIS.loggingInProcessing = false;


              // to get and storage user's room and device data
              // await getDataOnLogin();


              uni.navigateBack();
            } else {
              tHIS.valid = false;
              tHIS.error = res.data.error;
              uni.showToast({
                title: tHIS.error,
                duration: 2000,
              });
            }
          },
          fail: async (res) => {
            if (this.username.length <= 0) {
              uni.showToast({
                title: 'Cannot lah please enter valid username',
                duration: 2000,
              });
              return;
            } else if (this.password.length <= 0) {
              uni.showToast({
                title: 'forgot ur password meh',
                duration: 2000,
              });
              return;
            } else {
              const loginMethod = this.username.includes('@') ?
                    'email' :
                    'username';
              const url =
                    getApp().globalData.base_url +
                    '/auth/user/login?by=' +
                    loginMethod;
              await uni.request({
                url: url,
                data: {
                  email: tHIS.username,
                  username: tHIS.username,
                  password: tHIS.password,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                },
                success: async (res) => {
                  console.log(tHIS.email);
                  if (res.data.success) {
                    tHIS.valid = true;
                    tHIS.refresh_token = res.data.refresh_token;
                    uni.setStorageSync('userinfo', tHIS.username);
                    // uni.setStorageSync('notloggedin', false);
                    getApp().globalData.notloggedin = false;
                    // uni.setStorageSync('refresh_token', tHIS.refresh_token);
                    getApp().globalData.refresh_token = tHIS.refresh_token;

                    await uni.showToast({
                      title: 'log in successfully',
                      duration: 2000,
                    });

                    uni.navigateBack();
                  } else {
                    tHIS.valid = false;
                    tHIS.error = res.data.error;
                    uni.showToast({
                      title: tHIS.error,
                      duration: 2000,
                    });
                  }
                },
              });
            }
          },

        });
      }
    },
    _forgetPassword() {
      uni.navigateTo({
        url: '../login/forgetPassword',
        success: (res) => {},
        fail: () => {},
        complete: () => {},
      });
    },
    _changePassword() {
      uni.navigateTo({
        url: '../login/updatePassword',
        success: (res) => {},
        fail: () => {},
        complete: () => {},
      });
    },
  },
};
</script>

<style>
.container {
    padding: 20px;
    font-size: 12px;
    line-height: 24px;
    min-height: 100%;
  width: 100%;
  background-color: #585c61;
  overflow: hidden;

}
.inputArea {
  padding: 20upx 10%;
  border: 1px solid rgb(218, 213, 213);
  border-radius: 10rpx;
  margin: 5rpx;
  outline: 0;
  line-height: 24px;
  min-height: 100%;
  background-color: #73767a;
  /* opacity: 0.1; */
}


</style>
