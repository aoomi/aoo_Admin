<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="管理员账号" prop="userName">
							<el-input v-model="ruleForm.userName" placeholder="请输入管理员账号" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="登录密码" :prop="ruleForm.createTime ? '' : 'passWord'">
							<el-input v-model="ruleForm.passWord" placeholder="请输入登录密码" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="权限" prop="level">
							<el-radio-group v-model="ruleForm.level" size="large">
								<el-radio-button label="普通管理员" :value="1" />
								<el-radio-button label="精英管理员" :value="2" />
							</el-radio-group>
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { UploadRequestOptions } from 'element-plus';
import request from '/@/utils/request';
// import { uploadImg } from '/@/utils/cosFile.js';
// import { $http } from '/@/utils/request';
// import { uploadImg } from '/@/api/main/swiper';
// import { addSwiper, updateSwiper } from '/@/api/main/swiper';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	userName: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
	passWord: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
	level: [{ required: true, message: '请选择权限', trigger: 'blur' }],
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
			if (ruleForm.value.createTime != undefined && ruleForm.value.createTime > 0) {
				// await $http.put('/api/PlatConfig/Carousels/' + ruleForm.value.carouselId, values);
				const res = await request({
					url: '/admin/modifyAdmin',
					method: 'post',
					data: values,
				});
			} else {
				const res = await request({
					url: '/admin/createAdmin',
					method: 'post',
					data: values,
				});
				// await addSwiper(values);
				// await $http.post('/api/PlatConfig/Carousels', values);
			}
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
