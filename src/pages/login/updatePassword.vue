<template>
    <view>
  <view style="uni-padding-wrap uni-common-mt">
        <view class="inputArea">
      <input v-model="emailAddress" placeholder="Enter your email address"
      style="width:80%;margin-top:15px;margin-bottom:15px;"
      type="text" class="inputClass" />
    </view>
    <view class="inputArea">
      <input v-model="oldPassword"
      placeholder="Enter old password"
      style="width:80%;margin-top:15px;margin-bottom:15px;"
      type="password" class="inputClass" />
    </view>
    <view class="inputArea">
      <input v-model="newPassword" placeholder="Enter new password"
      style="width:80%;margin-top:15px;margin-bottom:15px;"
      type="password"
      class="inputClass" />
    </view>
    <view class="inputArea">
      <input v-model="reconfirmPassword" placeholder="Confirm new password"
      style="width:80%;margin-top:15px;margin-bottom:15px;"
      type="password" class="inputClass" />
    </view>
    <!-- <view style="padding: 0 10%;">
      <text style="color: red;">{{message}}</text>
    </view> -->
    <view class="reg_button">
      <button style="width:80%;margin-top:20px;margin-bottom:20px;"
      type="primary"
      @tap="updatePassword">UpdatePassword</button>
    </view>
  </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      emailAddress: '',
      oldPassword: '',
      newPassword: '',
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
    async updatePassword() {
      const tHIS = this;
      console.log('trying to change your password01...');
      console.log('for user email:' + tHIS.emailAddress);
      if (tHIS.newPassword != tHIS.reconfirmPassword) {
        uni.showToast({
          icon: 'none',
          title: 'Passwords don\'t match',
          duration: 2000,
        });
      } else {
        console.log('trying to change your password...');
        uni.request({
          url: getApp().globalData.base_url +
                        '/auth/user/updatepswd',
          data: {
            email: tHIS.emailAddress,
            old_password: tHIS.oldPassword,
            new_password: tHIS.newPassword,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
          },
          success: (res) => {
            if (res.statusCode == 200) {
              console.log('password changed successfully');
              uni.showToast({
                icon: 'none',
                title: 'Password reset successfully',
                duration: 2000,
              });
              uni.navigateBack();
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
