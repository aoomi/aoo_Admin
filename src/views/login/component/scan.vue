<template>
	<div class="login-scan-container">
		<img v-if="qrcodeDataUrl" :src="qrcodeDataUrl" width="260" height="260" alt="登录二维码" />
		<div class="font12 mt20 login-msg">
			<i class="iconfont icon-saoyisao mr5"></i>
			<span>{{ $t('message.scan.text') }}</span>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginScan">
import { ref, onMounted } from 'vue';
import QRCode from 'qrcode';

// 定义变量内容
const qrcodeDataUrl = ref('');

// 初始化生成二维码
const initQrcode = async () => {
	qrcodeDataUrl.value = await QRCode.toDataURL('https://qm.qq.com/cgi-bin/qm/qr?k=RdUY97Vx0T0vZ_1OOu-X1yFNkWgDwbjC&jump_from=webapi', {
		width: 260,
		margin: 1,
		color: { dark: '#000000', light: '#ffffff' },
	});
};
// 页面加载时
onMounted(() => {
	initQrcode();
});
</script>

<style scoped lang="scss">
.login-scan-animation {
	opacity: 0;
	animation-name: error-num;
	animation-duration: 0.5s;
	animation-fill-mode: forwards;
}
.login-scan-container {
	padding: 0 20px 20px;
	display: flex;
	flex-direction: column;
	text-align: center;
	@extend.login-scan-animation;
	animation-delay: 0.1s;
	:deep(img) {
		margin: auto;
	}
	.login-msg {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--el-text-color-placeholder);
		@extend.login-scan-animation;
		animation-delay: 0.2s;
	}
}
</style>
