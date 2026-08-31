<template>
	<div class="swiper-container">
		<el-dialog v-model="isShowDialog" :title="props.title" draggable="" width="680px">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="80px" :rules="rules" label-position="top">
				<el-row :gutter="20">
					<!-- 左侧：可玩游戏 -->
					<el-col :span="12">
						<el-form-item>
							<div style="border: 1px solid #e4e7ed; padding: 16px; border-radius: 4px; width: 100%">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
									<span style="font-weight: 500; font-size: 16px">游戏配置</span>
									<el-button @click="addGame" type="primary" size="small" plain>添加游戏</el-button>
								</div>

								<el-row
									:gutter="10"
									v-for="(game, gameIndex) in ruleForm.playableGames as any[]"
									:key="gameIndex"
									style="border: 1px solid #f0f0f0; padding: 5px 10px; margin-bottom: 12px; border-radius: 4px; background: #fafafa"
								>
									<el-col style="display: flex; justify-content: space-between; align-items: center">
										<span style="font-weight: 500">游戏 {{ gameIndex + 1 }}</span>
										<el-button v-if="ruleForm.playableGames.length > 1" @click="removeGame(gameIndex)" type="danger" size="small" plain>
											删除
										</el-button>
									</el-col>
									<el-col :span="12">
										<el-form-item
											:prop="`playableGames.${gameIndex}.classificationRegionCode`"
											:rules="[{ required: true, message: '请选择玩法地区标签', trigger: 'change' }]"
											label="玩法地区标签"
											label-width="50px"
											style="margin-bottom: 8px"
										>
											<el-select v-model="game.classificationRegionCode" placeholder="请选择玩法地区标签" style="width: 100%" size="small">
												<el-option v-for="item in classificationRegionOptions" :key="item.value" :label="item.label" :value="item.value" />
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item
											:prop="`playableGames.${gameIndex}.gameType`"
											:rules="[{ required: true, message: '请选择游戏类型', trigger: 'change' }]"
											label="游戏类型"
											label-width="70px"
											style="margin-bottom: 8px"
										>
											<el-select v-model="game.gameType" placeholder="请选择游戏类型" style="width: 100%" size="small">
												<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
											</el-select>
										</el-form-item>
									</el-col>
									<el-col class="mt10" :span="24" style="display: flex; justify-content: space-between; align-items: center">
										<span style="font-size: 12px; color: #666">底分区间</span>
										<el-button @click="addBaseNumArea(gameIndex)" type="text" size="small">添加区间</el-button>
									</el-col>

									<el-col
										:span="24"
										v-for="(area, areaIndex) in game.baseNumAreas as any[]"
										:key="areaIndex"
										style="display: flex; gap: 5px; align-items: center"
									>
										<el-input v-model="area[0]" placeholder="最低" style="width: 80px" size="small" />
										<span>-</span>
										<el-input v-model="area[1]" placeholder="最高" style="width: 80px" size="small" />
										<el-button v-if="game.baseNumAreas.length > 1" @click="removeBaseNumArea(gameIndex, areaIndex)" type="danger" size="small">
											删除
										</el-button>
									</el-col>
								</el-row>
							</div>
						</el-form-item>
					</el-col>

					<!-- 右侧：可玩时间 -->
					<el-col :span="12">
						<el-form-item>
							<div style="border: 1px solid #e4e7ed; padding: 16px; border-radius: 4px; width: 100%">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
									<span style="font-weight: 500; font-size: 16px">时间配置</span>
									<el-button @click="addPlayableTime" type="primary" size="small" plain>添加时间</el-button>
								</div>

								<div
									v-for="(time, timeIndex) in ruleForm.playableTimes as any[]"
									:key="timeIndex"
									style="border: 1px solid #f0f0f0; padding: 5px 10px; border-radius: 4px; background: #fafafa; margin-bottom: 12px"
								>
									<div style="display: flex; justify-content: space-between; align-items: center">
										<span style="font-weight: 500">时间段 {{ timeIndex + 1 }}</span>
										<el-button v-if="ruleForm.playableTimes.length > 1" @click="removePlayableTime(timeIndex)" type="danger" size="small" plain>
											删除
										</el-button>
									</div>

									<div style="display: flex; gap: 10px; align-items: center">
										<!-- <el-time-select
											v-model="time[0]"
											style="width: 120px"
											placeholder="开始时间"
											start="00:00"
											step="00:30"
											end="23:59"
											size="small"
										/> -->
										<el-input v-model="time[0]"></el-input>
										<span>-</span>
										<!-- <el-time-select
											v-model="time[1]"
											style="width: 120px"
											placeholder="结束时间"
											start="00:00"
											step="00:30"
											end="23:59"
											size="small"
										/> -->
										<el-input v-model="time[1]"></el-input>
									</div>
								</div>
							</div>
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
import { classificationRegionOptions, gametypes } from '/@/config';
import { formatHours, parseHours } from '/@/config/tool';
import request from '/@/utils/request';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '设置机器人信息',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({
	ppks: [],
	playableGames: [
		{
			classificationRegionCode: null,
			gameType: null,
			baseNumAreas: [['', '']],
		},
	],
	playableTimes: [['00:00', '23:59']],
});
//自行添加其他规则
const rules = ref<FormRules>({});

