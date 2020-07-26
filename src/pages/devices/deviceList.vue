<template>
    <view>
        <!-- <view class="uni-padding-wrap uni-common-mt">
            <view v-if="notloggedin != null && notloggedin">
                <uni-card
                    title="Log in"
                    mode="title"
                    :is-shadow="true"
                    @click="_directToLogin"
                >Log in to check and control your devices.</uni-card>
            </view>
        </view> -->
<!-- <view v-if="notloggedin != null && !notloggedin &&
displayList != null && !displayList"> -->

<!-- <view v-if="notloggedin != null && !notloggedin "> -->

  <view>
  <view class="warp">
    <!-- <text class="example-info">Click to control your devices</text> -->
    <uni-section :title="`${username}'s ${roomName}`" type="line"></uni-section>
    <view class="example-body">
      <view v-if="deviceList.length!==0" class="grid-dynamic-box">
        <uni-grid :column="3" :highlight="true" @change="change">
          <uni-grid-item
          v-for="(item, index) in deviceList" :index="index" :key="index">
            <view class="grid-item-box" :style="{'backgroundColor':item.color}">
              <image :src="item.url" class="image" mode="aspectFill" />
              <text class="text">{{ item.text }}</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>
      <button type="primary" @click="add">Add device</button>
    </view>
  </view>
  </view>
        <!-- <view class="reg_button">
      <button style="width:90%;margin-bottom:20px;"
      type="primary"
      @tap="deleteRoom">delete this room</button>
    </view> -->
                        <view class="input">
      <!-- style="float:right;color:blue;" -->
            <text style="width:80%;margin-top:20px;margin-bottom:20px;"
      @click="_getRoomDetails">Click to view room details</text>
    </view>
</view>
</template>

