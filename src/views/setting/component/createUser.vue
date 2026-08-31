<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="500" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<!-- type：账号类型(0、玩家  1、陪玩  2、机器人) -->
						<el-form-item label="账号类型" prop="type">
							<el-radio-group v-model="ruleForm.type">
								<!-- <el-radio-button :label="0">玩家</el-radio-button> -->
								<el-radio-button :label="1">陪玩</el-radio-button>
								<el-radio-button :label="2">机器人</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="生成数量" prop="num">
							<el-input-number v-model="ruleForm.num" style="width: 200px" placeholder="请输入赠送房卡数量" clearable />
						</el-form-item>
					</el-col>
          <!-- passWord：密码(md5加密后的字符串) -->
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
import { Plus } from '@element-plus/icons-vue';
import type { FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import request from '/@/utils/request';
import { fillId } from '/@/config/tool';
import { md5 } from 'js-md5';

// 15、批量创建账号 /admin/batchCreateUser
//         请求: {"type":1, "num" : 1, "passWord": ""}
//         响应：{"errorCode":0}
//         备注：
//             1、type：账号类型(0、玩家  1、陪玩  2、机器人)
//             2、num: 生成数量
//             3、passWord：密码(md5加密后的字符串)
var props = defineProps({
	title: {
		type: String,
		default: '批量创建账号',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	type: [{ required: true, message: '账号类型不能为空', trigger: 'blur' }],
	num: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
	passWord: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
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
			await request.post('/admin/batchCreateUser', { ...values, passWord: md5(values.passWord) });
			ElMessage({
				message: `创建成功`,
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
