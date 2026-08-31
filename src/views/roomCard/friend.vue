<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="用户ID">
					<el-input v-model="queryParams.arg" clearable="" style="width: 200px" placeholder="请输入用户ID" />
				</el-form-item> -->
				<el-form-item label="俱乐部名称">
					<el-input v-model="queryParams.nickName" clearable="" style="width: 200px" placeholder="请输入用户昵称" />
				</el-form-item>
				<!-- <el-form-item label="账号类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" style="width: 150px">
            <el-option label="玩家" :value="1" />
            <el-option label="俱乐部" :value="2" />
          </el-select>
        </el-form-item> -->
				<el-form-item label="时间">
					<el-select v-model="queryParams.timeType" placeholder="请选择时间" style="width: 150px">
						<el-option label="今天" value="0" />
						<el-option label="昨天" value="1" />
						<el-option label="前天" value="2" />
						<el-option label="本周" value="3" />
						<el-option label="上周" value="4" />
						<el-option label="本月" value="5" />
						<el-option label="上月" value="6" />
					</el-select>
				</el-form-item>

				<el-form-item v-if="queryParams.type === 2" label="俱乐部类型">
					<el-select v-model="queryParams.clubModel" placeholder="请选择类型" style="width: 150px">
						<el-option label="全部" value="" />
						<el-option label="亲友圈" :value="0" />
						<el-option label="联盟" :value="1" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<!-- <el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button> -->
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddSwiper"> 新增 </el-button>
        </el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" min-width="55" align="center" />
				<el-table-column prop="img" label="圈主头像">
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
				<el-table-column prop="nickName" label="圈主昵称" min-min-width="100" />
				<el-table-column label="圈主ID" :formatter="(e: any) => (e.ppk || '').replace('0000100000', '')" />

				<el-table-column prop="clubName" label="俱乐部名称" min-min-width="120" />
				<el-table-column label="俱乐部ID" :formatter="(e: any) => (e.clubKey || '').replace('0000100000', '')" min-min-width="100" />
				<!-- <el-table-column prop="phoneNumber" label="电话号码" min-min-width="100" /> -->
				<el-table-column prop="costRoomCardNum" label="房卡统计" min-min-width="200">
					<template #default="{ row }">
						<p>消耗房卡数：{{ row.costRoomCardNum }}</p>
						<p>当前房卡数：{{ row.roomCardNum }}</p>
					</template>
				</el-table-column>

				<el-table-column prop="clubOnlineNum" label="俱乐部在线人数" min-min-width="150">
					<template #default="{ row }">
						<p>在线人数：{{ row.clubOnlineNum }}</p>
						<p>总人数：{{ row.clubTotalNum }}</p>
					</template>
				</el-table-column>
				<el-table-column prop="clubFreeRoomCardTimes" label="免费时间段" min-min-width="240">
					<template #default="{ row }">
						<p>开始时间：{{ row.clubFreeRoomCardTimes?.[0] ? setTime(row.clubFreeRoomCardTimes?.[0] || 0) : '未设置' }}</p>
						<p>结束时间：{{ row.clubFreeRoomCardTimes?.[1] ? setTime(row.clubFreeRoomCardTimes?.[1] || 0) : '未设置' }}</p>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="clubModelLimit" label="模式权限" min-min-width="200">
					<template #default="{ row }">
						<p>当前模式: {{ row.clubModel == 0 ? '亲友圈' : '联盟' }}</p>
						<p>亲友圈：{{ GetBit(row.clubModelLimit, 0) == 0 ? '无权限' : '有权限' }}</p>
						<p>联盟：{{ GetBit(row.clubModelLimit, 1) == 0 ? '无权限' : '有权限' }}</p>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" min-min-width="140" align="center" fixed="right">
					<template #default="{ row }">
						<el-dropdown>
							<el-button type="primary" size="small"> 更多操作 </el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="router.push({ path: '/roomCard/member', query: { clubKey: row.clubKey } })">
										成员列表
									</el-dropdown-item>
									<!-- <el-dropdown-item @click="giveRoomCardRef.openDialog(row)">赠送房卡</el-dropdown-item> -->
									<!-- <el-dropdown-item @click="setGameRoomLimitRef.openDialog(row)">大厅房间权限</el-dropdown-item> -->
									<!-- <el-dropdown-item @click="setClubGameRoomLimitRef.openDialog(row)">俱乐部房间权限</el-dropdown-item> -->
									<el-dropdown-item @click="setClubFreeRoomCardTimeRef.openDialog(row)">设置俱乐部房费免费时间段</el-dropdown-item>
									<el-dropdown-item @click="setClubModelRef.openDialog(row)">设置俱乐部类型</el-dropdown-item>
									<!-- <el-dropdown-item @click="intiveDiaRef.show(row.userName)">邀请列表</el-dropdown-item> -->
								</el-dropdown-menu>
							</template>
						</el-dropdown>
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
			<!-- <editDialog ref="editDialogRef" :title="editSwiperTitle" @reloadTable="handleQuery" /> -->
			<memberDia ref="memberDiaRef" />
			<giveRoomCard ref="giveRoomCardRef" @reloadTable="handleQuery" />
			<setGameRoomLimit ref="setGameRoomLimitRef" @reloadTable="handleQuery" />
			<setClubGameRoomLimit ref="setClubGameRoomLimitRef" @reloadTable="handleQuery" />
			<setClubFreeRoomCardTime ref="setClubFreeRoomCardTimeRef" @reloadTable="handleQuery" />
			<setClubModel ref="setClubModelRef" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import giveRoomCard from './component/giveRoomCard.vue';
import memberDia from './component/memberDia.vue';
import setClubFreeRoomCardTime from './component/setClubFreeRoomCardTime.vue';
import setClubGameRoomLimit from './component/setClubGameRoomLimit.vue';
import setClubModel from './component/setClubModel.vue';
import setGameRoomLimit from './component/setGameRoomLimit.vue';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { timeTypeMap } from '/@/config/timeTypeMap';
import { setTime } from '/@/config/tool';
import { reportAdminError } from '/@/utils/adminError';
import { $http, getAvatarUrl } from '/@/utils/request';

const router = useRouter();
const memberDiaRef = ref();
const giveRoomCardRef = ref();
const setGameRoomLimitRef = ref();
const setClubGameRoomLimitRef = ref();
const setClubFreeRoomCardTimeRef = ref();
const setClubModelRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	timeType: '0',
	type: 2,
	clubModel: '',
	arg: '',
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
		let arg = null;
		if (queryParams.value.arg) {
			arg = '0000100000' + queryParams.value.arg;
		}
		if (queryParams.value.nickName) {
			arg = queryParams.value.nickName;
		}

		const res = await $http('/admin/getRoomCardCostRecords', {
			page: tableParams.value.page, // 当前页数
			maxperpage: tableParams.value.pageSize, // 每页最大记录数
			type: queryParams.value.type || 1, // 类型(1、玩家  2、俱乐部)
			// timeType: queryParams.value.timeType || null, // 时间类型(1、日  2、周  3、月)
			// zeroTime: queryParams.value.zeroTime || null, // 对应timeType的零点时间
			...timeTypeMap[queryParams.value.timeType as keyof typeof timeTypeMap],
			arg: arg,
			clubModel: queryParams.value.clubModel === '' ? null : queryParams.value.clubModel,
		});
		tableData.value = res.array ?? [];
		tableParams.value.total = res.total ?? 0;
	} catch (error) {
		reportAdminError(error, 'roomCard.friendQuery', '好友房记录加载失败，请重试');
	}
	loading.value = false;
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
</script>
