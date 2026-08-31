<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="500" draggable="">
			<h3 class="mb20" style="text-align: center">
				<span style="color: red">{{ row.nickName }}</span>
			</h3>
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="玩家ID" prop="targetPpk">
							<el-input v-model="ruleForm.targetPpk" style="width: 200px" placeholder="请输入玩家ID" clearable />
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="游戏类型" prop="gameType">
              <el-select v-model="ruleForm.gameType" style="width: 200px" placeholder="请选择游戏类型" clearable>
                <el-option label="棋牌" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="玩法" prop="gameTypes">
							<el-checkbox-group v-model="ruleForm.gameTypes" style="width: 300px" placeholder="请选择子游戏类型" clearable>
								<!-- (1:麻将 4:考考 5:跑得快 6:扯旋 7:牛牛 8:金花) -->
								<el-checkbox label="麻将" :value="1"></el-checkbox>
								<el-checkbox label="考考" :value="4"></el-checkbox>
								<el-checkbox label="跑得快" :value="5"></el-checkbox>
								<el-checkbox label="扯旋" :value="6"></el-checkbox>
								<el-checkbox label="牛牛" :value="7"></el-checkbox>
								<el-checkbox label="金花" :value="8"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否开启" prop="isOwn">
							<el-switch v-model="ruleForm.isOwn" />
						</el-form-item>
					</el-col> -->
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
import { fillPpkId } from '/@/config/tool';
import request from '/@/utils/request';
// import { uploadImg } from '/@/utils/cosFile.js';
// import { $http } from '/@/utils/request';
// import { uploadImg } from '/@/api/main/swiper';
// import { addSwiper, updateSwiper } from '/@/api/main/swiper';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '大厅房间',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({ isOwn: true, gameType: 1 });
//自行添加其他规则
const rules = ref<FormRules>({
	targetPpk: [{ required: true, message: '玩家ID不能为空', trigger: 'blur' }],
	// childType: [{ required: true, message: '子游戏类型不能为空', trigger: 'blur' }],
	gameType: [{ required: true, message: '游戏类型不能为空', trigger: 'blur' }],
	isOwn: [{ required: true, message: '是否开启不能为空', trigger: 'blur' }],
});

const row = ref<any>({});
// 打开弹窗
const openDialog = (data: any) => {
	row.value = data;
	ruleForm.value.targetPpk = data.ppk;
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
			await request.post('/admin/setGameRoomLimit', {
				...values,
				targetPpk: fillPpkId(values.targetPpk),
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
