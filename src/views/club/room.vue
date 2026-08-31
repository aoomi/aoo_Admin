<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="俱乐部ID">
					<el-input v-model="queryParams.clubKey" clearable="" style="width: 200px" placeholder="请输入俱乐部ID" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
					</el-button-group>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddRoom"> 添加房间 </el-button>
					<el-button icon="ele-List" type="primary" @click="router.push({ path: '/club/robot', query: { clubKey: formatterId(clubKey) } })">
						AI列表
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="uid" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<!-- <el-table-column prop="uid" label="房间ID" width="80" /> -->
				<el-table-column label="玩法地区标签" width="80" :formatter="(e: any) => classificationRegionMap[e.classificationRegionCode as keyof typeof classificationRegionMap]" />
				<el-table-column label="游戏类型" width="100" :formatter="(e: any) => gameTypeMap[e.gameType as keyof typeof gameTypeMap]" />
				<el-table-column label="底分" width="100" :formatter="(e: any) => Number(e.baseNum)" />
				<el-table-column prop="timeAndTables" label="开桌时间与桌数" min-width="200">
					<template #default="{ row }">
						<div v-for="(item, index) in row.timeAndTables" :key="index" class="time-table-item">
							时间: {{ parseHours(item[0]) }} - {{ parseHours(item[1]) }}, 桌数: {{ item[2] }} - {{ item[3] }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="当前库存" width="100" :formatter="(e: any) => Number(e.curLoseWin)" />
				<el-table-column prop="loseWinAreas" label="库存区间" width="120">
					<template #default="{ row }">
						{{ row.loseWinAreas ? row.loseWinAreas.map((v: any) => Number(v)).join(' - ') : '-' }}
					</template>
				</el-table-column>
				<el-table-column label="房费" width="80" :formatter="(e: any) => Number(e.roomFee).toFixed(1)" />
				<el-table-column prop="robotNum" label="AI数量" width="100" />
				<el-table-column prop="tRobotNum" label="在线AI" width="100" />
				<el-table-column prop="maxMemberNum" label="最大人数" width="100" />
				<el-table-column prop="loseWin" label="战绩" :formatter="(e: any) => (Number(e.realLoseWin) + Number(e.roomFee)).toFixed(1)" />
				<el-table-column prop="roomFee" label="房费" :formatter="(e: any) => Number(e.roomFee).toFixed(1)" />
				<!-- <el-table-column prop="realLoseWin" label="实际战绩" :formatter="(e: any) => Number(e.realLoseWin).toFixed(1)" /> -->
				<!-- <el-table-column prop="loseWinLuckyNums" label="库存概率" :formatter="(e: any) => Number(e.loseWinLuckyNums) || 0" /> -->
				<el-table-column>
					<template #default="{ row }">
						<el-switch @change="setStatus(row)" v-model="row.status" :active-value="1" active-text="开始" inactive-text="暂停" :inactive-value="0" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template #default="{ row }">
						<el-button icon="ele-Edit" size="small" text type="primary" @click="openEditRoom(row)"> 修改 </el-button>
						<el-button icon="ele-Delete" size="small" text type="danger" @click="delRoom(row)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 房间编辑对话框组件 -->
			<roomEditDialog ref="roomEditDialogRef" :title="dialogTitle" :clubKey="queryParams.clubKey" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderBy } from 'lodash';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import roomEditDialog from './component/roomEditDialog.vue';
import { classificationRegionMap, gameTypeMap } from '/@/config';
import { formatterId, parseHours } from '/@/config/tool';
import { $http } from '/@/utils/request';
const clubKey = useRoute().query.clubKey?.toString() || '';
const router = useRouter();
const roomEditDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ clubKey });
const gameAndBases = ref<any>([]);
const dialogTitle = ref('');
// 查询操作
const handleQuery = async () => {
	if (!queryParams.value.clubKey) {
		ElMessage.warning('请输入俱乐部ID');
		return;
	}
	loading.value = true;
	try {
		const res = await $http('/admin/getClubAIRuleRooms', {
			clubKey: queryParams.value.clubKey,
		});
		tableData.value = orderBy(res.array || [], ['classificationRegionCode', 'gameType', 'baseNum'], ['asc', 'asc', 'asc']);
		gameAndBases.value = res.gameAndBases || [];
	} catch (error) {
		console.log(error);
		ElMessage.error('查询失败');
	}
	loading.value = false;
};
// 打开添加房间对话框
const openAddRoom = () => {
	if (!queryParams.value.clubKey) {
		ElMessage.warning('请先查询俱乐部信息');
		return;
	}
	dialogTitle.value = '添加房间';
	roomEditDialogRef.value.openDialog();
};

// 打开编辑房间对话框
const openEditRoom = (row: any) => {
	dialogTitle.value = '修改房间';
	roomEditDialogRef.value.openDialog(row);
};
// 删除房间
const delRoom = (row: any) => {
	ElMessageBox.confirm(`确定要删除房间 ${row.uid} 吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			try {
				await $http('/admin/removeClubAIRuleRoom', {
					clubKey: queryParams.value.clubKey,
					uid: row.uid + '',
				});
				ElMessage.success('删除成功');
				handleQuery();
			} catch (error) {
				ElMessage.error('删除失败');
			}
		})
		.catch(() => {});
};

handleQuery();

const setStatus = async (row: any) => {
	try {
		await $http('/admin/modifyClubAIRuleRoom', {
			...row,
			clubKey: clubKey,
			status: Number(row.status),
		});
		ElMessage.success('操作成功');
	} catch (error) {
		console.log(error);
		ElMessage.error('操作失败');
		row.status = row.status === 1 ? 0 : 1; // 回滚
	}
};
</script>

<style scoped>
.time-table-item {
	margin-bottom: 4px;
	padding: 4px 0;
	border-bottom: 1px solid #eee;
}

.time-table-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
}
</style>
