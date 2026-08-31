<template>
	<div class="pl20 pt20">
		<el-button type="primary" @click="createUserRef.openDialog({})"> 创建用户 </el-button>
		<el-button type="primary" @click="giveRoomCardRef.openDialog({})"> 赠送房卡 </el-button>
		<el-button type="primary" @click="createUserRef.openDialog({})"> 批量创建账号 </el-button>
		<el-button type="primary" @click="setClubFreeRoomCardTimeRef.openDialog({})"> 设置俱乐部房费免费时间段 </el-button>
		<el-button type="primary" @click="setClubModelRef.openDialog({ isOwn: false })"> 设置俱乐部模型 </el-button>
		<el-button type="primary" @click="setClubDefaultModelLimitRef.openDialog({})"> 设置俱乐部默认模式权限 </el-button>
		<el-button type="primary" @click="bindUserRef.openDialog({})"> 绑定账户 </el-button>
		<el-button type="primary" @click="setClubStatusRef.openDialog({})"> 设置俱乐部打烊 </el-button>
		<giveRoomCard ref="giveRoomCardRef"></giveRoomCard>
		<setClubFreeRoomCardTime ref="setClubFreeRoomCardTimeRef"></setClubFreeRoomCardTime>
		<setClubModel ref="setClubModelRef"></setClubModel>
		<setClubDefaultModelLimit ref="setClubDefaultModelLimitRef"></setClubDefaultModelLimit>
		<createUser ref="createUserRef"></createUser>
		<bindUser ref="bindUserRef"></bindUser>
		<setClubStatus ref="setClubStatusRef"></setClubStatus>
		<div class="mt20 pt20">
			<h2 class="mb20">重新加载服务器配置表</h2>
			<el-form :model="form" ref="formRef" label-width="100px">
				<el-form-item v-for="(item, index) in form.xmls" label="文件名" :prop="'xmls.' + index" :key="index" :rules="rules">
					<div class="flex align-items-center">
						<el-input v-model="form.xmls[index]" placeholder="请输入文件名"></el-input>
						<el-button class="ml20" type="danger" @click.prevent="form.xmls.splice(index, 1)">删除</el-button>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button @click="form.xmls.push('')">新增文件</el-button>
					<el-button @click="formRef.resetFields()">重置</el-button>
					<el-button type="primary" @click="submitForm()">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import bindUser from './component/bindUser.vue';
import createUser from './component/createUser.vue';
import giveRoomCard from './component/giveRoomCard.vue';
import setClubDefaultModelLimit from './component/setClubDefaultModelLimit.vue';
import setClubFreeRoomCardTime from './component/setClubFreeRoomCardTime.vue';
import setClubModel from './component/setClubModel.vue';
import setClubStatus from './component/setClubStatus.vue';
import request from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';
const giveRoomCardRef = ref();
const setClubFreeRoomCardTimeRef = ref();
const setClubModelRef = ref();
const setClubDefaultModelLimitRef = ref();
const createUserRef = ref();
const bindUserRef = ref();
const setClubStatusRef = ref();

const form = ref({
	xmls: [''],
});
const formRef = ref();
const rules = ref({ required: true, message: '文件名不能为空', trigger: 'blur' });
const submitForm = () => {
	formRef.value.validate(async (valid: boolean, fields?: any) => {
		if (valid) {
			try {
				const res = await request.post('/admin/reloadXml', form.value);
				return ElMessage({
					message: '刷新配置表成功',
					type: 'success',
				});
			} catch (error) {
				reportAdminError(error, 'settings.reloadXml', '配置表刷新失败，请重试');
			}
		}
	});
};
</script>
