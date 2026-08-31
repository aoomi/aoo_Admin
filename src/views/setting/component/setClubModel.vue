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
						<el-form-item label="模式" prop="model">
							<el-select v-model="ruleForm.model" style="width: 200px" placeholder="请选择模式" clearable>
								<el-option label="亲友圈" :value="0"></el-option>
								<el-option label="联盟" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否开启" prop="isOwn">
							<el-switch v-model="ruleForm.isOwn" />
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
// import { uploadImg } from '/@/utils/cosFile.js';
// import { $http } from '/@/utils/request';
// import { uploadImg } from '/@/api/main/swiper';
// import { addSwiper, updateSwiper } from '/@/api/main/swiper';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '设置俱乐部模式',
	},
});

// 11、设置俱乐部模式 /admin/setClubModel
//         请求: {"clubKey":"1","model":1,"isOwn":true}
//         响应：{"errorCode":0}
//         备注：
//             1、clubKey：俱乐部唯一标识
//             2、model：模式(0、亲友圈 1、联盟)
//             3、isOwn：是否开启
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	targetPpk: [{ required: true, message: '玩家ID不能为空', trigger: 'blur' }],
	childType: [{ required: true, message: '子游戏类型不能为空', trigger: 'blur' }],
	gameType: [{ required: true, message: '游戏类型不能为空', trigger: 'blur' }],
	isOwn: [{ required: true, message: '是否开启不能为空', trigger: 'blur' }],
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
			await request.post('/admin/setClubModel', {
				...values,
				clubKey: fillId(values.clubKey),
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
