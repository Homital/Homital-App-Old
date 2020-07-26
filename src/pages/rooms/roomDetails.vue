<template>
  <view>
    <text class="example-info">You are {{roomRole}} of this room</text>
    <uni-section title="Room name" type="line"></uni-section>
    <uni-list>
      <uni-list-item :title="roomName" rightText="change"
      @click= change_room_name />
    </uni-list>

    <uni-section title="User List" type="line"></uni-section>
    <uni-list>
      <uni-list-item
          v-for="(item, index) in memberList"
          :index="index"
          :title="`Member: ${item.title}`"
          :note="`Role: ${item.role}`" :key="index"
          rightText="view" :show-extra-icon="true"
      :extra-icon="extraIcon1"
      @click=edit_member(index)
      />
      <!-- <uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1"
      title="User1" note="Role: admin" rightText="view"/>
      <uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1"
      title="User2" note="Role: admin" rightText="view" /> -->
      <uni-list-item title="Add More User" @click=add_member />
    </uni-list>
    <view class="delete_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      @tap="delete_room">delete this room</button>
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
      roomName: '',
      roomId: '',
      roomRole: '',
      extraIcon1: {
        color: '#007aff',
        size: '22',
        type: 'gear-filled',
      },
      userList: [{title: 'test1', role: 't01'},
        {title: 'test2', role: 't02'}],
      memberList: [],
      // funcCall: edit_member(),
    };
  },
  async onShow() {
    const tHIS = this;
    // get current room info
    console.log('print id @global on show ' +
    getApp().globalData.room_switched_to_id);
    this.roomName = getApp().globalData.room_switched_to;
    this.roomId = getApp().globalData.room_switched_to_id;
    this.roomRole = getApp().globalData.room_switched_to_role;

    console.log('printing room_id attri on show: ' + this.roomId);

    // on second thought, maybe no need to set back
    // getApp().globalData.room_switched_to = '';
    // getApp().globalData.room_switched_to_id = '';

    // if (getApp().globalData.member_changed) {
    // to get user list
    tHIS.memberList = [];
    console.log('trying to get member list...');
    const listUrl =
    getApp().globalData.base_url + `/user/rooms/members?uid=${this.roomId}`;
    await auth.functions.makeAuthenticatedCall(
        async (res) => {
          console.log('reached get room list');
          if (res.statusCode == 200) {
            console.log('successfully obtain list of members for room');
            const dbList = res.data;
            console.log('dbList[0].name is ' + dbList[0].username);
            for (let i = 0; i < dbList.length; i++) {
              const object = dbList[i];
              const memberName = object['username'];
              const role = object['role'];
              console.log('printing member of room ' + memberName);
              await tHIS.memberList.push({
                title: memberName,
                role: role,
              });
            }
            // if no room is added yet and db give back nothing
            if (tHIS.memberList == undefined) {
              tHIS.memberList = [];
            }
          } else {
            tHIS.error = res.data.error;
            uni.showToast({
              icon: 'none',
              title: tHIS.error,
              duration: 2000,
            });
          }
        },
        listUrl,
        {},
        'GET',
    ); // finish get request
    // getApp().globalData.member_changed = false;
  },
  methods: {
    change_room_name() {
      const tHIS = this;
      getApp().globalData.room_switched_to_id = this.roomId;
      console.log('printing id before directing' +
      getApp().globalData.room_switched_to_id);
      uni.navigateTo({
        // params not used as there are some issues using onLoad
        url: `../rooms/changeRoomName?room=${tHIS.roomName}&list=roomList`,
      });
    },
    async delete_room() {
      const tHIS = this;
      const url = getApp().globalData.base_url+`/user/rooms?uid=${tHIS.roomId}`;
      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached delete room');
            if (res.statusCode == 200) {
              console.log('successfully delete room '+tHIS.room+' for user: '+
         tHIS.username);
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
    async add_member() {
      getApp().globalData.room_switched_to_id = this.roomId;
      console.log('printing id @ add member' +
      getApp().globalData.room_switched_to_id);
      uni.navigateTo({
        // list param not used
        url: `../user/addUser`,
      });
    },
    edit_member(index) {
      // let {
      //   // eslint-disable-next-line prefer-const
      //   index,
      // } = e.detail;
      // this.roomList[index].badge && this.roomList[index].badge++;

      console.log('reached change member');

      const memberClicked = this.memberList[index]['title'];
      const memberRoleClickedId = this.memberList[index]['role'];

      console.log('changing member to member clicked:' + memberClicked);

      uni.showToast({
        title: `Click to view member ${memberClicked}`,
        icon: 'none',
      });

      getApp().globalData.member_switched_to = memberClicked;
      getApp().globalData.member_role_switched_to = memberRoleClickedId;


      // navigate to user detail page
      uni.navigateTo({
        // param not used
        url: `../user/userDetail`,
      });
    },
    // to be editted
    someMethodTriggered(e) {
      console.log('click triggered');
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
