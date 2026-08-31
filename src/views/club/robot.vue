<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- 3、arg：查询参数(账号或ID(如果是ID需要在前面加上0000100000  保证为16位数) 不精准查询时此参数不传) -->
				<div class="el-row is-justify-space-between">
					<div>
						<el-form-item label="用户ID">
							<el-input v-model="queryParams.ppk" clearable="" style="width: 200px" placeholder="请输入用户ID" />
						</el-form-item>
						<el-form-item label="玩法地区标签" prop="classificationRegionCode">
							<el-select v-model="queryParams.classificationRegionCode" placeholder="请选择玩法地区标签" style="width: 200px">
								<el-option label="全部" value=""></el-option>
								<el-option v-for="item in classificationRegionOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="玩法" v-if="queryParams.classificationRegionCode">
							<el-select v-model="queryParams.gameType" placeholder="请选择玩法" style="width: 200px">
								<el-option label="全部" value=""></el-option>
								<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>

						<el-form-item label="俱乐部类型">
							<el-select v-model="queryParams.joinType" placeholder="请选择俱乐部类型" style="width: 200px">
								<el-option label="全部" value=""></el-option>
								<el-option label="未加入任何俱乐部" :value="0"></el-option>
								<el-option label="已加入当前俱乐部" :value="1"></el-option>
								<el-option label="未加入当前俱乐部" :value="2"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="俱乐部ID" v-if="[1, 2].includes(queryParams.joinType)" required>
							<el-input v-model="queryParams.clubKey" clearable="" style="width: 200px" placeholder="请输入俱乐部ID" />
						</el-form-item>

						<el-form-item>
							<el-button-group>
								<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
								<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
							</el-button-group>
						</el-form-item>
					</div>
					<div>
						<el-form-item style="margin-right: auto">
							<el-button type="primary" @click="createUserRef.openDialog({})"> 创建AI </el-button>
							<el-button :disabled="!selectlist.length" @click="editUserPw(selectlist.map((v) => v.ppk))" class="ml20" type="primary">
								修改密码
							</el-button>
							<el-button :disabled="!selectlist.length" type="warning" @click="setRobotInfoRef.openDialog(selectlist.map((v) => v.ppk))">
								AI配置
							</el-button>
							<el-button :disabled="!selectlist.length" @click="removeClubRobot(selectlist.map((v) => v.ppk))" class="ml20" type="danger">
								俱乐部移除机器人
							</el-button>
							<el-button :disabled="!selectlist.length" @click="addClubRobotRef.openDialog(selectlist.map((v) => v.ppk))" class="ml20" type="success">
								俱乐部添加机器人
							</el-button>
						</el-form-item>
					</div>
				</div>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table @selection-change="onSelectionChange" :data="tableData" v-loading="loading" tooltip-effect="light" border="">
				<el-table-column type="selection" min-width="50" />
				<el-table-column type="index" label="序号" min-width="70" align="center" />
				<el-table-column prop="ppk" label="ID" :formatter="(e: any) => formatterId(e.ppk || '')" />
				<el-table-column prop="userName" label="账号" />
				<el-table-column prop="avatarUrl" label="头像" min-width="100">
					<template #default="{ row }">
						<div @click="editAvatar(row)">
							<el-image
								style="width: 60px; height: 60px"
								:src="getAvatarUrl(row.avatarUrl)"
								:lazy="true"
								:hide-on-click-modal="true"
								:preview-src-list="[getAvatarUrl(row.avatarUrl)]"
								:initial-index="0"
								fit="scale-down"
								preview-teleported=""
							/>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="昵称" min-width="100">
					<template #default="{ row }">
						<div @click="editUserName(row)">
							<span>{{ row.nickName }}</span>
							<el-icon> <Edit /> </el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="robotInfo" label="机器人详情" min-width="400" label-align="center" align="center">
					<template #default="{ row }">
						<el-popover width="800" trigger="hover" placement="top">
							<div style="display: flex; gap: 20px">
								<!-- 左侧：可玩游戏 -->
								<div style="flex: 1">
									<h4 style="margin-bottom: 12px; color: #409eff">可玩游戏</h4>
									<div v-if="row.playableGames && row.playableGames.length > 0" style="max-height: 300px; overflow-y: auto">
										<div
											v-for="(game, gameIndex) in row.playableGames"
											:key="gameIndex"
											style="border: 1px solid #e4e7ed; border-radius: 4px; padding: 12px; margin-bottom: 12px; background: #f9f9f9"
										>
											<div style="margin-bottom: 4px; font-size: 12px">
												<span style="color: #666">地区：</span>
												<span>{{ getClassificationRegionName(game.classificationRegionCode) }}</span>
											</div>
											<div style="margin-bottom: 8px; font-size: 12px">
												<span style="color: #666">游戏类型：</span>
												<span>{{ getGameTypeName(game.gameType) }}</span>
											</div>
											<div style="font-size: 12px">
												<span style="color: #666; margin-bottom: 4px; display: block">底分区间：</span>
												<el-tag class="mr10" v-for="(area, areaIndex) in game.baseNumAreas" :key="areaIndex" size="small" type="primary"
													>{{ Number(area[0]) }} - {{ Number(area[1]) }}
												</el-tag>
											</div>
										</div>
									</div>
									<div v-else style="color: #999; text-align: center; padding: 20px">暂无游戏配置</div>
								</div>

								<!-- 右侧：可玩时间 -->
								<div style="flex: 1">
									<h4 style="margin-bottom: 12px; color: #67c23a">可玩时间</h4>
									<div v-if="row.playableTimes && row.playableTimes.length > 0" style="max-height: 300px; overflow-y: auto">
										<div
											v-for="(time, timeIndex) in row.playableTimes"
											:key="timeIndex"
											style="border: 1px solid #e4e7ed; border-radius: 4px; padding: 12px; margin-bottom: 8px; background: #f9f9f9"
										>
											<div style="font-size: 12px; display: flex; align-items: center; gap: 5px">
												<el-tag size="small" type="success"> {{ formatTime(time[0]) }} - {{ formatTime(time[1]) }} </el-tag>
											</div>
										</div>
									</div>
									<div v-else style="color: #999; text-align: center; padding: 20px">暂无时间配置</div>
								</div>
							</div>

							<template #reference>
								<div style="cursor: pointer; color: #409eff; display: flex; align-items: center; gap: 10px">
									<div style="display: flex; flex-direction: column; align-items: center" @click="setRobotInfoRef.openDialog(row)">
										<el-icon size="20"><Setting /></el-icon>
										<span style="font-size: 12px">AI配置</span>
									</div>
									<div style="font-size: 12px; color: #666">
										<div>游戏：{{ row.playableGames ? row.playableGames.length : 0 }} 个</div>
										<div>时间：{{ row.playableTimes ? row.playableTimes.length : 0 }} 段</div>
									</div>
								</div>
							</template>
						</el-popover>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="gameType" label="游戏类型">
					<template #default="{ row }">
						{{ gameTypeMap[row.gameType as keyof typeof gameTypeMap] || '暂无' }}
					</template>
				</el-table-column> -->

				<el-table-column prop="gamingClubKey" label="游戏中俱乐部" :formatter="(e: any) => (e.ppk || '').replace('0000100000', '')" />

				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="{ row }">
						<!-- <el-button type="primary" size="small" @click="giveRoomCardRef.openDialog(row)"> 加减房卡 </el-button> -->
						<div style="height: 5px"></div>
						<el-button
							type="primary"
							size="small"
							@click="
								bindUserRef.openDialog({
									arg: row.ppk.replace('0000100000', ''),
								})
							"
						>
							绑定账户
						</el-button>
						<div style="height: 5px"></div>
						<!-- <el-button type="primary" size="small" @click="setRobotInfoRef.openDialog(row)"> 设置机器人信息 </el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				class="mt20"
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:layout="page_layout"
				:page-sizes="page_sizes"
				small
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
			<createUser ref="createUserRef" @reloadTable="handleQuery((queryParams.joinType = 0))" />
			<giveRoomCard ref="giveRoomCardRef" @reloadTable="handleQuery" />
			<bindUser ref="bindUserRef" @reloadTable="handleQuery" />
			<setUserType ref="setUserTypeRef" @reloadTable="handleQuery" />
			<addClubRobot ref="addClubRobotRef" @reloadTable="handleQuery" />
			<setRobotInfo ref="setRobotInfoRef" @reloadTable="handleQuery"></setRobotInfo>
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { Edit, Setting } from '@element-plus/icons-vue';
import { ElIcon, ElMessage, ElMessageBox } from 'element-plus';
import { md5 } from 'js-md5';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import addClubRobot from './component/addClubRobot.vue';
import bindUser from './component/bindUser.vue';
import createUser from './component/createUser.vue';
import giveRoomCard from './component/giveRoomCard.vue';
import setRobotInfo from './component/setRobotInfo.vue';
import setUserType from './component/setUserType.vue';
import { classificationRegionOptions, gametypes } from '/@/config';
import { reportAdminError } from '/@/utils/adminError';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { fillId, fillPpkId, formatterId } from '/@/config/tool';
import { $http, getAvatarUrl } from '/@/utils/request';
const route = useRoute();
const selectlist = ref<any[]>([]);
const giveRoomCardRef = ref();
const bindUserRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	classificationRegionCode: '',
	gameType: '',
	joinType: '',
	clubKey: '',
});
if (route.query.clubKey) {
	queryParams.value.clubKey = String(route.query.clubKey);
	queryParams.value.joinType = 1;
}
const tableParams = ref({
	page: 1,
	pageSize: page_size,
	total: 0,
});
const createUserRef = ref();
const addClubRobotRef = ref();
const setRobotInfoRef = ref();
// 表格多选改变时，用于导出
const onSelectionChange = (val: any[]) => {
	selectlist.value = val;
};

