<template>
  <view class="page">
    <uni-section title="Name your room" type="line"></uni-section>
    <view class="input-body">
      <input v-model="room" placeholder="Give it a name :>"
      type="text" class="example-body" />
    </view>
    <view class="add_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      @tap="add_room">Add room</button>
    </view>
  </view>
</template>

<script>
import uniSection from '@/components/uni-section/uni-section.vue';
const auth = require('../../common/authorisation');
export default {
  components: {
    uniSection,
  },
  data() {
    return {
      room: '',
      roomAdded: '',
      roomList: [],
      username: '',
    };
  },
  async onShow() {
    const tHIS = this;

    // get username
    this.username = await uni.getStorageSync('userinfo');
    console.log('after userinfo: ', tHIS.username);
  },
  methods: {
    async add_room() {
      console.log('trying to add your room...');
      const tHIS = this;

      // // add room name
      // const url = await getApp().globalData.base_url +
      // `/user/${tHIS.username}/rooms`;
      // // post
      // // given name & icon
      // auth.functions.makeAuthenticatedCall(
      //     (resData) => {
      //       console.log('reached resData on/off');
      //       console.log(resData);
      //       console.log(resData.success);
      //       if (resData.success) {
      //         tHIS.status = resData.status.power;
      //         tHIS.haha = tHIS.status ? 'primary' : 'default';
      //       } else {
      //         console.log('pos after ohhno howw');
      //         tHIS.notloggedin = true;
      //         uni.setStorageSync('notloggedin', true);
      //         uni.removeStorageSync('refresh_token');
      //         uni.removeStorageSync('userinfo');
      //         uni.showToast({
      //           icon: 'none',
      //           title: 'Your token has already expired. Please log in again.',
      //           duration: 2000,
      //         });
      //       }
      //     },
      //     getApp().globalData.base_url +
      //                   '/user/alice/livingroom/lamp',
      //     {},
      //     'GET',
      //     1,
      // );
      // uni.request({
      //   url: url,
      //   data: {
      //     name: tHIS.room,
      //     icon: '',
      //   },
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/json',
      //   },
      //   success: async (res) => {
      //     console.log('trying to add your room...');
      //     if (res.statusCode == 200) {
      //       console.log('room added successfully');
      //       uni.showToast({
      //         title: 'Your room ' + tHIS.room +
      //           ' is successfully added',
      //         duration: 2000,
      //       });
      //       getApp().globalData.room_temp = tHIS.room;
      //       console.log('printing to check stored room name' +
      // getApp().globalData.room_temp);
      //       uni.navigateBack();
      //     } else {
      //       console.log('room not added with error : ' + res.data.error);
      //       tHIS.error = res.data.error;
      //       uni.showToast({
      //         icon: 'none',
      //         title: res.data.error,
      //         duration: 2000,
      //       });
      //     }
      //   },
      // });


      // if not ready
      // uni.setStorage({
      //   key: `${tHIS.username}_roomAdded`,
      //   data: tHIS.room,
      //   success() {
      //     console.log('printing to check stored room name' +
      // uni.getStorageSync(
      //     `${tHIS.username}_roomAdded`));
      //     uni.navigateBack({
      //       delta: 1,
      //     });
      //   },
      // });

      // console.log('printing room name ' + tHIS.room);
      // tHIS.roomAdded =
      // uni.setStorageSync(`${tHIS.username}_roomAdded`, tHIS.room);
      // console.log('printing to check stored room name' +
      // uni.getStorageSync(
      //     `${tHIS.username}_roomAdded`));
      // await uni.showToast({
      //   title: 'room added successfully',
      //   duration: 2000,
      // });
      // uni.navigateBack();

      getApp().globalData.room_temp = tHIS.room;
      console.log('printing to check stored room name' +
      getApp().globalData.room_temp);
      uni.navigateBack();
    },
  },
};
</script>

<style>
  /* #ifndef APP-NVUE */
  page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: #efeff4;
    min-height: 100%;
    height: auto;
  }

  /* view {
    font-size: 14px;
    line-height: inherit;
  }

  .example {
    padding: 0 15px 15px;
  }

  .example-info {
    padding: 15px;
    color: #3b4144;
    background: #ffffff;
  } */

  .combo-body {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
    font-size: 14px;
    background-color: #ffffff;
  }

  /* #endif */
  .example {
    padding: 0 15px;
  }

  .example-info {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    padding: 15px;
    color: #3b4144;
    background-color: #ffffff;
    font-size: 14px;
    line-height: 20px;
  }

  .example-info-text {
    font-size: 14px;
    line-height: 20px;
    color: #3b4144;
  }


  .example-body {
    flex-direction: column;
    padding: 15px;
    background-color: #ffffff;
  }

  .word-btn-white {
    font-size: 18px;
    color: #FFFFFF;
  }

  .word-btn {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    height: 48px;
    margin: 15px;
    background-color: #007AFF;
  }

  .word-btn--hover {
    background-color: #4ca2ff;
  }


  .input-body {
    padding: 10px 12px;
    background-color: #FFFFFF;
  }

  .result-box {
    text-align: center;
    padding: 0px 0px;
    font-size: 16px;
  }
</style>
