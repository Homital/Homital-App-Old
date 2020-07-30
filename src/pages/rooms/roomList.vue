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
  <view class="warp">
    <text class="example-info">Click to control your devices</text>
    <uni-section :title="`${username}'s home`" type="line"></uni-section>
        <view class="example-body">
    <!-- <view v-if="displayList!=null&&!displayList" class="example-body"> -->
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
const auth = require('../../common/authorisation');
export default {
  components: {
    uniSection,
    uniGrid,
    uniGridItem,
    uniCard,
  },
  data() {
    return {
      roomList: [],
      username: '',
      displayList: null,
      notloggedin: null,
      roomAdded: '',
      roomIdAdded: '',
      roomRoleAdded: '',
    };
  },
  async onShow() {
    const tHIS = this;
    tHIS.notloggedin = null;
    tHIS.displayList = null;

    // get username for xx' room
    this.username = await uni.getStorageSync('userinfo');

    console.log('checking account status');
    console.log('before' + tHIS.notloggedin);
    tHIS.notloggedin = getApp().globalData.notloggedin;
    console.log('after' + tHIS.notloggedin);

    if (!tHIS.notloggedin) {
    // get room list, if request_room_list set to true
    //   console.log('request_room_list set to true' +
    // getApp().globalData.request_room_list);
      // if (getApp().globalData.request_room_list) {
      tHIS.roomList = [];
      console.log('trying to get room list...');
      const listUrl = getApp().globalData.base_url + `/user/rooms`;
      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached get room list');
            if (res.statusCode == 200) {
              console.log('successfully obtain list of rooms for user: ' +
         tHIS.username);
              const dbList = res.data;
              console.log('dbList length is ' + dbList.length);
              for (let i = 0; i < dbList.length; i++) {
                const object = dbList[i];
                const roomname = object['name'];
                console.log('printing room names' + roomname);
                const roomId = object['uid'];
                const role = object['role'];
                console.log('printing room id: ' + roomId);
                await tHIS.roomList.push({
                  url: `/static/c${tHIS.roomList.length+1}.png`,
                  text: roomname,
                  color: tHIS.roomList.length % 2 === 0 ? '#f5f5f5' : '#fff',
                  room_id: roomId,
                  role: role,
                });
              }
              // store the list for future use
              getApp().globalData.room_list = tHIS.roomList;
              // next time no need to get from db, unless did delete
              getApp().globalData.request_room_list = false;
              // wait until this to display the list? or not?
              tHIS.displayList = true;
            } else {
              // display error in getting list from db
              tHIS.displayList = false;
              uni.showToast({
                icon: 'none',
                title: res.data.error,
                duration: 2000,
              });
              console.log(res.data.error);
            }
          },
          listUrl,
          {},
          'GET',
      ); // finish get request
      // } else {
      //   // if no need to request, get directly
      //   this.roomList = getApp().globalData.room_list;
      // }


      // check if a new room was just added
      // if (getApp().globalData.room_added != '') {
      //   console.log('yes a new room was just added:)');
      //   // tHIS.roomAdded = uni.getStorageSync(`${tHIS.username}_roomAdded`);
      //   tHIS.roomAdded = getApp().globalData.room_added;
      //   tHIS.roomIdAdded = getApp().globalData.room_id_added;
      //   tHIS.roomRoleAdded = getApp().globalData.room_role_added;
      //   await tHIS.roomList.push({
      //     url: `/static/c${this.roomList.length+1}.png`,
      //     text: `${tHIS.roomAdded}`,
      //     color: tHIS.roomList.length % 2 === 0 ? '#f5f5f5' : '#fff',
      //     room_id: tHIS.roomIdAdded,
      //     role: tHIS.roomRoleAdded,
      //   });
      //   getApp().globalData.room_added = '';
      //   getApp().globalData.room_id_added = '';
      //   getApp().globalData.room_role_added = '';
      //   // update 'global' room list
      //   getApp().globalData.room_list = tHIS.roomList;
      //   // again, not sure if i should use this display thing
      //   tHIS.displayList = true;
      // }
    }
  },
  methods: {
    change(e) {
      let {
        // eslint-disable-next-line prefer-const
        index,
      } = e.detail;
      // this.roomList[index].badge && this.roomList[index].badge++;

      const roomClicked = this.roomList[index]['text'];
      const roomClickedId = this.roomList[index]['room_id'];
      const roomClickedRole = this.roomList[index]['role'];

      uni.showToast({
        title: `Click to view room ${roomClicked}`,
        icon: 'none',
      });


      getApp().globalData.room_switched_to = roomClicked;
      getApp().globalData.room_switched_to_id = roomClickedId;
      getApp().globalData.room_switched_to_role = roomClickedRole;

      console.log('printing roomClicked id @change ' + roomClickedId);
      console.log('printing id @ change ' +
      getApp().globalData.room_switched_to_id);


      // navigate to device list page
      uni.navigateTo({
        // list param not used
        url: `../devices/deviceList?room=${roomClicked}&list=roomList`,
      });

      // redirect to device list page
      // uni.redirectTo({
      //   url: `../devices/deviceList?room=${roomClicked}&list=roomList`,
      // });
    },
    add() {
      const tHIS = this;
      console.log('tHIS.roomList.length is ' + tHIS.roomList.length);
      // first navigate to add room page
      uni.navigateTo({
        url: `./roomAdd`,
        success: async (res) => {
          // should i use setStorage & getStorage
          // tHIS.roomList =
          // await uni.getStorageSync(`${tHIS.username}_roomList`);
        },
        fail: () => {},
        complete: () => {
        },
      });
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