// 查询操作
const handleQuery = async (e?: any) => {
	if ([1, 2].includes(queryParams.value.joinType) && !queryParams.value.clubKey) {
		ElMessage.warning('请输入俱乐部ID');
		return;
	}
	loading.value = true;

	try {
		// 42、获取机器人列表 /admin/getRobots
		// 请求: {"page": 1,"maxperpage": 10,"ppk" : "1","area":1,"gameType":1,"joinType":1,"clubKey":"1"}
		const res = await $http('/admin/getRobots', {
			// ...queryParams.value,
			ppk: fillPpkId(queryParams.value.ppk),
			// clubKey: fillId(queryParams.value.clubKey, true),
			classificationRegionCode:
				queryParams.value.classificationRegionCode === '' ? null : queryParams.value.classificationRegionCode,
			gameType: queryParams.value.gameType === '' ? null : queryParams.value.gameType,
			joinType: queryParams.value.joinType === '' ? null : queryParams.value.joinType,
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
			...([1, 2].includes(queryParams.value.joinType)
				? {
						clubKey: fillId(queryParams.value.clubKey),
					}
				: {}),
		});
		// res.users.forEach((v: any) => {
		// 	v.info = v.baseNumAreas.map((item: any, idx: number) => {
		// 		return {
		// 			classificationRegionCode: '', // 玩法地区标签
		// 			gameType: '', // 游戏类型
		// 			minNum: item[0], // 最低积分
		// 			maxNum: item[1], // 最高积分
		// 			startTime: v.playableTimes[idx][0], // 开始时间
		// 			endTime: v.playableTimes[idx][1], // 结束时间
		// 		};
		// 	});
		// 	// v.ppk = to32BitBinary(v.ppk);
		// });
		tableData.value = res.array;
		tableParams.value.total = res.total;
	} catch (error) {
		reportAdminError(error, 'clubRobot.query', '俱乐部机器人列表加载失败，请重试');
	}
	loading.value = false;
};

