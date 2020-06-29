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
                :'logging in in progress'}}</button>
                <button type="primary"
                style="width:80%;margin-bottom:20px;"
                @tap="_register">Register</button>
            </view>
            <!-- <view class="inputArea">
                <text style="float:right;color:blue;"
                @click="_register">>>Or register here>></text>
            </view>-->
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
            console.log('this.email' + tHIS.email);
            console.log('this.username' + tHIS.username);
            if (res.data.success) {
              tHIS.valid = true;
              tHIS.refresh_token = res.data.refresh_token;
              uni.setStorageSync('refresh_token', tHIS.refresh_token);
              uni.setStorageSync('userinfo', tHIS.username);
              uni.setStorageSync('notloggedin', false);
              console.log('login success set, notloggedin =',
                  uni.getStorageSync('notloggedin'));
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
                    uni.setStorageSync('refresh_token', tHIS.refresh_token);
                    uni.setStorageSync('userinfo', tHIS.username);
                    uni.setStorageSync('notloggedin', false);
                    console.log('login success set, notloggedin =',
                        uni.getStorageSync('notloggedin'));
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
    //   async getDataOnLogin() {
    //     let roomListObtained = false;
    //     const tHIS = this;
    //     // to get this user's list of rooms
    //     const listUrl =
    //     getApp().globalData.base_url + `/user/${this.username}/rooms`;
    //     await uni.request({
    //       url: listUrl,
    //       data: {
    //       },
    //       method: 'GET',
    //       success: async (res) => {
    //         console.log('successfully obtain list of rooms for user: ' +
    //        tHIS.username);
    //         if (!res.data.success) {
    //           tHIS.displayList = true;
    //           const dbList = res.data;

  //           for (let i = 0; i < dbList; i++) {
  //             const object = dbList[i];
  //             const roomname = object.getString('name');
  //             await tHIS.roomList.push({
  //               url: `/static/c${this.dynamicList.length+1}.png`,
  //               text: `${roomname}`,
  //               color: this.dynamicList.length % 2 === 0 ? '#f5f5f5' : '#fff',
  //             });
  //           }
  //           if (tHIS.roomList[0]['name'] == undefined) {
  //             console.log('reached cond roomList[0]["name"] == undefined');
  //             tHIS.dynamicList = [];
  //             await uni.setStorageSync(`${tHIS.username}_roomList`, []);
  //           } else {
  //           // store room list
  //             uni.setStorage(`${tHIS.username}_roomList`, tHIS.roomList);
  //             console.log('obtain list success, device list =',
  //                 uni.getStorageSync(`${tHIS.username}_roomList`));
  //           }
  //           roomListObtained = true;
  //         } else {
  //           tHIS.displayList = false;
  //           tHIS.error = res.data.error;
  //           uni.showToast({
  //             icon: 'none',
  //             title: tHIS.error,
  //             duration: 2000,
  //           });
  //         }
  //       },
  //     });
  //     if (roomListObtained) {
  //       // if gotten list, then get device list for every room
  //       // actually should i do this here?
  //     }
  //   },
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
