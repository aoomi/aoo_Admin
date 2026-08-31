<template>
	<div class="game-lucky-dialog">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="800" draggable="" @close="closeDialog">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="游戏类型" prop="type">
							<el-select v-model="ruleForm.type" placeholder="请选择游戏类型" style="width: 240px" :disabled="isEdit">
								<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="统计天数" prop="countDay">
							<el-input-number v-model="ruleForm.countDay" style="width: 240px" :min="1" :max="365" placeholder="请输入统计天数" />
						</el-form-item>
					</el-col>

					<!-- 输赢积分参数 -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="输赢积分">
							<div style="width: 100%">
								<el-row :gutter="10" style="margin-bottom: 10px">
									<el-col :span="6">
										<div style="margin-bottom: 5px">输的分数:</div>
										<el-input-number v-model="ruleForm.centArg[0]" style="width: 100%" :min="0" placeholder="输的分数" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">增加的幸运值:</div>
										<el-input-number v-model="ruleForm.centArg[1]" style="width: 100%" :min="0" placeholder="增加的幸运值" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">赢的分数:</div>
										<el-input-number v-model="ruleForm.centArg[2]" style="width: 100%" :min="0" placeholder="赢的分数" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">减少的幸运值:</div>
										<el-input-number v-model="ruleForm.centArg[3]" style="width: 100%" :min="0" placeholder="减少的幸运值" />
									</el-col>
								</el-row>
							</div>
						</el-form-item>
					</el-col>

					<!-- 输赢局数参数 -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="输赢局数">
							<div style="width: 100%">
								<el-row :gutter="10" style="margin-bottom: 10px">
									<el-col :span="6">
										<div style="margin-bottom: 5px">输的局数:</div>
										<el-input-number v-model="ruleForm.gameNumArg[0]" style="width: 100%" :min="0" placeholder="输的局数" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">增加的幸运值:</div>
										<el-input-number v-model="ruleForm.gameNumArg[1]" style="width: 100%" :min="0" placeholder="增加的幸运值" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">赢的局数:</div>
										<el-input-number v-model="ruleForm.gameNumArg[2]" style="width: 100%" :min="0" placeholder="赢的局数" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">减少的幸运值:</div>
										<el-input-number v-model="ruleForm.gameNumArg[3]" style="width: 100%" :min="0" placeholder="减少的幸运值" />
									</el-col>
								</el-row>
							</div>
						</el-form-item>
					</el-col>

					<!-- 连续输赢天数参数 -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="连续输赢天数">
							<div style="width: 100%">
								<el-row :gutter="10" style="margin-bottom: 10px">
									<el-col :span="6">
										<div style="margin-bottom: 5px">输的天数:</div>
										<el-input-number v-model="ruleForm.consecutiveDayArg[0]" style="width: 100%" :min="0" placeholder="输的天数" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">增加的幸运值:</div>
										<el-input-number v-model="ruleForm.consecutiveDayArg[1]" style="width: 100%" :min="0" placeholder="增加的幸运值" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">赢的天数:</div>
										<el-input-number v-model="ruleForm.consecutiveDayArg[2]" style="width: 100%" :min="0" placeholder="赢的天数" />
									</el-col>
									<el-col :span="6">
										<div style="margin-bottom: 5px">减少的幸运值:</div>
										<el-input-number v-model="ruleForm.consecutiveDayArg[3]" style="width: 100%" :min="0" placeholder="减少的幸运值" />
									</el-col>
								</el-row>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel()" size="default">取消</el-button>
					<el-button type="primary" @click="submit()" size="default" :loading="submitLoading"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { gametypes } from '/@/config';
import request from '/@/utils/request';

// 父级传递来的参数
const props = defineProps({
	title: {
		type: String,
		default: '',
	},
});

// 父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);

let isEdit = false;
const ruleFormRef = ref();
const isShowDialog = ref(false);
const submitLoading = ref(false);

const ruleForm = ref<any>({
	type: '',
	countDay: 1,
	centArg: [0, 0, 0, 0],
	gameNumArg: [0, 0, 0, 0],
	consecutiveDayArg: [0, 0, 0, 0],
});

// 表单验证规则
const rules = ref<FormRules>({
	type: [{ required: true, message: '请选择游戏类型', trigger: 'change' }],
	countDay: [{ required: true, message: '请输入统计天数', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (data: any) => {
	isEdit = !!data.type;
	isShowDialog.value = true;

	// 重置表单
	ruleForm.value = {
		type: data.type || '',
		countDay: data.countDay || 1,
		centArg: data.centArg ? [...data.centArg] : [0, 0, 0, 0],
		gameNumArg: data.gameNumArg ? [...data.gameNumArg] : [0, 0, 0, 0],
		consecutiveDayArg: data.consecutiveDayArg ? [...data.consecutiveDayArg] : [0, 0, 0, 0],
	};
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
	ruleFormRef.value?.resetFields();
};

// 取消
const cancel = () => {
	closeDialog();
};

// 提交
const submit = async () => {
	ruleFormRef.value.validate(async (isValid: boolean) => {
		if (isValid) {
			submitLoading.value = true;
			try {
				const apiUrl = isEdit ? '/admin/setGameLucky' : '/admin/addGameLucky';
				const data = {
					type: ruleForm.value.type,
					countDay: ruleForm.value.countDay,
					centArg: ruleForm.value.centArg,
					gameNumArg: ruleForm.value.gameNumArg,
					consecutiveDayArg: ruleForm.value.consecutiveDayArg,
				};

				await request.post(apiUrl, data);
				ElMessage.success(isEdit ? '修改成功' : '添加成功');
				emit('reloadTable');
				closeDialog();
			} catch (error) {
				console.log(error);
				ElMessage.error(isEdit ? '修改失败' : '添加失败');
			}
			submitLoading.value = false;
		}
	});
};

// 暴露方法给父组件
defineExpose({
	openDialog,
});
</script>

<style scoped>
.game-lucky-dialog :deep(.el-form-item__label) {
	font-weight: bold;
}

.game-lucky-dialog :deep(.el-input-number .el-input__inner) {
	text-align: left;
}
</style>
