<template>
	<div class="room-dialog-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="900" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="玩法地区标签" prop="classificationRegionCode">
							<el-select :disabled="!!ruleForm.uid" v-model="ruleForm.classificationRegionCode" placeholder="请选择玩法地区标签" style="width: 200px">
								<el-option v-for="item in classificationRegionOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="游戏类型" prop="gameType">
							<el-select :disabled="!!ruleForm.uid" v-model="ruleForm.gameType" placeholder="请选择游戏类型" style="width: 200px">
								<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="底分" prop="baseNum">
							<el-input v-model="ruleForm.baseNum" placeholder="请输入底分" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="最大人数" prop="maxMemberNum">
							<el-input :disabled="!!ruleForm.uid" v-model="ruleForm.maxMemberNum" placeholder="请输入最大人数" clearable />
						</el-form-item>
					</el-col>

					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存区间" prop="loseWinAreas">
							<div style="display: flex; gap: 10px; align-items: center">
								<el-input v-model="ruleForm.loseWinAreas[0]" placeholder="最小区间" />
								<span>-</span>
								<el-input v-model="ruleForm.loseWinAreas[1]" placeholder="最大区间" />
							</div>
						</el-form-item>
					</el-col>

					<el-col v-if="!!ruleForm.uid" :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="当前库存" prop="curLoseWin" required>
							<el-input v-model="ruleForm.curLoseWin" placeholder="请输入当前库存" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"></el-col>

					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
						<el-form-item label="库存概率" prop="loseWinLuckyNums[0]" required>
							<div style="display: flex; gap: 10px; align-items: center">
								<el-input v-model="ruleForm.loseWinLuckyNums[0][0]" placeholder="最小值" />
								<span>-</span>
								<el-input v-model="ruleForm.loseWinLuckyNums[0][1]" placeholder="最大值" />
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-else></el-col>

					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存范围内" prop="loseWinLuckyNums[2]" required>
							<div style="display: flex; gap: 10px; align-items: center">
								<el-input v-model="ruleForm.loseWinLuckyNums[2][0]" placeholder="最小值" />
								<span>-</span>
								<el-input v-model="ruleForm.loseWinLuckyNums[2][1]" placeholder="最大值" />
							</div>
						</el-form-item>
					</el-col>

					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="低于库存" prop="loseWinLuckyNums[1]" required>
							<div style="display: flex; gap: 10px; align-items: center">
								<el-input v-model="ruleForm.loseWinLuckyNums[1][0]" placeholder="最小值" />
								<span>-</span>
								<el-input v-model="ruleForm.loseWinLuckyNums[1][1]" placeholder="最大值" />
							</div>
						</el-form-item>
					</el-col>

					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="高于库存" prop="loseWinLuckyNums[3]" required>
							<div style="display: flex; gap: 10px; align-items: center">
								<el-input v-model="ruleForm.loseWinLuckyNums[3][0]" placeholder="最小值" />
								<span>-</span>
								<el-input v-model="ruleForm.loseWinLuckyNums[3][1]" placeholder="最大值" />
							</div>
						</el-form-item>
					</el-col>

					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" style="text-align: right">
						<el-button type="primary" size="default" @click="ruleForm.loseWinLuckyNums.push(['', ''])">添加库存概率</el-button>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"></el-col>
					<template v-for="(item, index) in ruleForm.timeAndTables" :key="index">
						<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="开桌时间" :prop="`timeAndTables[${index}]`" required>
								<div style="display: flex; gap: 10px; align-items: center">
									<!-- <el-time-select v-model="item[0]" style="width: 120px" placeholder="开始时间" start="00:00" step="00:30" end="23:59" /> -->
									<el-input v-model="item[0]"></el-input>
									<span>-</span>
									<!-- <el-time-select v-model="item[1]" style="width: 120px" placeholder="结束时间" start="00:00" step="00:30" end="23:59" /> -->
									<el-input v-model="item[1]"></el-input>
								</div>
							</el-form-item>
						</el-col>

						<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="桌数" :prop="`timeAndTables[${index}]`" required>
								<div style="display: flex; gap: 10px; align-items: center">
									<el-input v-model="item[2]" placeholder="最小桌数" />
									<span>-</span>
									<el-input v-model="item[3]" placeholder="最大桌数" />
									<el-button v-if="ruleForm.timeAndTables.length > 1" type="danger" size="default" @click="ruleForm.timeAndTables.splice(index, 1)"
										>删除</el-button
									>
								</div>
							</el-form-item>
						</el-col>
					</template>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" style="text-align: right">
						<el-button type="primary" size="default" @click="ruleForm.timeAndTables.push(['', '', '', ''])">添加开桌时间与桌数</el-button>
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
import { ref } from 'vue';
import { classificationRegionOptions, gametypes } from '/@/config';
import { formatHours, parseHours } from '/@/config/tool';
import { $http } from '/@/utils/request';
// 父级传递来的参数
const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	clubKey: String,
});

