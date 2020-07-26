<template>
  <view class="page">
    <uni-section title="Shared username" type="line"></uni-section>
    <view class="input-body">
      <input v-model="memeberName" placeholder="Enter correct username"
      type="text" class="example-body" />
    </view>

    <uni-section title="Member role" type="line"></uni-section>
    <view class="combo-body">
      <uni-combox label="Member Role" labelWidth="150px" :candidates="choices"
      placeholder="Select" v-model="role"
      emptyTips="Role type not supported"></uni-combox>
    <uni-section title="Room name" type="line"></uni-section>
    <view class="input-body">
      <input v-model="roomName" placeholder="Enter room name"
      type="text" class="example-body" />
    </view>
    <view class="add_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      @tap="add_member">Add member</button>
    </view>
  </view>
  </view>
</template>

<script>
const auth = require('../../common/authorisation');
import uniCombox from '@/components/uni-combox/uni-combox.vue';
import uniSection from '@/components/uni-section/uni-section.vue';
export default {
  components: {
    uniCombox,
    uniSection,
  },
  data() {
    return {
      role: '',
      roomId: '',
      choices: ['owner', 'member', 'admin', 'viewer'],
      memeberName: '',
      roomName: '',
    };
  },
  onShow() {
    this.roomId = getApp().globalData.room_switched_to_id;
  },
  methods: {
    async add_member() {
      const tHIS = this;
      console.log('printing room_id at add user: ' + this.roomId);
      const url =
      getApp().globalData.base_url + `/user/rooms/members?uid=${this.roomId}`;
      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached add user');
            if (res.statusCode == 200) {
              console.log('successfully add room ' + tHIS.roomName +
              ' for member: ' + tHIS.memberName);
              getApp().globalData.member_changed = true;
              uni.navigateBack();
            } else {
              uni.showToast({
                icon: 'none',
                title: res.data.error,
                duration: 2000,
              });
            }
          },
          url,
          {
            username: tHIS.memeberName,
            role: tHIS.role,
            name: tHIS.roomName,
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
