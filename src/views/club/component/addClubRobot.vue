<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="500" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="俱乐部ID" prop="clubKey">
							<el-input v-model="ruleForm.clubKey" style="width: 200px" placeholder="请输入俱乐部ID" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="队长ID" prop="captainPpk">
							<el-input v-model="ruleForm.captainPpk" style="width: 200px" placeholder="请输入队长D" clearable />
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
import { fillId, fillPpkId } from '/@/config/tool';
import request from '/@/utils/request';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '俱乐部添加机器人',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({
	clubKey: '',
	captainPpk: '',
});
let ppks: string[] = [];
//自行添加其他规则
const rules = ref<FormRules>({
	clubKey: [{ required: true, message: '俱乐部ID不能为空', trigger: 'blur' }],
	captainPpk: [{ required: true, message: '队长ID不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (pks: string[]) => {
	ppks = pks;
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
			await request.post('/admin/addClubRobot', {
				// ...ruleForm.value,
				ppks,
				clubKey: fillId(ruleForm.value.clubKey),
				captainPpk: fillPpkId(ruleForm.value.captainPpk),
			});
			// if (ruleForm.value.carouselId != undefined && ruleForm.value.carouselId > 0) {
			// 	// await $http.put('/api/PlatConfig/Carousels/' + ruleForm.value.carouselId, values);
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
