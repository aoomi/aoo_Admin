<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="俱乐部ID">
					<el-input v-model="queryParams.clubKey" clearable="" style="width: 200px" placeholder="请输入俱乐部ID" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="addClubAI()"> 添加俱乐部 </el-button>
					<!-- <el-button type="primary" icon="ele-Plus" @click="openAddSwiper"> 新增 </el-button> -->
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<!-- <el-table-column type="index" label="序号" width="55" align="center" /> -->
				<!-- <el-table-column prop="uid" label="uid" /> -->
				<el-table-column label="俱乐部ID" :formatter="(e: any) => formatterId(e.clubKey || '')" />
				<el-table-column label="俱乐部圈主ID" :formatter="(e: any) => formatterId(e.clubCreatorPpk || '')" />
				<el-table-column prop="clubName" label="俱乐部名称" />
				<!--            
						4、uid：唯一标识
            5、clubName：俱乐部名称
            6、clubCreatorPpk：俱乐部圈主
            7、clubCreatorNickName：俱乐部圈主昵称
            8、clubCreatorAvatar：俱乐部圈主头像地址
            9、loseWin：战绩
            10、roomFee：房费
            11、robotNum：机器人数量
            12、status：状态(0、暂停 1、开启中)
						 -->
				<el-table-column prop="clubCreatorAvatar" label="俱乐部圈主头像">
					<template #default="{ row }">
						<el-image
							style="width: 60px; height: 60px"
							:src="getAvatarUrl(row.clubCreatorAvatar)"
							:lazy="true"
							:hide-on-click-modal="true"
							:preview-src-list="[getAvatarUrl(row.clubCreatorAvatar)]"
							:initial-index="0"
							fit="scale-down"
							preview-teleported=""
						/>
					</template>
				</el-table-column>
				<el-table-column prop="loseWin" label="战绩" :formatter="(e: any) => Number(e.loseWin).toFixed(1)" />
				<el-table-column prop="roomFee" label="房费" :formatter="(e: any) => Number(e.roomFee).toFixed(1)" />
				<el-table-column label="实际战绩" :formatter="(e: any) => (Number(e.realLoseWin) + Number(e.roomFee)).toFixed(1)" />
				<el-table-column prop="robotNum" label="机器人数量" />
				<el-table-column prop="status" label="状态">
					<template #default="{ row }">
						<el-switch
							v-model="row.status"
							:active-value="1"
							:inactive-value="0"
							active-text="开启中"
							inactive-text="暂停"
							@change="setClubAIStatus(row)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="220" align="center" fixed="right">
					<template #default="{ row }">
						<el-button icon="ele-Delete" size="small" text="" type="danger" @click="delSwiper(row)"> 删除 </el-button>
						<el-button
							icon="ele-InfoFilled"
							size="small"
							text=""
							type="primary"
							@click="router.push({ path: '/club/room', query: { clubKey: row.clubKey } })"
						>
							详情
						</el-button>
						<el-button
							icon="ele-List"
							size="small"
							text=""
							type="primary"
							@click="router.push({ path: '/club/robot', query: { clubKey: formatterId(row.clubKey) } })"
						>
							AI列表
						</el-button>
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
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { fillId, formatterId } from '/@/config/tool';
import { $http, getAvatarUrl } from '/@/utils/request';

const router = useRouter();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: page_size,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	try {
		const res = await $http('/admin/getClubAIs', {
			...queryParams.value,
			clubKey: fillId(queryParams.value.clubKey),
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
		});
		tableData.value = res.array;
		tableParams.value.total = res.total;
	} catch (error) {
		console.log(error);
	}
	// tableData.value = res.data ?? [];
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
			await $http('/admin/removeClubAI', {
				clubKey: row.clubKey,
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
// 添加俱乐部AI
const addClubAI = async () => {
	try {
		const { value: clubKey } = await ElMessageBox.prompt('添加俱乐部', '请输入俱乐部ID', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '请输入俱乐部ID',
		});
		await $http('/admin/addClubAI', { clubKey: fillId(clubKey) });
		handleQuery();
		ElMessage.success('添加成功');
	} catch (error) {
		console.log(error);
	}
};
// 设置俱乐部AI状态
const setClubAIStatus = async (row: any) => {
	try {
		await $http('/admin/setClubAIStatus', {
			clubKey: row.clubKey,
			status: row.status,
		});
		ElMessage.success('设置成功');
	} catch (error) {
		row.status = row.status == 1 ? 0 : 1;
		ElMessage.error('设置失败');
	}
};
handleQuery();
</script>
