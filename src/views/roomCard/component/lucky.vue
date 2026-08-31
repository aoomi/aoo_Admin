<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="type == 2 ? '队长ID' : '用户ID'">
					<el-input v-model="queryParams.ppk" clearable style="width: 200px" placeholder="请输入用户ID" />
				</el-form-item>
				<el-form-item label="俱乐部ID">
					<el-input v-model="queryParams.clubKey" clearable style="width: 200px" placeholder="请输入俱乐部ID" />
				</el-form-item>
				<el-form-item label="俱乐部名称">
					<el-input v-model="queryParams.clubName" clearable style="width: 200px" placeholder="请输入俱乐部名称" />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px">
						<el-option label="全部" value="" />
						<el-option label="进行中" :value="0" />
						<el-option label="已结束" :value="1" />
					</el-select>
				</el-form-item>

				<el-form-item label="添加人">
					<el-select v-model="queryParams.ren" placeholder="添加人" style="width: 150px">
						<el-option label="admin" :value="0" />
						<el-option label="aooapp" :value="1" />
					</el-select>
				</el-form-item>

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
				<el-table-column prop="avatarUrl" label="头像" min-width="100">
					<template #default="{ row }">
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
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="昵称" />
				<el-table-column prop="ppk" label="ID" :formatter="(e: any) => formatterId(e.ppk || '')" />
				<el-table-column prop="clubName" label="俱乐部名称" />
				<el-table-column prop="clubKey" label="俱乐部ID" :formatter="(e: any) => formatterId(e.clubKey || '')" />
				<el-table-column prop="lucky" label="幸运值" />
				<el-table-column prop="targetNum" label="目标值" />
				<el-table-column prop="curNum" label="当前值" />
				<el-table-column prop="admin" label="管理员账户" />

				<el-table-column prop="bindInfos" label="玩法">
					<template #default="{ row }">
						<el-tag v-if="row.status == 0" size="small" type="danger"> 进行中 </el-tag>
						<el-tag v-if="row.status == 1" size="small" type="success"> 已完成 </el-tag>
					</template>
				</el-table-column>

				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="{ row }">
						<el-button v-if="row.status == 1" icon="ele-Edit" size="small" text="" type="primary" @click="openEditSwiper({ ...row }, true)">
							再次执行
						</el-button>
						<el-button v-else icon="ele-Edit" size="small" text="" type="primary" @click="openEditSwiper({ ...row }, true)"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSwiper(row)"> 删除 </el-button>
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
			<editLuckyDialog :type="props.type" ref="editLuckyDialogRef" :title="editSwiperTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import editLuckyDialog from './editLuckyDialog.vue';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { clearObjEmptyAttr, formatterId } from '/@/config/tool';
import request, { getAvatarUrl } from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';
const props = defineProps<{
	type: number;
}>();

const editLuckyDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	// 3、type：类型(1、玩家   2、俱乐部队长)
	// 4、ppk：玩家唯一标识(作为请求参数时可传可不传)
	// 5、clubKey：俱乐部标识(如果标识为5为则需要前面加上0000100000  保证为16位数))(作为请求参数时可传可不传)
	// 6、clubName：俱乐部名称(作为请求参数时可传可不传)
	// 7、status：状态(0、进行中  1、已结束)(作为请求参数时可传可不传)
	type: props.type,
	ppk: '',
	clubKey: '',
	clubName: '',
	status: '',
});
const tableParams = ref({
	page: 1,
	maxperpage: page_size,
	total: 0,
});
const editSwiperTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;

	// var res = await $http.get('/api/PlatConfig/Carousels');
	// tableData.value = res.data ?? [];
	try {
		const res = await request.post(
			'/admin/getUserLucky',
			clearObjEmptyAttr({
				...queryParams.value,
				...tableParams.value,
			})
		);
		tableData.value = res.array ?? [];
	} catch (error) {
		reportAdminError(error, 'roomCard.luckyQuery', '幸运值列表加载失败，请重试');
	}
	loading.value = false;
};

// 打开新增页面
const openAddSwiper = () => {
	editSwiperTitle.value = '添加任务';
	editLuckyDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSwiper = (row: any, isEdit: boolean = false) => {
	editSwiperTitle.value = '编辑任务';
	editLuckyDialogRef.value.openDialog(row, isEdit);
};

// 删除
const delSwiper = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await request.post('/admin/removeUserLucky', {
				ppk: row.ppk,
				type: props.type,
				clubKey: row.clubKey,
			});
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
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

handleQuery();
</script>