// 添加游戏
const addGame = () => {
	ruleForm.value.playableGames.push({
		classificationRegionCode: null,
		gameType: null,
		baseNumAreas: [['', '']],
	});
};

// 删除游戏
const removeGame = (index: number) => {
	ruleForm.value.playableGames.splice(index, 1);
};

// 添加底分区间
const addBaseNumArea = (gameIndex: number) => {
	ruleForm.value.playableGames[gameIndex].baseNumAreas.push(['', '']);
};

// 删除底分区间
const removeBaseNumArea = (gameIndex: number, areaIndex: number) => {
	ruleForm.value.playableGames[gameIndex].baseNumAreas.splice(areaIndex, 1);
};

// 添加可玩时间
const addPlayableTime = () => {
	ruleForm.value.playableTimes.push(['00:00', '23:59']);
};

// 删除可玩时间
const removePlayableTime = (index: number) => {
	ruleForm.value.playableTimes.splice(index, 1);
};

// 打开弹窗
const openDialog = (row: any) => {
	if (Array.isArray(row)) {
		ruleForm.value.ppks = row;
	} else {
		ruleForm.value.ppks = [row.ppk];
		if (row.playableGames) {
			ruleForm.value.playableGames = row.playableGames.map((game: any) => ({
				classificationRegionCode: game.classificationRegionCode,
				gameType: game.gameType,
				baseNumAreas: game.baseNumAreas.map((v: any[]) => [Number(v[0]), Number(v[1])]),
			}));
		}
		if (row.playableTimes) {
			ruleForm.value.playableTimes = row.playableTimes.map((time: any[]) => [
				typeof time[0] === 'string' ? time[0] : parseHours(time[0]),
				typeof time[1] === 'string' ? time[1] : parseHours(time[1]),
			]);
		}
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
			// 处理数据格式
			const formattedPlayableGames = ruleForm.value.playableGames.map((game: any) => ({
				classificationRegionCode: Number(game.classificationRegionCode),
				gameType: Number(game.gameType),
				baseNumAreas: game.baseNumAreas.map((area: any[]) => [String(area[0]), String(area[1])]),
			}));

			const formattedPlayableTimes = ruleForm.value.playableTimes.map((time: string[]) => [formatHours(time[0]), formatHours(time[1])]);

			await request.post('/admin/setRobotInfo', {
				ppks: ruleForm.value.ppks,
				playableGames: formattedPlayableGames,
				playableTimes: formattedPlayableTimes,
			});

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

// 页面加载时
onMounted(async () => {});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
