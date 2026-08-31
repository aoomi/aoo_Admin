<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="用户名">
          <el-input v-model="queryParams.username" clearable="" style="width: 200px;" placeholder="请输入用户名或手机号" />
        </el-form-item> -->
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddSwiper"> 新增 </el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" min-width="55" align="center" />
				<el-table-column prop="img" label="图片地址">
					<template #default="scope">
						<el-image
							style="width: 60px; height: 60px"
							:src="scope.row.imageUrl"
							:lazy="true"
							:hide-on-click-modal="true"
							:preview-src-list="[scope.row.imageUrl]"
							:initial-index="0"
							fit="scale-down"
							preview-teleported=""
						/>
					</template>
				</el-table-column>
				<el-table-column prop="linkUrl" label="跳转地址" />
				<el-table-column prop="show" label="隐藏显示">
					<template #default="scope">
						<el-tag type="danger" v-if="!scope.row.isEnabled"> 隐藏</el-tag>
						<el-tag v-else> 显示 </el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSwiper(scope.row)"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSwiper(scope.row)"> 删除 </el-button>
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
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
// import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
// import { $http } from '/@/utils/request';
import editDialog from './component/editDialog.vue';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import request from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';

// import { pageSwiper, deleteSwiper } from '/@/api/main/swiper';

const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
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
		const res = await request.post('/admin/getRoomCardCostRecords', {
			...queryParams.value,
			...tableParams.value,
		});
		tableData.value = res.data ?? [];
	} catch (error) {
		reportAdminError(error, 'roomCard.costQuery', '房卡消耗记录加载失败，请重试');
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
	editSwiperTitle.value = '编辑轮播';
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
