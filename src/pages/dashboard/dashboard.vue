<template>
	<view class="page">
		<view class="image-list">
			<view class="image-item" :src="imageUrl">
				<view class="image-content">
					<image style="background-color:#eeeeee;width:100%;" mode="scaleToFill" :src=imageUrl v-if=imageUrl @error="imageError"></image>
				</view>
				<view class="image-title">Device usage</view>
			</view>
		</view>
	</view>
</template>

<script>
	const plotUsage = require('../../common/plot_usage');
	const auth = require('../../common/authorisation');
	export default {
		data() {
			return {
				// imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
				// imageUrl: 'https://quickchart.io/chart?c={"type":"bar","data":{"labels":["Tue","Wed","Thu","Fri","Sat","Sun","Mon"],"datasets":[{"data":[1329,521,199,1111,702,536,1029],"backgroundColor":"rgba(54, 162, 235, 0.5)"}]},"options":{"responsive":true,"legend":{"display":false},"scales":{"xAxes":[{"gridLines":{"display":false}}],"yAxes":[{"gridLines":{"display":true},"ticks":{"beginAtZero":true,"stepSize":100}}]}}}',
				imageUrl: '',
				deviceName: '',
				roomId: '',
				array: [{
					mode: 'scaleToFill',
					text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应',
				}, {
					mode: 'aspectFit',
					text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来',
				}, {
					mode: 'aspectFill',
					text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来',
				}],
				src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
			};
		},
		async onShow() {
			const tHIS = this;
			this.deviceName = getApp().globalData.device_switched_to;
			this.roomId = getApp().globalData.room_switched_to_id;
			const dashboardUrl = getApp().globalData.base_url +
				`/user/data/?uid=${this.roomId}&devicename=${this.deviceName}&demo=true`;
			auth.functions.makeAuthenticatedCall(
				async (res) => {
						console.log('reached get user statistics');
						if (res.statusCode == 200) {
							console.log('successfully obtain user statistics for user: ' +
								tHIS.username);
							uni.downloadFile({
								url: 'http://' + plotUsage(res.data).slice(8),
								success(r) {
									tHIS.imageUrl = r.tempFilePath;
									console.log(tHIS.imageUrl);
								}
							});
							//tHIS.imageUrl = plotUsage(res.data); //'https://floydsteinberg.pythonanywhere.com/static/183bd70f-adbd-4f2a-8350-6beb5ae1e2d0.png';
							//console.log(tHIS.imageUrl);
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.error,
								duration: 2000,
							});
						}
					},
					dashboardUrl, {},
					'GET',
			);
		},
		methods: {
			imageError: function(e) {
				console.error('image发生error事件，携带值为' + e.detail.errMsg);
			},
		},
	};
</script>

<style>

</style>
