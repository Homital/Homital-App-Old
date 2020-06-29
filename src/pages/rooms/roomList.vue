<template>
    <view>
        <view class="uni-padding-wrap uni-common-mt">
            <view v-if="notloggedin != null && notloggedin">
                <uni-card
                    title="Log in"
                    mode="title"
                    :is-shadow="true"
                    @click="_directToLogin"
                >Log in to check and control your devices.</uni-card>
            </view>
        </view>

<!-- <view v-if="notloggedin != null && !notloggedin &&
displayList != null && !displayList"> -->

<view v-if="notloggedin != null && !notloggedin">

  <!-- <view> -->
  <view class="warp">
    <!-- <text class="example-info">Click to control your devices</text> -->
    <uni-section :title="`${username}'s home`" type="line"></uni-section>
    <view class="example-body">
      <view v-if="roomList.length!==0" class="grid-dynamic-box">
        <uni-grid :column="3" :highlight="true" @change="change">
          <uni-grid-item
          v-for="(item, index) in roomList" :index="index" :key="index">
            <view class="grid-item-box" :style="{'backgroundColor':item.color}">
              <image :src="item.url" class="image" mode="aspectFill" />
              <text class="text">{{ item.text }}</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>
      <button type="primary" @click="add">Add room</button>
    </view>
  </view>
  </view>
</view>
</template>

<script>
import uniSection from '@/components/uni-section/uni-section.vue';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import uniCard from '@/components/uni-card/uni-card.vue';
// import uniBadge from '@/components/uni-badge/uni-badge.vue';
// const auth = require('../../common/authorisation');
export default {
  components: {
    uniSection,
    uniGrid,
    uniGridItem,
    uniCard,
    // uniBadge,
  },
  data() {
    return {
      roomList: [],
      username: '',
      displayList: null,
      notloggedin: null,
      roomAdded: '',
    };
  },
  async onShow() {
    const tHIS = this;
    tHIS.notloggedin = null;
    tHIS.displayList = null;

    // get username
    this.username = await uni.getStorageSync('userinfo');
    console.log('after userinfo: ', tHIS.username);

    // check if a new room was just added

    // tHIS.roomAdded = uni.getStorageSync(`${tHIS.username}_roomAdded`);
    tHIS.roomAdded = getApp().globalData.room_temp;
    console.log('printing name of temp room added ' +
    getApp().globalData.room_temp);

    tHIS.roomList = getApp().globalData.room_list;

    if (tHIS.roomList == undefined) {
      tHIS.roomList = [];
    }

    console.log('checking account status');
    console.log('before' + tHIS.notloggedin);
    tHIS.notloggedin = uni.getStorageSync('notloggedin');
    console.log('after' + tHIS.notloggedin);


    if (tHIS.roomAdded != '') {
      await tHIS.roomList.push({
        url: `/static/c${this.roomList.length+1}.png`,
        text: `${tHIS.roomAdded}`,
        color: this.roomList.length % 2 === 0 ? '#f5f5f5' : '#fff',
      });
      // uni.setStorageSync(`${tHIS.username}_roomAdded`, '');
      getApp().globalData.room_list = tHIS.roomList;
      tHIS.displayList = true;
    }
  },
  // async onLaunch() {
  //   // to get this user's list of rooms
  //   this.roomList = getApp().globalData.device_temp;
  //   const listUrl =
  //     getApp().globalData.base_url + `/user/${this.username}/rooms`;
  //   await uni.request({
  //     url: listUrl,
  //     data: {
  //     },
  //     method: 'GET',
  //     success: async (res) => {
  //       console.log('successfully obtain list of rooms for user: ' +
  //        tHIS.username);
  //       if (res.statusCode == 200) {
  //         tHIS.displayList = true;
  //         const dbList = res.data;
  //         for (let i = 0; i < dbList; i++) {
  //           const object = dbList[i];
  //           const roomname = object.getString('name');
  //           console.log('printing name of room ' + roomname);
  //           await tHIS.roomList.push({
  //             url: `/static/c${tHIS.roomList.length+1}.png`,
  //             text: `${roomname}`,
  //             color: tHIS.roomList.length % 2 === 0 ? '#f5f5f5' : '#fff',
  //           });
  //         }
  //         if (tHIS.roomList == undefined) {
  //           tHIS.roomList = [];
  //         }
  //       } else {
  //         tHIS.displayList = false;
  //         tHIS.error = res.data.error;
  //         uni.showToast({
  //           icon: 'none',
  //           title: tHIS.error,
  //           duration: 2000,
  //         });
  //       }
  //     },
  //   });
  //   console.log('STAR STAR printing room list' + tHIS.roomList);

  //   if (tHIS.roomList == undefined || tHIS.roomList.length == 0
  //   // || (tHIS.roomList.length != 0 &&
  //   // tHIS.roomList[0]['text'] == undefined)
  //   ) {
  //     console.log('reached cond tHIS.roomList == undefined');
  //     tHIS.roomList = [];
  //     tHIS.displayList = true;
  //   }
  // },
  methods: {
    change(e) {
      let {
        index,
      } = e.detail;
      // this.roomList[index].badge && this.roomList[index].badge++;

      const roomClicked = this.roomList[index]['text'];

      uni.showToast({
        title: `Click to view room ${roomClicked}`,
        icon: 'none',
      });

      // direct to device list page
      uni.redirectTo({
        url: `../devices/deviceList?room=${roomClicked}&list=roomList`,
      });
    },
    add() {
      const tHIS = this;
      console.log('tHIS.roomList.length is ' + tHIS.roomList.length);
      if (tHIS.roomList.length < 9) {
        // first navigate to add room page
        uni.navigateTo({
          // list param not used
          url: `./roomAdd`,
          success: async (res) => {
            tHIS.roomList =
            await uni.getStorageSync(`${tHIS.username}_roomList`);
          },
          fail: () => {},
          complete: () => {
          },
        });


        // do this if successful ??how to tell add success or not though
        // maybe this dynamic list should be in global data??
        // or is it in cache
        // ie on success do...

        // this.roomList.push({
        //   url: `/static/c${this.roomList.length+1}.png`,
        //   text: `Device ${this.roomList.length+1}`,
        //   color: this.roomList.length % 2 === 0 ? '#f5f5f5' : '#fff',
        // });
      } else {
        uni.showToast({
          title: 'Maximum of 9 rooms is allowed in this room',
          icon: 'none',
        });
      }
    },
    del() {
      this.roomList.splice(this.roomList.length - 1, 1);
    },
    _directToLogin() {
      console.log('directing...');
      uni.navigateTo({
        url: '../login/login',
        success: (res) => {
          console.log('suc');
        },
        fail: () => {
          console.log('fal');
        },
        complete: () => {},
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
