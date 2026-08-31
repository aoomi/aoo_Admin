<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="500" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="绑定类型" prop="type">
							<el-radio-group v-model="ruleForm.type">
								<el-radio :label="2">电话号码</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="玩家ID" prop="arg">
							<el-input disabled v-model="ruleForm.arg" style="width: 200px" placeholder="请输入玩家ID" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="新账号名称" prop="userName">
							<el-input v-model="ruleForm.userName" style="width: 200px" placeholder="请输入新账号名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="密码" prop="passWord">
							<el-input v-model="ruleForm.passWord" style="width: 200px" placeholder="请输入密码" clearable />
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
import { md5 } from 'js-md5';
import { onMounted, ref } from 'vue';
import { fillPpkId } from '/@/config/tool';
import request from '/@/utils/request';
// 21、绑定账户 /admin/bindUser
//         请求: {"type": 2, "arg": "123", "userName": "131111111111", "passWord": "510"}
//         响应：{"errorCode":0}
//         备注：
//             1、type：绑定类型(2、电话号码)
//             2、arg：要被绑定的账号或ID(如果是ID需要在前面加上0000100000  保证为16位数)
//             3、userName：新账号名称
//             4、passWord：密码(md5加密后的字符串)
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '绑定账户',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({ type: 2 });
//自行添加其他规则
const rules = ref<FormRules>({
	arg: [{ required: true, message: '玩家ID不能为空', trigger: 'blur' }],
	userName: [{ required: true, message: '新账号名称不能为空', trigger: 'blur' }],
	passWord: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	ruleForm.value.type = 2;
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
			await request.post('/admin/bindUser', {
				...values,
				arg: fillPpkId(values.arg),
				passWord: md5(values.passWord),
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
