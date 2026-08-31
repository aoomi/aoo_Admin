<template>
	<el-dialog title="成员列表" v-model="show" width="80%">
		<el-button type="primary" icon="ele-Search" @click="getList"> 刷新 </el-button>
		<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
			<el-table-column type="index" label="序号" width="70" />
			<el-table-column prop="ppk" label="玩家ID" :formatter="(e: any) => (e.ppk || '').replace('0000100000', '')" />
			<el-table-column prop="nickName" label="玩家昵称" />
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
			<!--         6、nickName：玩家昵称
        7、avatarUrl：玩家头像地址
        8、level：身份(0、圈主 1、管理 + 队长 2、管理 3、队长 10、普通成员)
        9、teamGamingNum：团队游戏中人数
        10、teamTotalNum：团队总人数
        11、totalLoseWin：战绩 -->
			<el-table-column prop="level" label="等级">
				<template #default="{ row }">
					{{ levelMap[row.level as keyof typeof levelMap] }}
				</template>
			</el-table-column>
			<el-table-column prop="teamGamingNum" label="团队游戏中人数" />
			<el-table-column prop="teamTotalNum" label="团队总人数" />
			<el-table-column prop="totalLoseWin" label="战绩" />
			<el-table-column prop="clubModelLimit" label="模式权限" min-width="200">
				<template #default="{ row }">
					<p>麻将：{{ GetBit(row.chessgameroomLimit, 1) == 0 ? '无权限' : '有权限' }}</p>
					<p>跑得快：{{ GetBit(row.chessgameroomLimit, 5) == 0 ? '无权限' : '有权限' }}</p>
					<p>扯旋：{{ GetBit(row.chessgameroomLimit, 6) == 0 ? '无权限' : '有权限' }}</p>
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
		<template #footer>
			<el-button @click="show = false">取 消</el-button>
			<!-- <el-button type="primary" @click="setUser">确 定</el-button> -->
		</template>
		<setGameRoomLimit ref="setGameRoomLimitRef" />
		<setClubGameRoomLimit ref="setClubGameRoomLimitRef" />
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import setClubGameRoomLimit from './setClubGameRoomLimit.vue';
import setGameRoomLimit from './setGameRoomLimit.vue';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { GetBit } from '/@/config/tool';
import { $http, getAvatarUrl } from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';
const setGameRoomLimitRef = ref();
const setClubGameRoomLimitRef = ref();
const show = ref(false);
const loading = ref(false);
const selectlist = ref<any[]>([]);
const levelMap = {
	0: '圈主',
	1: '管理 + 队长',
	2: '管理',
	3: '队长',
	10: '普通成员',
};
// 表格多选改变时，用于导出
const onSelectionChange = (val: any[]) => {
	selectlist.value = val;
};

const tableData = ref<any>([]);
const tableParams = ref({
	arg: '',
	page: 1,
	pageSize: page_size,
	total: 0,
});

const countDownFn = (countDown: number) => {
	const h = ~~(countDown / (60 * 60));
	const m = ~~((countDown % (60 * 60)) / 60);
	if (h > 0) {
		return `${h}小时${m}分钟`;
	} else {
		return `${m}分钟`;
	}
};

const getList = async () => {
	loading.value = true;
	try {
		const res = await $http('/admin/getClubMembers', {
			clubKey: rowClub.value.clubKey,
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
		});
		tableData.value = res.members;
		tableParams.value.total = res.total;
		show.value = true;
	} catch (error) {
		reportAdminError(error, 'clubMembers.query', '俱乐部成员加载失败，请重试');
	}
	loading.value = false;
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getList();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	getList();
};

const rowClub = ref<any>({});
defineExpose({
	async show(data: any) {
		rowClub.value = data;
		getList();
	},
});
</script>

<style scoped>
.flex-between {
	display: flex;
	justify-content: space-between;
}
</style>
