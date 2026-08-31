<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="筛选时间">
					<el-date-picker
						v-model="time"
						value-format="x"
						:picker-options="options"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="操作员">
					<el-input v-model="queryParams.operater" placeholder="请输入操作员" />
				</el-form-item>
				<el-form-item label="操作类型">
					<el-select v-model="queryParams.operateType" placeholder="请选择操作类型" style="width: 220px">
						<el-option v-for="(value, key) in operateTypeMap" :key="key" :label="value" :value="key" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddSwiper"> 新增 </el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="80" align="center" />
				<el-table-column prop="operateType" label="操作类型">
					<template #default="{ row }">
						{{ operateTypeMap[row.operateType as keyof typeof operateTypeMap] }}
					</template>
				</el-table-column>
				<el-table-column prop="admin" label="操作员" />
				<el-table-column prop="time" label="操作时间">
					<template #default="{ row }">{{ setTime(row.time) }}</template>
				</el-table-column>
				<el-table-column label="其他">
					<template #default="{ row }">
						<el-button type="primary" @click="openDialog(row)"> 查看详情 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				class="mt20"
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.maxperpage"
				:total="tableParams.total"
				:layout="page_layout"
				:page-sizes="page_sizes"
				small
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</el-card>

		<el-dialog v-model="dialogVisible" :title="operateTypeMap[dialogData.operateType as keyof typeof operateTypeMap] || ''" width="600px">
			<el-descriptions :span="2" v-if="dialogData.operateType == 1" border>
				<el-descriptions-item :span="1" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="账号">{{ dialogData.userName }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="等级">{{ levelMap[dialogData.level as keyof typeof levelMap] }}</el-descriptions-item>
			</el-descriptions>
			<el-descriptions :span="2" v-if="dialogData.operateType == 2" border>
				<el-descriptions-item :span="1" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="账号">{{ dialogData.userName }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="是否修改密码">{{ dialogData.passWord ? '是' : '否' }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="2" v-if="dialogData.operateType == 3" border>
				<el-descriptions-item :span="1" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="删除账号">{{ dialogData.userName }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="2" v-if="dialogData.operateType == 4" border>
				<el-descriptions-item :span="1" label="登录账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="登录时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="2" v-if="dialogData.operateType == 5" border>
				<el-descriptions-item :span="1" label="登录账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="登录时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="赠送账号id">{{ dialogData.target }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="赠送房卡数">{{ dialogData.num }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="赠送者剩余房卡数">{{ dialogData.giverRoomCardNum }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="目标房卡数">{{ dialogData.targetRoomCardNum }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="2" v-if="dialogData.operateType == 6" border>
				<el-descriptions-item :span="1" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="游戏类型">{{ gameTypeMap[dialogData.gameType as keyof typeof gameTypeMap] }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="目标id">{{ dialogData.targetPpk }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="子游戏类型">
					{{ childTypeMap[dialogData.childType as keyof typeof childTypeMap] }}
				</el-descriptions-item>
				<el-descriptions-item :span="1" label="是否开启">{{ dialogData.isOwn ? '是' : '否' }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="4" v-if="dialogData.operateType == 7" border>
				<el-descriptions-item :span="2" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="4" label="游戏类型">{{ gameTypeMap[dialogData.gameType as keyof typeof gameTypeMap] }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="目标id">{{ dialogData.targetPpk }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="俱乐部ID">{{ dialogData.clubKey }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="子游戏类型">
					{{ childTypeMap[dialogData.childType as keyof typeof childTypeMap] }}
				</el-descriptions-item>
				<el-descriptions-item :span="2" label="是否开启">{{ dialogData.isOwn ? '是' : '否' }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="4" v-if="dialogData.operateType == 8" border>
				<el-descriptions-item :span="2" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="4" label="俱乐部ID">{{ dialogData.clubKey }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="开始时间">{{ setTime(dialogData.startTime) }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="结束时间">{{ setTime(dialogData.endTime) }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="2" v-if="dialogData.operateType == 9" border>
				<el-descriptions-item :span="1" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="俱乐部ID">{{ dialogData.clubKey }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="模式">{{ modelMap[dialogData.model as keyof typeof modelMap] }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="是否开启">{{ dialogData.isOwn ? '是' : '否' }}</el-descriptions-item>
			</el-descriptions>

			<el-descriptions :span="2" v-if="dialogData.operateType == 10" border>
				<el-descriptions-item :span="1" label="操作账号">{{ dialogData.admin }}</el-descriptions-item>
				<el-descriptions-item :span="2" label="操作时间">{{ setTime(dialogData.time) }}</el-descriptions-item>
				<el-descriptions-item :span="1" label="模式权限">{{
					modelLimitMap[dialogData.modelLimit as keyof typeof modelLimitMap]
				}}</el-descriptions-item>
			</el-descriptions>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ref } from 'vue';
// import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
// import { $http } from '/@/utils/request';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { setTime } from '/@/config/tool';
import request from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';

const time = ref([Date.now() - 60 * 60 * 24 * 1000 * 7, Date.now()]);
const options = {
	disabledDate: (e: any) => e > Date.now(),
};
const levelMap = {
	1: '普通管理员',
	2: '精英管理员(可设置社区长 空投U)',
};
const gameTypeMap = {
	1: '棋牌',
	2: '其他',
};
const childTypeMap = {
	1: '麻将',
	5: '跑得快',
	6: '扯旋',
	7: '其他',
};

const operateTypeMap = {
	1: '创建管理员',
	2: '修改管理员',
	3: '移除管理员',
	4: '登录',
	5: '赠送房卡',
	6: '设置大厅游戏房间权限',
	7: '设置俱乐部游戏房间权限',
	8: '设置俱乐部开房免费时间段',
	9: '设置俱乐部模式',
	10: '设置俱乐部默认模式权限',
};

const modelMap = {
	0: '亲友圈',
	1: '联盟',
};
const modelLimitMap = {
	1: '亲友圈',
	3: '联盟 + 亲友圈',
};
// import { pageSwiper, deleteSwiper } from '/@/api/main/swiper';

const loading = ref(false);
const tableData = ref<any>([
	{ operateType: 1, admin: 'admin', time: '', userName: '13', level: 1 },
	{
		operateType: 2,
		admin: 'admin',
		time: '',
		userName: '13',
		passWord: true,
		level: 1,
	},
	{ operateType: 3, admin: 'admin', time: '', userName: '13' },
	{ operateType: 4, admin: 'admin', level: 1, time: '' },
	{
		operateType: 5,
		admin: 'admin',
		target: '1234567',
		num: 123,
		giverRoomCardNum: 1,
		targetRoomCardNum: 1,
		time: '',
	},
	{
		operateType: 6,
		admin: 'admin',
		gameType: '1',
		targetPpk: '1',
		childType: 1,
		isOwn: true,
		time: '',
	},
	{
		operateType: 7,
		admin: 'admin',
		gameType: '1',
		targetPpk: '1',
		childType: 1,
		isOwn: true,
		clubKey: '1',
		time: '',
	},
	{
		operateType: 8,
		admin: 'admin',
		clubKey: '13',
		startTime: 1,
		endTime: 1,
		time: '',
	},
	{
		operateType: 9,
		admin: 'admin',
		clubKey: '13',
		model: 1,
		isOwn: true,
		time: '',
	},
	{ operateType: 10, admin: 'admin', modelLimit: 1, time: '' },
]);
const dialogVisible = ref(false);
const dialogData = ref<any>({});
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	maxperpage: page_size,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	try {
		const res = await request({
			url: '/admin/getOperateLogs',
			method: 'post',
			data: { ...tableParams.value, ...queryParams.value },
		});
		tableData.value = res.array ?? [];
	} catch (error) {
		reportAdminError(error, 'operateLogs.query', '操作日志加载失败，请重试');
	}
	// var res = await $http.get('/api/PlatConfig/Carousels', {
	// 	startTime: ~~(time.value[0] / 1000),
	// 	endTime: ~~(time.value[1] / 1000),
	// 	page: tableParams.value.page,
	// 	maxperpage: tableParams.value.pageSize,
	// 	operater: queryParams.value.operater,
	// 	operateType: queryParams.value.operateType,
	// });
	// tableData.value = res.data ?? [];
	loading.value = false;
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.maxperpage = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};

const openDialog = (row: any) => {
	dialogVisible.value = true;
	dialogData.value = row;
};

handleQuery();
</script>
