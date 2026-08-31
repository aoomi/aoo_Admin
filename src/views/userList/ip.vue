<template>
	<div class="page">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- 根据IP地址和玩家标识查询相同IP的用户 -->
				<div class="el-row is-justify-space-between">
					<div>
						<el-form-item label="IP地址">
							<el-input v-model="queryParams.ip" clearable="" style="width: 200px" placeholder="请输入IP地址" />
						</el-form-item>
						<el-form-item label="玩家ID">
							<el-input v-model="queryParams.ppk" clearable="" style="width: 200px" placeholder="请输入玩家标识" />
						</el-form-item>
						<el-form-item>
							<el-button-group>
								<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
								<el-button icon="ele-Refresh" @click="() => (queryParams = { ip: '', ppk: '' })"> 重置 </el-button>
							</el-button-group>
						</el-form-item>
					</div>
				</div>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="ip" border="">
				<el-table-column type="index" label="序号" min-width="70" align="center" />
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
				<el-table-column prop="nickName" label="昵称" min-width="100" />
				<el-table-column prop="ppk" label="玩家ID" min-width="150" :formatter="(e: any) => (e.ppk || '').replace('0000100000', '')" />
				<el-table-column prop="ip" label="IP地址" min-width="150" />
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

			<giveRoomCard ref="giveRoomCardRef" @reloadTable="handleQuery" />
			<bindUser ref="bindUserRef" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="getSameIpUsers">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import bindUser from './component/bindUser.vue';
import giveRoomCard from './component/giveRoomCard.vue';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { fillPpkId } from '/@/config/tool';
import { $http, getAvatarUrl } from '/@/utils/request';
const giveRoomCardRef = ref();
const bindUserRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	ip: useRoute().query.ip || '',
	ppk: useRoute().query.ppk || '',
});
const tableParams = ref({
	page: 1,
	pageSize: page_size,
	total: 0,
});
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	try {
		const res = await $http('/admin/getSameIpUsers', {
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
			ip: queryParams.value.ip || undefined,
			ppk: fillPpkId(queryParams.value.ppk),
		});

		// 根据接口文档，返回的数据结构是 { errorCode: 0, total: 12, array: [...] }
		tableData.value = (res.array || []).reduce((arr: any, item: any) => {
			arr.push(...item.users.map((v: any) => ({ ...v, ip: item.ip })));
			return arr;
		}, []);
		tableParams.value.total = res.total || 0;
	} catch (error) {
		console.error('查询失败:', error);
	}
	loading.value = false;
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

<style scoped>
.user-item {
	margin-bottom: 8px;
}

.user-item:last-child {
	margin-bottom: 0;
}
</style>
