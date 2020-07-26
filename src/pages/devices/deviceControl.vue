/* eslint-disable max-len */
<template>
  <view>
    <uni-section title="Device name" type="line"></uni-section>
    <uni-list>
      <uni-list-item :title="deviceName" rightText="view/edit"
      @click= edit_device />
    </uni-list>

    <uni-section title="Operation List" type="line"></uni-section>
    <uni-list>
      <uni-list-item
          v-for="(item, index) in operationList" :title="item.title"
          :key="index"
          rightText="view" :show-extra-icon="true"
      :extra-icon="extraIcon1"
      :show-switch="true"
      @switchChange="switchChange"/>
      <!-- <uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1"
      title="User1" note="Role: admin" rightText="view"/>
      <uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1"
      title="User2" note="Role: admin" rightText="view" /> -->
<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1"
:show-switch="true" :showArrow="false" :switchChecked="currentStatus"
title="Switch" @switchChange="switchChange" />
      <!-- <uni-list-item title="Add new operation" @click=add_operation /> -->
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
      deviceName: '',
      roomId: '',
      operationName: '',
      extraIcon1: {
        color: '#007aff',
        size: '22',
        type: 'gear-filled',
      },
      operationList: [],
      currentStatus: '', // false if status off, true if status on
    };
  },
  async onShow() {
    const tHIS = this;
    // get current room info
    console.log('print id @global on show ' +
    getApp().globalData.room_switched_to_id);
    this.deviceName = getApp().globalData.device_switched_to;
    this.roomId = getApp().globalData.room_switched_to_id;

    console.log('printing room_id attri on show: ' + this.roomId);

    // getting current Status
    const url = getApp().globalData.base_url+
    `/device/status?uid=${this.roomId}&devicename=${tHIS.deviceName}`;

    await uni.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        'Authorization': 'Bearer homital',
      },
      success: async (res) => {
        if (res.statusCode == 200) {
          if (res.data != null) {
            console.log('successfully obtained status for '+tHIS.deviceName);
            tHIS.currentStatus = res.data.power;
          } else {
            tHIS.currentStatus = false;
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: res.data.error,
            duration: 2000,
          });
        }
      },
    });
  },
  methods: {
    edit_device() {
      getApp().globalData.room_switched_to_id = this.roomId;
      console.log('printing id before directing' +
      getApp().globalData.room_switched_to_id);
      uni.navigateTo({
        // params not used as there are some issues using onLoad
        url: `../devices/changeDeviceName`,
      });
    },
    async delete_device() {
      const tHIS = this;
      const url = getApp().globalData.base_url+
      `/user/rooms/devices?uid=${this.roomId}&devicename=${tHIS.deviceName}`;

      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached delete device');
            if (res.statusCode == 200) {
              console.log('successfully delete device '+tHIS.deviceName);
              // tell room list page to regenerate room list
              getApp().globalData.request_device_list = true;
              // // go back to room list page
              // uni.navigateBack({delta: 1});
              // uni.navigateBack();
              uni.reLaunch({
                url: '../devices/deviceList',
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
    async add_member() {
      getApp().globalData.room_switched_to_id = this.roomId;
      console.log('printing id @ add member' +
      getApp().globalData.room_switched_to_id);
      uni.navigateTo({
        // list param not used
        url: `../user/addUser`,
      });
    },
    async switchChange(e) {
      const tHIS = this;
      uni.showToast({
        title: 'change:' + e.value,
        icon: 'none',
      });
      // if e true, then turn on, else turn off
      // or if
      if (!this.currentStatus) {
        console.log('trying to turn on...');

        const id = this.roomId;
        console.log('printing id before url' + id);

        const url = getApp().globalData.base_url +
        `/user/rooms/devices/operations?uid=${this.roomId}&devicename=${tHIS.deviceName}&operation=switch`;

        await auth.functions.makeAuthenticatedCall(
            async (res) => {
              console.log('reached turn on');
              if (res.statusCode == 200) {
                console.log('successfully turn on '+tHIS.deviceName);
                tHIS.currentStatus = true;
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
              // eslint-disable-next-line quotes
              switch: "on",
              at: '',
            },
            'POST',
        );
      } else {
        console.log('trying to turn off...');
        const url = getApp().globalData.base_url +
        `/user/rooms/devices/operations?uid=${this.roomId}&devicename=${tHIS.deviceName}&operation=switch`;

        await auth.functions.makeAuthenticatedCall(
            async (res) => {
              console.log('reached turn off');
              if (res.statusCode == 200) {
                console.log('successfully turn off '+tHIS.deviceName);
                tHIS.currentStatus = false;
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
              // eslint-disable-next-line quotes
              switch: "off",
              at: '',
            },
            'POST',
        );
      }
    },
    // to be editted
    switchChangeEditted(e) {
      console.log('click triggered');
      console.log('e.value is:' + e.value);
      uni.showToast({
        title: 'change:' + e.value,
        icon: 'none',
      });
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