// 父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);

// 39、添加俱乐部AI规则房间 /admin/addClubAIRuleRoom
//         请求: {"clubKey" : "1", "area":1,"gameType":1,"baseNum":"1.0","timeAndTables":[[1,1,2,5],...],"loseWinAreas":["100","200"]}
//         响应：{"errorCode": 0}
//         备注：
//             1、clubKey：俱乐部唯一标识
//             2、area：地区
//             3、gameType：游戏类型
//             4、baseNum：底分
//             5、timeAndTables：开桌时间与开桌数[开始时间戳(时分),结束时间戳(时分),最小桌数,最大桌数]
//             6、loseWinAreas：库存区间["最小区间","最大区间"]

const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({
	classificationRegionCode: null,
	gameType: null,
	baseNum: '',
	timeAndTables: [['', '', '', '']],
	loseWinAreas: ['', ''],
	loseWinLuckyNums: [
		['', ''],
		['', ''],
		['', ''],
		['', ''],
	],
});

// 表单验证规则
const rules = ref<FormRules>({
	classificationRegionCode: [{ required: true, message: '请选择玩法地区标签', trigger: 'blur' }],
	gameType: [{ required: true, message: '请输入游戏类型', trigger: 'blur' }],
	baseNum: [{ required: true, message: '请输入底分', trigger: 'blur' }],
	loseWinAreas: [{ required: true, message: '请输入底分', trigger: 'blur' }],
	timeAndTables: [{ required: true, message: '请输入开桌时间与桌数', trigger: 'blur' }],
	loseWinLuckyNums: [{ required: true, message: '请输入幸运值配置', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		ruleForm.value = {
			classificationRegionCode: row.classificationRegionCode,
			gameType: row.gameType,
			baseNum: Number(row.baseNum),
			maxMemberNum: Number(row.maxMemberNum),
			timeAndTables: row.timeAndTables.map((item: any) => [parseHours(item[0]), parseHours(item[1]), item[2], item[3]]),
			loseWinAreas: row.loseWinAreas.map((v: any) => Number(v)),
			loseWinLuckyNums:
				row.loseWinLuckyNums && row.loseWinLuckyNums.length > 0
					? row.loseWinLuckyNums.map((item: any) => [item[0], item[1]])
					: [
							['', ''],
							['', ''],
							['', ''],
							['', ''],
						],
			uid: row.uid + '',
			curLoseWin: Number(row.curLoseWin),
		};
	} else {
		ruleForm.value = {
			classificationRegionCode: null,
			gameType: null,
			baseNum: '',
			timeAndTables: [['00:00', '23:59', '1', '']],
			loseWinAreas: ['1', '1000'],
			loseWinLuckyNums: [
				['', ''],
				['20', '40'],
				['20', '30'],
				['-20', '-30'],
			],
		};
	}

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
			try {
				const payload = {
					clubKey: props.clubKey,
					classificationRegionCode: Number(ruleForm.value.classificationRegionCode),
					gameType: Number(ruleForm.value.gameType),
					baseNum: ruleForm.value.baseNum + '',
					maxMemberNum: Number(ruleForm.value.maxMemberNum),
					timeAndTables: ruleForm.value.timeAndTables.map((item: any) => [
						formatHours(item[0]),
						formatHours(item[1]),
						Number(item[2]),
						Number(item[3]),
					]),
					loseWinAreas: ruleForm.value.loseWinAreas.map((v: any) => v + ''),
					loseWinLuckyNums: ruleForm.value.loseWinLuckyNums.map((item: any) => [Number(item[0]), Number(item[1])]),
				};

				if (ruleForm.value.uid) {
					// 修改
					await $http('/admin/modifyClubAIRuleRoom', {
						...payload,
						uid: ruleForm.value.uid,
						curLoseWin: ruleForm.value.curLoseWin + '',
					});
					ElMessage.success('修改成功');
				} else {
					// 添加
					await $http('/admin/addClubAIRuleRoom', payload);
					ElMessage.success('添加成功');
				}

				closeDialog();
			} catch (error) {
				ElMessage.error('操作失败');
			}
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

// 将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>

<style scoped>
.room-dialog-container :deep(.el-form-item__label) {
	font-weight: 500;
}
</style>
