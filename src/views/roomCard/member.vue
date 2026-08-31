<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="用户ID">
					<el-input v-model="queryParams.ppk" clearable="" style="width: 200px" placeholder="请输入用户ID" />
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input v-model="queryParams.nickName" clearable="" style="width: 200px" placeholder="请输入用户昵称" />
				</el-form-item>

				<el-form-item label="时间">
					<el-select v-model="queryParams.timeType" placeholder="请选择时间" style="width: 150px">
						<el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="账号类型">
					<!-- userTypes：账号类型集合(0、玩家  1、陪玩  2、机器人) -->
					<el-select multiple collapse-tags v-model="queryParams.userTypes" placeholder="请选择账号类型" size="default" style="width: 150px">
						<el-option v-for="value in identitys" :key="value.value" :label="value.label" :value="value.value"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="玩法">
					<el-select v-model="queryParams.gameType" placeholder="请选择玩法" style="width: 200px">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery()"> 查询 </el-button>
						<!-- <el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button> -->
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddSwiper"> 新增 </el-button>
        </el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table @sort-change="sortChange" :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" min-width="70" />
				<el-table-column prop="img" label="头像">
					<template #default="{ row }">
						<div>
							<!-- <span>{{ row.avatarUrl }}</span>
							<el-icon> <Edit /> </el-icon> -->
							<el-image
								style="width: 60px; height: 60px"
								:src="getAvatarUrl(row.avatar)"
								:lazy="true"
								:hide-on-click-modal="true"
								:preview-src-list="[getAvatarUrl(row.avatar)]"
								:initial-index="0"
								fit="scale-down"
								preview-teleported=""
							/>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="玩家昵称" />
				<el-table-column prop="ppk" label="玩家ID" :formatter="(e: any) => (e.ppk || '').replace('0000100000', '')" />

				<el-table-column prop="level" label="玩法">
					<template #default="{ row }">
						{{ gameTypeMap[row.chessgameroomLimit as keyof typeof gameTypeMap] || '暂无' }}
					</template>
				</el-table-column>
				<el-table-column prop="level" label="俱乐部身份">
					<template #default="{ row }">
						{{ levelMap[row.level as keyof typeof levelMap] }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="level" label="玩家身份">
					<template #default="{ row }">
						{{ identityMap[row.level as keyof typeof identityMap] }}
					</template>
				</el-table-column> -->

				<el-table-column prop="teamTotalNum" label="团队总人数" />
				<el-table-column prop="teamGamingNum" label="游戏中人数" />
				<el-table-column prop="totalLoseWin" label="战绩">
					<template #default="{ row }">
						{{ (Number(row.realWinNum) + Number(row.roomFeeNum) || 0).toFixed(2) }}
					</template>
				</el-table-column>
				<el-table-column prop="roomFeeNum" label="房费" />
				<el-table-column prop="realWinNum" label="实际战绩" sortable="custom" />
				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="{ row }">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openAddSwiper({ ...row })"> 任务 </el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column label="操作" min-width="140" align="center" fixed="right">
        <template #default="{ row }">
          <el-dropdown>
            <el-button type="primary" size="small">
              更多操作
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="setGameRoomLimitRef.openDialog({ ...row, clubKey: rowClub.clubKey })">大厅房间权限</el-dropdown-item>
                <el-dropdown-item @click="setClubGameRoomLimitRef.openDialog({ ...row, clubKey: rowClub.clubKey })">俱乐部房间权限</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column> -->
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
		</el-card>
		<editLuckyDialog :type="1" ref="editLuckyDialogRef" :title="editSwiperTitle" @reloadTable="handleQuery" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import editLuckyDialog from './component/editLuckyDialog.vue';
import { gameTypeMap, gametypes, identitys, levelMap, timeList } from '/@/config';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { timeTypeMap } from '/@/config/timeTypeMap';
import { fillPpkId } from '/@/config/tool';
import request, { $http, getAvatarUrl } from '/@/utils/request';

const show = ref(false);
const loading = ref(false);
const route = useRoute();
const queryParams = ref<any>({
	timeType: '0',
	type: '',
	clubModel: '',
	clubKey: route.query.clubKey || '',
	arg: '',
	identitys: [],
	userTypes: [],
	gameType: '',
	realWinNumSort: 1,
});
const tableData = ref<any>([]);
const tableParams = ref({
	page: 1,
	pageSize: page_size,
	total: 0,
});
const editLuckyDialogRef = ref();
const editSwiperTitle = ref('');
// 打开新增页面
const openAddSwiper = async (row: any) => {
	const res = await request.post('/admin/getUserLucky', {
		ppk: row.ppk,
		clubKey: queryParams.value.clubKey,
		type: 1,
		maxperpage: 1,
		page: 1,
	});
	const isEdit = !!res.array.length;
	editSwiperTitle.value = isEdit ? '编辑任务' : '添加任务';
	editLuckyDialogRef.value.openDialog(
		{
			...row,
			clubKey: queryParams.value.clubKey,
			lucky: res.array[0]?.lucky,
			targetNum: res.array[0]?.targetNum,
		},
		isEdit
	);
};
const handleQuery = async () => {
	loading.value = true;
	try {
		// {"page": 1, "maxperpage": 10, "clubKey": "123","timeType": 1,"zeroTime":0, "ppk":"123456","realWinNumSort":1,"nickName":"ads","identitys":[1,2]}
		const res = await $http('/admin/getClubMembers', {
			...queryParams.value,
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
			ppk: fillPpkId(queryParams.value.ppk),
			gameType: queryParams.value.gameType || null,
			// gameTypes: queryParams.value.gameTypes.length
			// 	? queryParams.value.gameTypes
			// 	: null,
			identitys: queryParams.value.identitys.length ? queryParams.value.identitys : null,
			userTypes: queryParams.value.userTypes.length ? queryParams.value.userTypes : null,
			...timeTypeMap[queryParams.value.timeType as keyof typeof timeTypeMap],
		});
		tableData.value = res.members;
		tableParams.value.total = res.total;
		show.value = true;
	} catch (error) {
		console.log(error);
	}
	loading.value = false;
};
handleQuery();

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

const orderMap: any = {
	ascending: 1,
	descending: -1,
};
const keyMap: any = {
	realWinNum: 'realWinNumSort',
};
// 房卡排序
const sortChange = (data: any) => {
	queryParams.value[keyMap[data.prop]] = orderMap[data.order] || 1;
	handleQuery();
};
</script>

<style scoped>
.flex-between {
	display: flex;
	justify-content: space-between;
}
</style>
