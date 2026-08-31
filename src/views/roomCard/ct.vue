<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form style="display: flex; justify-content: space-between" :model="queryParams" ref="queryForm" :inline="true">
				<div>
					<el-form-item label="俱乐部ID">
						<el-input v-model="queryParams.clubKey" clearable="" style="width: 200px" placeholder="请输入俱乐部ID" />
					</el-form-item>
					<el-form-item label="用户ID">
						<el-input v-model="queryParams.ppk" clearable="" style="width: 200px" placeholder="请输入用户ID" />
					</el-form-item>
					<!-- <el-form-item label="玩法">
						<el-select
							multiple
							collapse-tags
							v-model="queryParams.gameTypes"
							clearable=""
							style="width: 200px"
							placeholder="请选择游戏类型"
						>
							<el-option
								v-for="item in gametypes"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item> -->
					<el-form-item label="玩法">
						<el-select v-model="queryParams.gameType" placeholder="请选择玩法" style="width: 200px">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="时间">
						<el-select v-model="queryParams.timeType" placeholder="请选择时间" style="width: 150px">
							<el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="玩家身份">
						<el-select collapse-tags multiple v-model="queryParams.identitys" placeholder="请选择身份" style="width: 150px">
							<el-option label="圈主" :value="0" />
							<el-option label="管理 + 队长" :value="1" />
							<el-option label="管理" :value="2" />
							<el-option label="队长" :value="3" />
							<el-option label="普通成员" :value="10" />
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<el-button-group>
							<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
							<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
						</el-button-group>
					</el-form-item>
				</div>
				<el-form-item>
					<el-button type="primary" @click="setGameRoomLimitRef.openDialog({ gameType: 1, isOwn: true })"> 大厅房间 </el-button>
					<el-button type="primary" @click="setClubGameRoomLimitRef.openDialog({ gameType: 1, isOwn: true })"> 俱乐部房间 </el-button>
				</el-form-item>
				<!-- <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddSwiper"> 新增 </el-button>
        </el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table @sort-change="sortChange" :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" min-width="60" align="center" />
				<el-table-column prop="img" label="头像">
					<template #default="{ row }">
						<div>
							<!-- <span>{{ row.avatarUrl }}</span>
							<el-icon> <Edit /> </el-icon> -->
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
				<el-table-column prop="nickName" label="玩家昵称" />
				<el-table-column prop="ppk" label="玩家ID" :formatter="(e: any) => formatterId(e.ppk || '')" />
				<el-table-column prop="clubName" label="俱乐部名称" />
				<el-table-column prop="clubKey" label="俱乐部ID" :formatter="(e: any) => formatterId(e.clubKey || '')" />

				<el-table-column prop="bindInfos" label="玩法">
					<template #default="{ row }">
						<template v-if="row.gameTypes.length <= 1">
							<el-tag v-for="(item, index) in row.gameTypes" :key="index" class="mr10" size="small" type="warning">
								{{ gameTypeMap[item as keyof typeof gameTypeMap] }}
							</el-tag>
						</template>
						<el-popover title="玩法" placement="top-start" v-else>
							<el-row>
								<el-col class="mt10" :span="12" v-for="(item, index) in row.gameTypes" :key="index">
									<el-tag class="mr10" size="small" type="warning">
										{{ gameTypeMap[item as keyof typeof gameTypeMap] }}
									</el-tag>
								</el-col>
							</el-row>
							<template #reference>
								<el-tag class="mr10" size="small" type="warning">
									<span>
										{{ gameTypeMap[row.gameTypes[0] as keyof typeof gameTypeMap] }}
									</span>
									<el-icon><View /></el-icon>
								</el-tag>
							</template>
						</el-popover>
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSwiper(row)"> </el-button>
					</template>
				</el-table-column>
				<el-table-column prop="totalLoseWin" label="战绩">
					<template #default="{ row }">
						{{ Number(row.realWinNum) + Number(row.roomFeeNum) || 0 }}
					</template>
				</el-table-column>
				<el-table-column prop="roomFeeNum" label="房费" />
				<!-- sortable="custom" -->
				<el-table-column prop="realWinNum" label="实际战绩" />
				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="scope">
						<!-- <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSwiper(scope.row)"> 编辑 </el-button> -->
						<el-button icon="ele-Delete" size="small" text="" type="danger" @click="delSwiper(scope.row)"> 删除 </el-button>
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
			<editDialog ref="editDialogRef" :title="editSwiperTitle" @reloadTable="handleQuery" />
			<setGameRoomLimit ref="setGameRoomLimitRef"></setGameRoomLimit>
			<setClubGameRoomLimit ref="setClubGameRoomLimitRef" @reloadTable="handleQuery"></setClubGameRoomLimit>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { View } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import editDialog from './component/editDialog.vue';
import setClubGameRoomLimit from './component/setClubGameRoomLimit.vue';
import setGameRoomLimit from './component/setGameRoomLimit.vue';
import { gameTypeMap, gametypes, timeList } from '/@/config';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { timeTypeMap } from '/@/config/timeTypeMap';
import { fillId, fillPpkId, formatterId } from '/@/config/tool';
import request, { $http, getAvatarUrl } from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';
const setGameRoomLimitRef = ref();
const setClubGameRoomLimitRef = ref();
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	identitys: [],
	// gameTypes: [],
	timeType: '0',
	gameType: '',
});
const tableParams = ref({
	page: 1,
	pageSize: page_size,
	total: 0,
});
const editSwiperTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	// var res = await $http.get('/api/PlatConfig/Carousels');
	// tableData.value = res.data ?? [];
	try {
		// timeType、zeroTime、realWinNum、roomFeeNum
		// {"realWinNumSort":1}
		const res = await $http('/admin/getGameRoomLimitMembers', {
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
			clubKey: fillId(queryParams.value.clubKey),
			nickName: queryParams.value.nickName || null,
			identitys: queryParams.value.identitys.length ? queryParams.value.identitys : null,
			gameType: queryParams.value.gameType || null,
			// gameTypes: queryParams.value.gameTypes.length
			// 	? queryParams.value.gameTypes
			// 	: null,
			realWinNumSort: queryParams.value.realWinNumSort || null,
			ppk: fillPpkId(queryParams.value.ppk),
			...timeTypeMap[queryParams.value.timeType as keyof typeof timeTypeMap],
		});
		tableData.value = res.array ?? [];
		tableParams.value.total = res.total;
	} catch (error) {
		reportAdminError(error, 'roomCard.clubQuery', '俱乐部房卡记录加载失败，请重试');
	}
	loading.value = false;
};

// 打开新增页面
const openAddSwiper = () => {
	editSwiperTitle.value = '添加轮播';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSwiper = (row: any) => {
	editSwiperTitle.value = '编辑俱乐部房间';
	editDialogRef.value.openDialog(row);
};

// 删除
const delSwiper = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			// await deleteSwiper(row);
			await request.post('/admin/setClubGameRoomLimit', {
				clubKey: row.clubKey,
				targetPpk: row.ppk,
				gameType: 1,
				childTypes: [],
			});
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
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

handleQuery();

const orderMap: any = {
	ascending: 1,
	descending: -1,
};
const keyMap: any = {
	realWinNum: 'realWinNumSort',
};
// 房卡排序
const sortChange = (data: any) => {
	queryParams.value[keyMap[data.prop]] = orderMap[data.order] || null;
	handleQuery();
};
</script>