<script>
import uniSection from '@/components/uni-section/uni-section.vue';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
const auth = require('../../common/authorisation');
export default {
  components: {
    uniSection,
    uniGrid,
    uniGridItem,
  },
  data() {
    return {
      deviceList: [],
      username: '',
      deviceAdded: '',
      roomName: 'room',
      roomId: '',
      roomRole: '',
    };
  },
  async onShow() {
    const tHIS = this;
    tHIS.notloggedin = null;
    tHIS.displayList = null;

    // get username
    this.username = await uni.getStorageSync('userinfo');
    console.log('after userinfo: ', tHIS.username);

    console.log('print id @global on show ' +
    getApp().globalData.room_switched_to_id);
    this.roomName = getApp().globalData.room_switched_to;
    this.roomId = getApp().globalData.room_switched_to_id;
    this.roomRole = getApp().globalData.room_switched_to_role;

    // get device list
    // console.log('request_device_list set to true' +
    // getApp().globalData.request_device_list);
    // if (getApp().globalData.request_device_list) {
    tHIS.deviceList = [];
    console.log('trying to get device list...');
    const listUrl = getApp().globalData.base_url +
      `/user/rooms/devices?uid=${this.roomId}`;
    await auth.functions.makeAuthenticatedCall(
        async (res) => {
          console.log('reached get device list');
          if (res.statusCode == 200) {
            console.log('successfully obtain list of devices for user: ' +
         tHIS.username);
            const dbList = res.data;
            console.log('dbList length is ' + dbList.length);
            for (let i = 0; i < dbList.length; i++) {
              const object = dbList[i];
              const deviceName = object['name'];
              console.log('printing device names' + deviceName);
              const type = object['type'];
              console.log('printing device types: ' + type);
              await tHIS.deviceList.push({
                url: `/static/c${tHIS.deviceList.length+1}.png`,
                text: deviceName,
                color: tHIS.deviceList.length % 2 === 0 ? '#f5f5f5' : '#fff',
                type: type,
              });
            }
            // next time no need to get from db, unless did delete
            getApp().globalData.request_device_list = false;
          } else if (res.statusCode == 500) {
            tHIS.deviceList = [];
          } else {
            uni.showToast({
              icon: 'none',
              title: res.data.error,
              duration: 2000,
            });
          }
        },
        listUrl,
        {},
        'GET',
    ); // finish get request
    // }


    // check if a new device was just added
    // if (getApp().globalData.device_added != '') {
    //   console.log('yes a new device was just added:)');
    //   tHIS.deviceAdded = getApp().globalData.device_added;
    //   tHIS.deviceTypeAdded = getApp().globalData.device_type_added;
    //   await tHIS.deviceList.push({
    //     url: `/static/c${this.deviceList.length+1}.png`,
    //     text: `${tHIS.deviceAdded}`,
    //     color: tHIS.deviceList.length % 2 === 0 ? '#f5f5f5' : '#fff',
    //     type: tHIS.deviceTypeAdded,
    //   });
    //   getApp().globalData.device_added = '';
    //   getApp().globalData.device_type_added = '';
    // }
  },
  methods: {
    change(e) {
      let {
        // eslint-disable-next-line prefer-const
        index,
      } = e.detail;

      // const deviceClicked = this.roomList[index]['text'];
      // const roomClickedId = this.roomList[index]['room_id'];
      // const roomClickedRole = this.roomList[index]['role'];

      // uni.showToast({
      //   title: `Click to view room ${roomClicked}`,
      //   icon: 'none',
      // });


      // getApp().globalData.room_switched_to = roomClicked;
      // getApp().globalData.room_switched_to_id = roomClickedId;
      // getApp().globalData.room_switched_to_role = roomClickedRole;

      // console.log('printing roomClicked id @change ' + roomClickedId);
      // console.log('printing id @ change ' +
      // getApp().globalData.room_switched_to_id);


      // // // navigate to device list page, or redirect?
      // uni.navigateTo({
      //   // list param not used
      //   url: `../index/index?room=${deviceClicked}&list=roomList`,
      // });

      // //redirect to device list page
      // uni.redirectTo({
      //   url: `../devices/deviceList?room=${roomClicked}&list=roomList`,
      // });

      const deviceClicked = this.deviceList[index]['text'];
      const deviceTypeClicked = this.deviceList[index]['type'];

      getApp().globalData.device_switched_to = deviceClicked;
      getApp().globalData.device_type_switched_to = deviceTypeClicked;

      uni.showToast({
        title: `Click to view device ${deviceClicked}`,
        icon: 'none',
      });

      // direct to device details page
      uni.redirectTo({
        url: `../devices/deviceControl`,
      });
    },
    add() {
      const tHIS = this;
      console.log('tHIS.deviceList.length is ' + tHIS.deviceList.length);
      if (tHIS.deviceList.length < 9) {
        // first navigate to add device page
        uni.navigateTo({
          // list param not used
          url: `./deviceAdd`,
        });
      } else {
        uni.showToast({
          title: 'Maximum of 9 devices is allowed in this device',
          icon: 'none',
        });
      }
    },
    del() {
      this.deviceList.splice(this.deviceList.length - 1, 1);
    },
    _getRoomDetails() {
      const tHIS = this;
      // console.log('trying to navigate...');
      // getApp().globalData.room_switched_to = this.room;
      // getApp().globalData.room_switched_to_id = this.room_id;
      // navigate to room details page
      uni.navigateTo({
        // list param not used
        url: `../rooms/roomDetails?room=${tHIS.room}&list=roomList`,
        success: async (res) => {
          // tHIS.roomList =
          //   await uni.getStorageSync(`${tHIS.username}_roomList`);
        },
        fail: () => {},
        complete: () => {
        },
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


  .image {
    width: 50rpx;
    height: 50rpx;
  }

  .text {
    font-size: 26rpx;
    margin-top: 10rpx;
  }

  .example-body {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
  }

  .grid-dynamic-box {
    margin-bottom: 15px;
  }

  .grid-item-box {
    flex: 1;
    /* position: relative;
 */
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }

  .grid-dot {
    position: absolute;
    top: 5px;
    right: 15px;
  }

  .swiper {
    height: 420px;
  }
</style>
