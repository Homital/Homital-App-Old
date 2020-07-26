<template>
  <view class="page">
    <uni-section title="Select in device type" type="line"></uni-section>
    <view class="combo-body">
      <uni-combox label="Type" labelWidth="50px" :candidates="choices"
      placeholder="Select" v-model="deviceType"
      emptyTips="Device type not supported"></uni-combox>
      <!-- <view class="result-box">
        <text>You have chosen：{{deviceType}}</text>
      </view> -->
    </view>
    <uni-section title="Name your device" type="line"></uni-section>
    <view class="input-body">
      <input v-model="deviceName" placeholder="Give it a name :>"
      type="text" class="example-body" />
    </view>
    <view class="add_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      v-bind:loading ='processingAdd'
      @tap="add_device">{{processingAdd == false? 'Add this device'
                :'adding device'}}</button>
    </view>
  </view>
</template>

<script>
import uniCombox from '@/components/uni-combox/uni-combox.vue';
import uniSection from '@/components/uni-section/uni-section.vue';
const auth = require('../../common/authorisation');
export default {
  components: {
    uniCombox,
    uniSection,
  },
  data() {
    return {
      choices: ['homital-light', 'homital-usb-adapter'],
      deviceType: '',
      deviceName: '',
      roomId: '',
      processingAdd: false,
    };
  },
  onShow() {
    this.roomId = getApp().globalData.room_switched_to_id;
  },
  methods: {
    async add_device() {
      const tHIS = this;
      tHIS.processingAdd = true;

      const url = getApp().globalData.base_url +
      `/user/rooms/devices?uid=${tHIS.roomId}`;
      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached add device');
            if (res.statusCode == 200) {
              console.log('successfully add device ' + tHIS.deviceName +
              ' of type: ' + tHIS.deviceType);
              // save info to be pushed to list, save time getting whole list
              getApp().globalData.device_added = tHIS.deviceName;
              getApp().globalData.device_type_added = tHIS.deviceType;
              tHIS.processingAdd = false;

              // go back to device list page
              uni.navigateBack();
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
            type: tHIS.deviceType,
            name: tHIS.deviceName,
          },
          'POST',
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
