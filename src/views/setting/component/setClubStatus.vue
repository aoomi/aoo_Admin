<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="500" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="俱乐部状态" prop="status">
							<el-radio-group v-model="ruleForm.status">
								<el-radio :label="0">正常</el-radio>
								<el-radio :label="1">打烊</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col v-if="ruleForm.status === 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="打烊提示" prop="tips">
							<el-input v-model="ruleForm.tips" style="width: 300px" type="textarea" :rows="3" placeholder="请输入打烊时的提示文字" clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel" size="default">取 消</el-button>
					<el-button type="primary" @click="submit" size="default" :loading="submitLoading">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import request from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';

var props = defineProps({
	title: {
		type: String,
		default: '设置俱乐部打烊状态',
	},
});

const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const submitLoading = ref(false);
const ruleForm = ref<any>({ status: 0, tips: '' });

const rules = ref<FormRules>({
	status: [{ required: true, message: '请选择俱乐部状态', trigger: 'change' }],
	tips: [{ required: true, message: '打烊时提示文字不能为空', trigger: 'blur' }],
});

// 切换回正常时清空 tips 校验
watch(
	() => ruleForm.value.status,
	(val) => {
		if (val === 0) {
			ruleForm.value.tips = '';
			ruleFormRef.value?.clearValidate('tips');
		}
	}
);

// 打开弹窗，拉取当前打烊数据
const openDialog = async (row: any) => {
	ruleForm.value = { status: 0, tips: '' };
	isShowDialog.value = true;
	try {
		const res: any = await request.post('/admin/getClubStatus', {});
		ruleForm.value.status = res.status ?? 0;
		ruleForm.value.tips = res.tips ?? '';
	} catch (error) {
		reportAdminError(error, 'clubStatus.load', '俱乐部状态加载失败，请重试');
	}
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
	// 打烊状态才校验 tips，正常状态跳过
	const fieldsToValidate = ruleForm.value.status === 1 ? undefined : ['status'];
	ruleFormRef.value.validateField(fieldsToValidate ?? [], async (isValid: boolean) => {});
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			submitLoading.value = true;
			try {
				const params: any = { status: ruleForm.value.status };
				if (ruleForm.value.status === 1) {
					params.tips = ruleForm.value.tips;
				}
				await request.post('/admin/setClubStatus', params);
				ElMessage({ message: '设置成功', type: 'success' });
				closeDialog();
			} catch (error) {
				reportAdminError(error, 'clubStatus.update', '俱乐部状态设置失败，请重试');
			} finally {
				submitLoading.value = false;
			}
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

onMounted(async () => {});

defineExpose({ openDialog });
</script>
