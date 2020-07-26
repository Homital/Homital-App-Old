<template>
  <view class="page">
    <uni-section title="Name your device" type="line"></uni-section>
    <view class="input-body">
      <input v-model="newDeviceName" placeholder="Give it a new name :>"
      type="text" class="example-body" />
    </view>
    <view class="add_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      @tap="change_device_name">Change name</button>
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
      newDeviceName: '',
      roomId: '',
      oldDeviceName: '',
    };
  },
  async onShow() {
    // if (getApp().globalData.room_switched_to_id != '') {
    console.log('just switched');
    this.roomId = getApp().globalData.room_switched_to_id;
    this.oldDeviceName = getApp().globalData.device_switched_to;

    getApp().globalData.request_device_list = true;
    // getApp().globalData.room_switched_to_id = '';
    // getApp().globalData.room_list = [];
    console.log('checking room id gotten @ change device Name:' + this.roomId);
    // }
  },
  methods: {
    async change_device_name() {
      console.log('trying to change your device name...');
      const tHIS = this;

      // add device name
      const url = await getApp().globalData.base_url +
      `/user/rooms/devices?uid=${tHIS.roomId}`;

      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached update device');
            console.log('request successful: ' + res.statusCode == 200);
            if (res.statusCode == 200) {
              console.log('successfully update device ');
              uni.showToast({
                icon: 'none',
                title: 'Device name changed successfully',
                duration: 2000,
              });
              getApp().globalData.device_switched_to = tHIS.newDeviceName;
              getApp().globalData.request_device_list = true;
              // // try relaunch since room list not updated
              uni.navigateBack({delta: 2});
              // uni.reLaunch({
              //   url: '../devices/deviceList',
              // });
            } else {
              tHIS.error = res.data.error;
              uni.showToast({
                icon: 'none',
                title: tHIS.error,
                duration: 2000,
              });
            }
          },
          url,
          {
            old_name: tHIS.oldDeviceName,
            new_name: tHIS.newDeviceName,
          },
          'PUT',
      );
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
