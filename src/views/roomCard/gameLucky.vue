<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="游戏类型">
					<el-select v-model="queryParams.type" placeholder="请选择游戏类型" style="width: 200px" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in gametypes" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery()"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetQuery()"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddDialog"> 新增 </el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="type" border="">
				<el-table-column type="index" label="序号" min-width="70" />
				<el-table-column prop="type" label="游戏类型" min-width="120">
					<template #default="{ row }">
						{{ gameTypeMap[row.type as keyof typeof gameTypeMap] || '未知类型' }}
					</template>
				</el-table-column>
				<el-table-column prop="countDay" label="统计天数" min-width="100" />
				<el-table-column prop="centArg" label="输赢积分" min-width="200">
					<template #default="{ row }">
						<div style="font-size: 12px">
							<div>输分: {{ row.centArg[0] }}, 增加幸运值: {{ row.centArg[1] }}</div>
							<div>赢分: {{ row.centArg[2] }}, 减少幸运值: {{ row.centArg[3] }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="gameNumArg" label="输赢局数" min-width="200">
					<template #default="{ row }">
						<div style="font-size: 12px">
							<div>输局: {{ row.gameNumArg[0] }}, 增加幸运值: {{ row.gameNumArg[1] }}</div>
							<div>赢局: {{ row.gameNumArg[2] }}, 减少幸运值: {{ row.gameNumArg[3] }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="consecutiveDayArg" label="连续输赢天数" min-width="200">
					<template #default="{ row }">
						<div style="font-size: 12px">
							<div>输: {{ row.consecutiveDayArg[0] }}天, 增加幸运值: {{ row.consecutiveDayArg[1] }}</div>
							<div>赢: {{ row.consecutiveDayArg[2] }}天, 减少幸运值: {{ row.consecutiveDayArg[3] }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="{ row }">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditDialog(row)"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="danger" @click="deleteGameLucky(row)"> 删除 </el-button>
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
			<!-- 添加/编辑弹窗 -->
			<editGameLuckyDialog ref="editDialogRef" :title="editDialogTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import editGameLuckyDialog from './component/editGameLuckyDialog.vue';
import { gameTypeMap, gametypes } from '/@/config';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import request from '/@/utils/request';

const loading = ref(false);
const queryParams = ref<any>({
	type: '',
});
const tableData = ref<any>([]);
const tableParams = ref({
	page: 1,
	maxperpage: page_size,
	total: 0,
});
const editDialogRef = ref();
const editDialogTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	try {
		const params: any = {
			page: tableParams.value.page,
			maxperpage: tableParams.value.maxperpage,
		};

		if (queryParams.value.type) {
			params.type = queryParams.value.type;
		}

		const res = await request.post('/admin/getGameLucky', params);
		tableData.value = res.array || [];
		tableParams.value.total = res.total || 0;
	} catch (error) {
		console.log(error);
		ElMessage.error('查询失败');
	}
	loading.value = false;
};

// 重置查询
const resetQuery = () => {
	queryParams.value = {
		type: '',
	};
	tableParams.value.page = 1;
	handleQuery();
};

// 打开新增弹窗
const openAddDialog = () => {
	editDialogTitle.value = '新增游戏幸运值';
	editDialogRef.value.openDialog({});
};

// 打开编辑弹窗
const openEditDialog = (row: any) => {
	editDialogTitle.value = '编辑游戏幸运值';
	editDialogRef.value.openDialog(row);
};

// 删除游戏幸运值
const deleteGameLucky = (row: any) => {
	ElMessageBox.confirm(`确定要删除 ${gameTypeMap[row.type as keyof typeof gameTypeMap]} 的幸运值配置吗？`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			try {
				await request.post('/admin/removeGameLucky', { type: row.type });
				ElMessage.success('删除成功');
				handleQuery();
			} catch (error) {
				console.log(error);
				ElMessage.error('删除失败');
			}
		})
		.catch(() => {});
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.maxperpage = val;
	tableParams.value.page = 1;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};

// 初始化查询
handleQuery();
</script>

<style scoped>
.flex-between {
	display: flex;
	justify-content: space-between;
}
</style>
