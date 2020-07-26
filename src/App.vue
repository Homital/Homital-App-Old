<script>
// const auth = require('common/authorisation');
export default {
  globalData: {
    base_url: 'http://homital.ml:2333/api',
    access_token: '',
    room_added: '',
    room_id_added: '',
    room_role_added: '',
    room_switched_to: '',
    room_switched_to_id: '',
    room_switched_to_role: '',
    device_added: '',
    device_type_added: '',
    device_switched_to: '',
    device_type_switched_to: '',
    room_list: [],
    device_list: [],
    request_room_list: true,
    member_changed: true,
    member_name: '',
    member_role: '',
    member_switched_to: '',
    member_role_switched_to: '',
    request_device_list: true, // set to be true after new device added
  },
  onLaunch: async function() {
    console.log('App Launch');
    // await auth.functions.requestAcessToken((success) => {
    //   console.log('rat: callback, succ=', success);
    //   if (!success) {
    //     uni.setStorageSync('notloggedin', true);
    //     uni.removeStorageSync('refresh_token');
    //     uni.removeStorageSync('userinfo');
    //   } else {
    //     uni.setStorageSync('notloggedin', false);
    //   }
    // });
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  },
};
</script>

<style>
  /*每个页面公共css */
  /* body {
  background-color: #283443;
  opacity: 0.7;
  } */
</style>