// 打开新增页面
// const openAddSwiper = () => {
// 	editSwiperTitle.value = '添加轮播';
// 	editDialogRef.value.openDialog({});
// };

// 打开编辑页面
// const openEditSwiper = (row: any) => {
// 	editSwiperTitle.value = '编辑轮播';
// 	editDialogRef.value.openDialog(row);
// };

// 删除
// const delSwiper = (row: any) => {
// 	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
// 		confirmButtonText: '确定',
// 		cancelButtonText: '取消',
// 		type: 'warning',
// 	})
// 		.then(async () => {
// 			// await deleteSwiper(row);
// 			handleQuery();
// 			ElMessage.success('删除成功');
// 		})
// 		.catch(() => {});
// };

// 修改密码
const editUserPw = async (ppk: string[]) => {
	try {
		const { value: newPw } = await ElMessageBox.prompt('请输入新密码', '修改密码', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '请输入新密码',
		});
		await $http('/admin/modifyUserPassWord', {
			args: ppk,
			passWord: md5(newPw),
		});
		handleQuery();
		ElMessage.success('修改成功');
	} catch (error) {
		ElMessage.error('修改失败');
	}
};
// 修改昵称
const editUserName = async (row: any) => {
	try {
		const { value: newName } = await ElMessageBox.prompt('请输入新昵称', '修改昵称', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '请输入新昵称',
			inputValue: row.nickName,
		});
		await $http('/admin/setNickName', {
			ppk: row.ppk,
			nickName: newName,
		});
		handleQuery();
		ElMessage.success('修改成功');
	} catch (error) {
		ElMessage.error('修改失败');
	}
};
// 修改头像
const editAvatar = async (row: any) => {
	try {
		const { value: newAvatar } = await ElMessageBox.prompt('请输入新头像地址,头像ID(1-10000)', '修改头像', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '头像ID(1-10000)',
		});
		await $http('/admin/setAvatarId', {
			ppk: row.ppk,
			avatarId: Number(newAvatar),
		});
		handleQuery();
		ElMessage.success('修改成功');
	} catch (error) {
		ElMessage.error('修改失败');
	}
};

const orderMap: any = {
	ascending: 1,
	descending: 2,
};
// 房卡排序
const sortChange = (data: any) => {
	queryParams.value[data.prop] = orderMap[data.order] || null;
	console.log(data);
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};

// 移除俱乐部的机器人
const removeClubRobot = async (ppks: string[]) => {
	try {
		const { value: clubKey } = await ElMessageBox.prompt('请输入俱乐部ID', '移除机器人', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '请输入俱乐部ID',
		});
		await $http('/admin/removeClubRobot', {
			ppks,
			clubKey: fillId(clubKey),
		});
		ElMessage.success('移除成功');
		handleQuery();
	} catch (error) {
		ElMessage.error('移除失败');
	}
};

// 获取玩法地区标签名称
const getClassificationRegionName = (classificationRegionCode: number) => {
	const region = classificationRegionOptions.find((item) => item.value === classificationRegionCode);
	return region ? region.label : '未知玩法地区标签';
};

// 获取游戏类型名称
const getGameTypeName = (gameTypeId: number) => {
	const gameType = gametypes.find((item) => item.value === gameTypeId);
	return gameType ? gameType.label : '未知游戏';
};

// 格式化时间戳
const formatTime = (timestamp: number) => {
	const hours = Math.floor(timestamp / 3600);
	const minutes = Math.floor((timestamp % 3600) / 60);
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

handleQuery();
</script>
