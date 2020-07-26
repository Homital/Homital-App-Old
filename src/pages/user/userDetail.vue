<template>
  <view>
    <text class="example-info"
    >Member name: {{memberName}}</text>
    <uni-section title="Role" type="line"></uni-section>
    <uni-list>
      <uni-list-item :title="role" rightText="change"
      @click= change_role_type />
    </uni-list>

    <view class="delete_button">
      <button style="width:80%;margin-top:35px;margin-bottom:15px;"
      type="primary"
      @tap="delete_member">delete member</button>
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
      memberName: '',
      role: '',
      roomId: '',
    };
  },
  async onShow() {
    // get current member info
    this.memberName = getApp().globalData.member_switched_to;
    this.role = getApp().globalData.member_role_switched_to;
    this.roomId = getApp().globalData.room_switched_to_id;
  },
  methods: {
    change_role_type() {
      getApp().globalData.room_switched_to_id = this.roomId;
      uni.navigateTo({
        // params not used as there are some issues using onLoad
        url: `./changeUserRole`,
      });
    },
    async delete_member() {
      const tHIS = this;
      const url = getApp().globalData.base_url +
      `/user/rooms/members?uid=${this.roomId}&username=${this.memberName}`;
      await auth.functions.makeAuthenticatedCall(
          async (res) => {
            console.log('reached delete member');
            if (res.statusCode == 200) {
              console.log('successfully delete member '+ tHIS.memberName);
              // tell room list page to regenerate room list
              // getApp().globalData.member_changed = true;
              // go back to user list page
              uni.navigateBack({delta: 1});
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
