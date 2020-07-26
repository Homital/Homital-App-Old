<template>
    <view>
  <view style="uni-padding-wrap uni-common-mt">
    <view class="inputArea">
      <input v-model="emailAddress" placeholder="Enter your email address"
      style="width:80%;margin-top:15px;margin-bottom:15px;"
      type="text" class="inputClass" />
    </view>
    <view class="reg_button">
        <button type="primary"
          style="width:80%;margin-top:15px;margin-bottom:15px;"
          @tap="_sendVerificationCode"
        >Get Verification Code</button>
    </view>
    <view class="inputArea">
        <input type="number" maxlength="6"
        placeholder="6-digit verification code"
        class="inputClass" v-model="verificationCode" />
    </view>
    <!-- <view style="padding: 0 10%;">
      <text style="color: red;">{{message}}</text>
    </view> -->
    <view class="reg_button">
      <button style="width:80%;margin-top:20px;margin-bottom:20px;"
      type="primary"
      @tap="getPassword">Get Password</button>
    </view>
  </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      emailAddress: '',
      password: '',
      reconfirmPassword: '',
      verificationCode: '',
      sendCode: {
        text: 'Send',
        status: false,
        codeTime: 180,
      },
      timerId: null,
      message: '',
    };
  },
  methods: {
    _sendVerificationCode() {
      const tHIS = this;
      const url = getApp().globalData.base_url + '/auth/user/getotp';
      console.log('url is :' + url);
      uni.request({
        url: getApp().globalData.base_url + '/auth/user/getotp',
        data: {
          email: tHIS.emailAddress,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success: (res) => {
          console.log('sending verification code...');
          if (res.statusCode == 200) {
            console.log('verification code sent successfully');
          } else {
            tHIS.error = res.data.error;
            uni.showToast({
              icon: 'none',
              title: res.data.error,
              duration: 2000,
            });
          }
        },
      });
      if (this.sendCode.codeTime != 180) {
        return;
      }
      this.timerId = setInterval(() => {
        let timer = this.sendCode.codeTime;
        timer--;
        this.sendCode.codeTime = timer;
        this.sendCode.text = timer + 'S';
        if (timer < 1) {
          clearInterval(this.timerId);
          this.sendCode.text = 'Resend';
          this.sendCode.codeTime = 180;
          this.sendCode.status = false;
        }
      },
      1000);
      return false;
    },
    getPassword() {
      const tHIS = this;
      if (!tHIS.verificationCode) {
        tHIS.message = 'Please enter verification code';
      } else {
        uni.request({
          url: getApp().globalData.base_url +
                        '/auth/user/fgtpswd',
          data: {
            email: tHIS.emailAddress,
            otp: tHIS.verificationCode,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {
            if (res.statusCode == 200) {
              uni.showToast({
                icon: 'none',
                title: 'Successfully obtained new password',
                duration: 2000,
              });
            } else {
              uni.showToast({
                icon: 'none',
                title: res.data.error,
                duration: 2000,
              });
            }
          },
        });
      }
    },
  },
};
</script>

<style>
  /* .inputClass {
    border: 1px solid #ccc;
    border-radius: 22px;
    outline: 0;
    padding: 8px 15px;
    background-color: #585c61;
  } */
  .inputClass {
  padding: 20upx 10%;
  color: black;
  border: 1px solid rgb(218, 213, 213);
  border-radius: 10rpx;
  margin: 5rpx;
  outline: 0;
  background-color: #9ea3a8;
  opacity: 1;
  }
  .reg_button {
    color: rgb(32, 88, 173);
  }
</style>
