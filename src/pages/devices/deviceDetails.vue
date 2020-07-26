<template>
  <view>
    <text class="example-info">Hi, {{username}}</text>
    <uni-section title="Device name" type="line"></uni-section>
    <uni-list>
      <uni-list-item :title="deviceName" rightText="change"
      @click= change_device_name />
    </uni-list>

    <uni-section title="Device Type" type="line"></uni-section>
    <uni-list>
      <uni-list-item :title="deviceType" />
    </uni-list>
    <view class="delete_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      @tap="delete_device">delete this device</button>
    </view>
  </view>
</template>

<script>
const auth = require('../../common/authorisation');
import uniSection from '@/components/uni-section/uni-section.vue';
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
  components: {
    uniSection,
    uniList,
    uniListItem,
  },
  data() {
    return {
      username: '',
      roomId: '',
      deviceName: '',
      deviceType: '',
    };
  },
  async onShow() {
    this.username = await uni.getStorageSync('userinfo');
    // get current room info
    this.roomId = getApp().globalData.room_switched_to_id;

    console.log('printing room_id attri on show: ' + this.roomId);

    this.deviceName = getApp().globalData.device_switched_to;
    this.deviceType = getApp().globalData.device_type_switched_to;
  },
  methods: {
    change_device_name() {
      getApp().globalData.room_switched_to_id = this.roomId;
      getApp().globalData.device_switched_to = this.deviceName;
      console.log('printing id before directing' +
      getApp().globalData.room_switched_to_id);
      uni.navigateTo({
        // params not used as there are some issues using onLoad
        url: `../devices/changeDeviceName`,
      });
    },
    async delete_device() {
      const tHIS = this;
      const url = getApp().globalData.base_url +
      `/user/rooms/devices?uid=${tHIS.roomId}&deviceName=${tHIS.deviceName}`;
      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached delete device');
            if (res.statusCode == 200) {
              console.log('successfully delete device '+tHIS.deviceName+
              ' for user: '+ tHIS.username);
              // tell room list page to regenerate room list
              getApp().globalData.request_room_list = true;
              // // go back to room list page
              // uni.navigateBack({delta: 2});
              getApp().globalData.request_room_list = true;
              uni.reLaunch({
                url: '../rooms/roomList',
              });
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
          {},
          'DELETE',
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

  view {
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
  }

  .example-body {
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
</style>
