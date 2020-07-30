/**
 * wrapper for requiring access token
 * @param {*} callback callback
 */
function requestAcessToken(callback) {
  requestAcessTokenwrapped(callback, 1);
}

/**
 * requiring access token
 * @param {*} callback callback
 * @param {*} num num of times tried
 */
async function requestAcessTokenwrapped(callback, num) {
  const refreshToken = getApp().globalData.refresh_token;
  await uni.request({
    url: getApp().globalData.base_url + '/auth/user/token',
    data: {
      refresh_token: refreshToken,
    },
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    success: (res) => {
      if (res.statusCode == 200) {
        console.log('reached1');
        console.log(
            'printing access token when first saved :' + res.data.access_token);
        getApp().globalData.access_token = res.data.access_token;
        console.log('printing again after saved : ' +
        getApp().globalData.access_token);
        callback(true);
        return true;
      } else {
        console.log(
            'failed to get access token in 1 attempt, let\'s try again');
        if (num > 0) {
          requestAcessTokenwrapped(callback, num - 1);
        } else {
          callback(false);
          return false;
        }
      }
    },
    fail: (res) => {
      console.log('failed to get access token in 1 attempt, let\'s try again');
      if (num > 0) {
        requestAcessTokenwrapped(callback, num - 1);
      } else {
        callback(false);
        return false;
      }
    },
  });
}

/**
 * Wrapper for making authenticated call
 * @param {*} callback callback
 * @param {*} _url request body
 * @param {*} _body request body
 * @param {*} _method request method
 */
async function makeAuthenticatedCall(callback, _url, _body, _method) {
  makeAuthenticatedCallWrapped(callback, _url, _body, _method, 1);
}

/**
 * make authenticated call
 * @param {*} callback callback
 * @param {*} _url request url
 * @param {*} _body request body
 * @param {*} _method request method
 * @param {*} num num of times
 */
async function makeAuthenticatedCallWrapped(
    callback, _url, _body, _method, num) {
  const accessToken = await getApp().globalData.access_token;
  console.log('printing access token before request: ' + accessToken);

  await uni.request({
    url: _url,
    data: _body,
    method: _method,
    header: {
      'Authorization': 'Bearer ' + accessToken,
    },
    success: async (res) => {
      if (res.statusCode == 200) {
        console.log('request sent suc : true');
        callback(res);
      } else {
        console.log('request sent suc : false');
        if (num > 0) {
          console.log('ok access token was not ok, let\'s try again');
          await requestAcessToken(async (success) => {
            if (success) {
              console.log('A new access token gotten, making second request');
              makeAuthenticatedCallWrapped(
                  callback, _url, _body, _method, num - 1);
            } else {
              await uni.showToast({
                icon: 'none',
                title: 'Your token has already expired. Please log in again.',
                duration: 2000,
              });
              getApp().globalData.notloggedin = true;
              getApp().globalData.refresh_token = '';
              uni.removeStorageSync('userinfo');
              callback(res);
              console.log('cannot get access token in 2 attempts, ' +
              'prompt user to log in again for a new refresh_token');
            }
          });
        } else {
          // uni.showToast({
          //   icon: 'none',
          //   title: 'Your request cannot be processed',
          //   duration: 2000,
          // });
          callback(res);
          console.log('request not successful after 2 attempts');
        }
      }
    },
    fail: async (res) => {
      console.log('no response received');
      console.log('may have gotten empty response, let\'s retry');
      makeAuthenticatedCallWrapped(
          callback, _url, _body, _method, num - 1);
      // const newAccessToken = await getApp().globalData.accessToken;
      // await uni.request({
      //   url: _url,
      //   data: _body,
      //   method: _method,
      //   header: {
      //     'Authorization': 'Bearer ' + newAccessToken,
      //   },
      //   success: async (res) => {
      //     const suc = res.data.success;
      //     console.log('request sent suc : ' + suc);

      //     if (res.data.success) {
      //       console.log('finally succeeded');
      //       callback(res.data);
      //     } else {
      //       console.log('reached but res.data.success = false :(');
      //     }
      //   },
      //   fail: (res) => {
      //     console.log('why second time still fail, hopeless alr');
      //   },
      // });
    },
  });
}

module.exports = {
  functions: {
    requestAcessToken: requestAcessToken,
    makeAuthenticatedCall: makeAuthenticatedCall,
  },
};
