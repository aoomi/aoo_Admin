<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="序号" prop="sortOrder">
							<el-input-number v-model="ruleForm.sortOrder" style="width: 200px" placeholder="请输入序号" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="图片地址" prop="imageUrl">
							<el-upload
								class="avatar-uploader overflow-hidden"
								action="#999"
								:auto-upload="false"
								:show-file-list="false"
								:limit="1"
								list-type="picture-card"
								:on-change="uploadImgHandle"
								accept=".jpg,.jpeg,.png"
							>
								<img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" style="width: 100%; height: 100%; object-fit: contain" />
								<el-icon v-else>
									<Plus />
								</el-icon>
							</el-upload>
							<!-- <el-upload list-type="picture-card" :limit="1" accept=".jpg,.jpeg,.png" :show-file-list="false" :http-request="uploadImgHandle">
								<img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" style="width: 100%; height: 100%; object-fit: contain" />
								<el-icon v-else><Plus /></el-icon>
							</el-upload> -->
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="跳转地址" prop="linkUrl">
							<el-input v-model="ruleForm.linkUrl" placeholder="请输入跳转地址" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="隐藏显示" prop="isEnabled">
							<el-switch v-model="ruleForm.isEnabled" active-text="显示" inactive-text="隐藏" />
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
	sortOrder: [{ required: true, message: '请输入序号！', trigger: 'blur' }],
	imageUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
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
			if (ruleForm.value.carouselId != undefined && ruleForm.value.carouselId > 0) {
				// await $http.put('/api/PlatConfig/Carousels/' + ruleForm.value.carouselId, values);
			} else {
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
