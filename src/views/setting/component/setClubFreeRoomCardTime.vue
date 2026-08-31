<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="500" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="俱乐部标识" prop="clubKey">
							<el-input v-model="ruleForm.clubKey" style="width: 200px" placeholder="请输入俱乐部唯一标识" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="筛选时间" style="width: 400px">
							<el-date-picker
								v-model="time"
								value-format="x"
								:picker-options="options"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel" size="default">取 消</el-button>
					<el-button type="primary" @click="submit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { fillId } from '/@/config/tool';
import request from '/@/utils/request';
const time = ref([Date.now() - 60 * 60 * 24 * 1000 * 7, Date.now()]);
const options = {
	disabledDate: (e: any) => e > Date.now(),
};
// import { uploadImg } from '/@/utils/cosFile.js';
// import { $http } from '/@/utils/request';
// import { uploadImg } from '/@/api/main/swiper';
// import { addSwiper, updateSwiper } from '/@/api/main/swiper';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '设置俱乐部房费免费时间段',
	},
});
// 9、设置俱乐部游戏房间权限 /admin/setClubGameRoomLimit
//         请求: {"gameType":"1","targetPpk":"1","childType":1,"isOwn":true,"clubKey":"1"}
//         响应：{"errorCode":0}
//         备注：
//             1、gameType：游戏类型(1、棋牌)
//             2、targetPpk：目标唯一标识
//             3、childType：子游戏类型(1、麻将 5、跑得快 6、扯旋)
//             4、isOwn：是否开启
//             5、clubKey：俱乐部唯一标识
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	clubKey: [{ required: true, message: '俱乐部标识不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	isShowDialog.value = false;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 提交
const submit = async () => {
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			await request.post('/admin/setClubFreeRoomCardTime', {
				clubKey: fillId(values.clubKey),
				startTime: ~~(time.value[0] / 1000),
				endTime: ~~(time.value[1] / 1000),
			});
			// if (ruleForm.value.carouselId != undefined && ruleForm.value.carouselId > 0) {
			// 	// await $http.put('/api/PlatConfig/Carousels/' + ruleForm.value.carouselId, values);
			// } else {
			// 	// await addSwiper(values);
			// 	// await $http.post('/api/PlatConfig/Carousels', values);
			// }
			ElMessage({
				message: `设置成功`,
				type: 'success',
			});
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

const uploadImgHandle = async (file: any, fileList: any) => {
	// const res = await uploadImg(file, fileList, { cosPath: 'swiper' });
	// ruleForm.value.imageUrl = res;
};

// 页面加载时
onMounted(async () => {});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
