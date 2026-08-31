<template>
	<div style="padding: 20px">
		<el-form :model="ruleForm" ref="ruleFormRef" size="default" :rules="rules">
			<el-row :gutter="35">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="最小携带积分" prop="centArgs[0]">
						<el-input v-model="ruleForm.centArgs[0]" style="width: 200px" placeholder="请输入最小携带积分" clearable />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="最大携带积分" prop="centArgs[1]">
						<el-input v-model="ruleForm.centArgs[1]" style="width: 200px" placeholder="请输入最大携带积分" clearable />
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
					<el-form-item label="加减积分倍数" prop="centArgs[2]">
						<el-input v-model="ruleForm.centArgs[2]" style="width: 200px" placeholder="请输入加减积分倍数" clearable />
					</el-form-item>
				</el-col>
				<el-col>
					<el-button type="primary" size="default" @click="submit">提交</el-button>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { ElMessage, FormRules } from 'element-plus';
import { ref } from 'vue';
import request from '/@/utils/request';

const ruleFormRef = ref();
const ruleForm = ref<any>({
	centArgs: ['', '', ''],
});
//自行添加其他规则
const rules = ref<FormRules>({
	centArgs: [{ required: true, message: '俱乐部ID不能为空', trigger: 'blur' }],
});

(async () => {
	const res = await request.post('/admin/getClubRobotCentInfo', {});
	if (res.errorCode === 0) {
		ruleForm.value.centArgs = res.centArgs.map((v: string) => Number(v));
	}
})();

// 提交
const submit = async () => {
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			await request.post('/admin/setClubRobotCentInfo', {
				centArgs: ruleForm.value.centArgs.map((v: any) => v + '.0'),
			});
			ElMessage({
				message: `设置成功`,
				type: 'success',
			});
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};
</script>
