<template>
  <view class="page">
    <uni-section title="Type in device type" type="line"></uni-section>
    <view class="combo-body">
      <uni-combox label="Device Type" labelWidth="150px" :candidates="choices"
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
      @tap="add_device">Add this device</button>
    </view>
  </view>
</template>

<script>
import uniCombox from '@/components/uni-combox/uni-combox.vue';
import uniSection from '@/components/uni-section/uni-section.vue';
export default {
  components: {
    uniCombox,
    uniSection,
  },
  data() {
    return {
      choices: ['lamp', 'plug', '...'],
      deviceType: '',
      deviceName: '',
      room: '',
    };
  },
  onLoad: (valFromDeviceList) => {
    // eslint-disable-next-line no-invalid-this
    const tHIS = this;
    tHIS.room = valFromDeviceList.room;
    console.log('valFromDeviceList.room = ' + valFromDeviceList.room);
  },
  methods: {
    add_device() {
      const tHIS = this;

      // // add device name
      // const url = getApp().globalData.base_url +
      // `/user/${tHIS.username}/rooms/${tHIS.room}/devices`;
      // // post
      // // given deviceType & deviceName
      // uni.request({
      //   url: url,
      //   data: {
      //     type: deviceType,
      //     name: deviceName,
      //     room: room,
      //   },
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/json',
      //   },
      //   success: (res) => {
      //     if (res.statusCode == 200) {
      //       uni.showToast({
      //         title: 'Your device ' + tHIS.deviceName +
      //           ' is successfully added',
      //         duration: 2000,
      //       });
      //       getApp().globalData.device_temp = tHIS.deviceName;
      //       console.log('printing to check stored temp name' +
      // getApp().globalData.device_temp);
      //       uni.navigateBack();
      //     } else {
      //       tHIS.error = res.data.error;
      //       uni.showToast({
      //         icon: 'none',
      //         title: res.data.error,
      //         duration: 2000,
      //       });
      //     }
      //   },
      // });
      getApp().globalData.device_temp = tHIS.deviceName;
      console.log('printing to check stored device name' +
      getApp().globalData.device_temp);
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
