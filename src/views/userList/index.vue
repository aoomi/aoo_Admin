<template>
	<div class="page">
		<el-card shadow="hover">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- 3、arg：查询参数(账号或ID(如果是ID需要在前面加上0000100000  保证为16位数) 不精准查询时此参数不传) -->
				<div class="el-row is-justify-space-between">
					<div>
						<el-form-item label="用户ID">
							<el-input v-model="queryParams.arg" clearable="" style="width: 200px" placeholder="请输入用户ID" />
						</el-form-item>
						<el-form-item label="用户昵称">
							<el-input v-model="queryParams.nickName" clearable="" style="width: 200px" placeholder="请输入用户昵称" />
						</el-form-item>
						<el-form-item label="账户查询">
							<el-input disabled v-model="queryParams.nickName" clearable="" style="width: 200px" placeholder="请输入账户查询" />
						</el-form-item>
						<el-form-item label="账号类型">
							<!-- 4、type: 账号类型(0、玩家  1、陪玩  2、机器人)  请求时此参数可传可不传 -->
							<el-select v-model="queryParams.type" placeholder="请选择账号类型" size="default" style="width: 150px">
								<el-option label="全部" value=""></el-option>
								<el-option label="玩家" :value="0"></el-option>
								<el-option label="陪玩" :value="1"></el-option>
								<el-option label="机器人" :value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button-group>
								<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
								<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
							</el-button-group>
						</el-form-item>
					</div>
					<div>
						<el-form-item style="margin-right: auto">
							<el-button :disabled="!selectlist.length" @click="editUserPw(selectlist.map((v) => v.ppk))" class="ml20" type="primary">
								修改密码
							</el-button>
							<el-button type="primary" icon="ele-Plus" @click="createUserRef.openDialog({})"> 新增账号 </el-button>
						</el-form-item>
					</div>
				</div>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" v-loading="loading" tooltip-effect="light" row-key="id" border="" @selection-change="onSelectionChange">
				<el-table-column type="selection" min-width="50" />
				<el-table-column type="index" label="序号" min-width="70" align="center" />

				<!-- type: 账号类型(0、玩家  1、陪玩  2、机器人)  请求时此参数可传可不传 -->
				<el-table-column prop="avatarUrl" label="头像" min-width="100">
					<template #default="{ row }">
						<div @click="editAvatar(row)">
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
				<el-table-column prop="nickName" label="昵称" min-width="100">
					<template #default="{ row }">
						<div @click="editUserName(row)">
							<span>{{ row.nickName }}</span>
							<el-icon> <Edit /> </el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="ppk" label="ID" :formatter="(e: any) => (e.ppk || '').replace('0000100000', '')" />
				<el-table-column prop="type" label="账号类型" min-width="100">
					<template #default="{ row }">
						<div style="display: flex; align-items: center" @click="setUserTypeRef.openDialog(row)">
							<el-tag size="small" v-if="row.type == 0" type="success"> 玩家 </el-tag>
							<el-tag size="small" v-else-if="row.type == 1" type="warning"> 陪玩 </el-tag>
							<el-tag size="small" v-else-if="row.type == 2" type="danger"> 机器人 </el-tag>
							<el-icon> <Edit /> </el-icon>
						</div>
					</template>
				</el-table-column>
				<!-- 8、loginType：最后一次登录类型(0、游客 1、微信 2、电话) -->
				<el-table-column prop="loginType" label="注册类型" min-width="100">
					<template #default="{ row }">
						<el-tag v-if="row.loginType == 0" type="success">游客</el-tag>
						<el-tag v-else-if="row.loginType == 1" type="warning">微信</el-tag>
						<el-tag v-else-if="row.loginType == 2" type="danger">电话</el-tag>
					</template>
				</el-table-column>
				<!-- 9、bindInfos：绑定账号信息([{"type" : 1, "key" : "12314"},...]  type:类型(0、游客 1、微信 2、电话) key:账号) -->
				<el-table-column prop="bindInfos" label="绑定账号" min-width="150" label-align="center" align="center">
					<template #default="{ row }">
						<el-popover width="600" trigger="hover">
							<el-descriptions class="mb20" border :column="1">
								<template v-for="(item, index) in row.bindInfos" :key="index">
									<el-descriptions-item v-if="item.type == 0" label="用户">{{ item.key }} </el-descriptions-item>
									<el-descriptions-item v-if="item.type == 1" label="微信">{{ item.key }} </el-descriptions-item>
									<el-descriptions-item v-if="item.type == 2" label="电话">{{ item.key }} </el-descriptions-item>
								</template>
							</el-descriptions>

							<!-- <p>总收益: {{ row.property[1020].toFixed(2) }}</p> -->
							<template #reference>
								<div>
									<template v-for="(item, index) in row.bindInfos" :key="index">
										<el-icon v-if="item.type == 0" class="mr10" size="20"><User /></el-icon>
										<i v-if="item.type == 1" class="iconfont icon-weixin mr10" style="font-size: 20px"></i>
										<span v-if="item.type == 2" style="display: flex; align-items: center">
											<el-icon size="20"> <Phone /> </el-icon>
											<span style="font-size: 14px; padding-left: 10px">
												{{ item.key }}
											</span>
										</span>
									</template>
								</div>
							</template>
						</el-popover>
					</template>
				</el-table-column>

				<!-- <el-table-column prop="ip" label="玩家IP" min-width="100">
					<template #default="{ row }">
						<template v-if="row.ip.length <= 1">
							<el-tag
								@click="toIpPage(item)"
								v-for="(item, index) in row.ip"
								:key="index"
								class="mr10"
								size="small"
								type="warning"
							>
								{{ item }}
								<el-icon><View /></el-icon>
							</el-tag>
						</template>
						<el-popover title="玩法" placement="top-start" v-else>
							<el-row>
								<el-col
									@click="toIpPage(item)"
									class="mt10"
									:span="24"
									v-for="(item, index) in row.ip"
									:key="index"
								>
									{{ item }}
									<el-icon><View /></el-icon>
								</el-col>
							</el-row>
							<template #reference>
								<el-tag class="mr10" size="small" type="warning">
									<span>{{ row.ip[0] }}</span>
									<el-icon><View /></el-icon>
								</el-tag>
							</template>
						</el-popover>
					</template>
				</el-table-column> -->

				<el-table-column prop="" label="玩家IP" min-width="100">
					<template #default="{ row }"> {{ row.ip || '' }}</template>
				</el-table-column>
				<el-table-column prop="" label="地区" min-width="100">
					<template #default="{ row }"> {{ row.city || '' }}</template>
				</el-table-column>
				<el-table-column prop="" label="参与玩法" min-width="100">
					<template #default="{ row }">
						<div class="" v-for="(item, index) in row.playedGames || []" :key="index">
							{{ playedGameFn(item) }}
						</div>
					</template>
				</el-table-column>
				<!-- sortable="custom" -->
				<el-table-column prop="avatarUrl" label="房卡" min-width="100">
					<template #default="{ row }"> {{ row.propertys[3] }}</template>
				</el-table-column>

				<!-- <el-table-column label="用户(属性)" align="left" min-width="150">
					<template #default="{ row }">
						<el-popover min-width="300" trigger="hover">
							<p v-for="(item, index) in userInfoObj" :key="index">
								<span v-if="index != '20'">{{ item }}:</span>
								<span v-if="index == '1002'">{{ setTime(row.propertys[index]) }}</span>
								<span v-else-if="index == '10'">{{ row.propertys[index] == 2 ? '男' : '女' }}</span>
								<template v-if="index == '20'">
									<p>麻将: {{ GetBit(row.propertys[index], 1) == 1 ? '有权限' : '无权限' }}</p>
									<p>跑得快: {{ GetBit(row.propertys[index], 5) == 1 ? '有权限' : '无权限' }}</p>
									<p>扯旋: {{ GetBit(row.propertys[index], 6) == 1 ? '有权限' : '无权限' }}</p>
								</template>
								<span v-else>{{ row.propertys[index] }}</span>
							</p>
							<template #reference>
								<div>
									<p>金币: {{ row.propertys[1] }}</p>
									<p>钻石: {{ row.propertys[2] }}</p>
									<p>房卡: {{ row.propertys[3] }}</p>
								</div>
							</template>
						</el-popover>
					</template>
				</el-table-column> -->
				<el-table-column prop="createTime" label="创建时间" min-width="150">
					<template #default="{ row }">{{ setTime(row.createTime) }} </template>
				</el-table-column>
				<el-table-column prop="loginTime" label="登录时间" min-width="150">
					<template #default="{ row }">{{ setTime(row.loginTime) }} </template>
				</el-table-column>
				<!-- <el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="delSwiper(scope.row)"> 修改密码 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSwiper(scope.row)"> 删除 </el-button>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" min-width="140" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="giveRoomCardRef.openDialog(row)"> 加减房卡 </el-button>
						<div style="height: 5px"></div>
						<el-button
							type="primary"
							size="small"
							@click="
								bindUserRef.openDialog({
									arg: row.ppk.replace('0000100000', ''),
								})
							"
						>
							绑定账户
						</el-button>
						<div style="height: 5px"></div>
						<el-button
							:disabled="row.userName === 'admin'"
							size="small"
							type="primary"
							@click="
								router.push({
									path: '/userIp',
									query: { ppk: formatterId(row.ppk) },
								})
							"
						>
							同ip
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
			<editDialog ref="editDialogRef" :title="editSwiperTitle" @reloadTable="handleQuery" />
			<createUser ref="createUserRef" @reloadTable="handleQuery" />
			<giveRoomCard ref="giveRoomCardRef" @reloadTable="handleQuery" />
			<bindUser ref="bindUserRef" @reloadTable="handleQuery" />
			<setUserType ref="setUserTypeRef" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="swiper">
import { Edit, Phone, User } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { md5 } from 'js-md5';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import bindUser from './component/bindUser.vue';
import editDialog from './component/editDialog.vue';
import giveRoomCard from './component/giveRoomCard.vue';
import setUserType from './component/setUserType.vue';
import { page_layout, page_size, page_sizes } from '/@/config/page';
import { formatterId, setTime } from '/@/config/tool';
import { $http, getAvatarUrl } from '/@/utils/request';
import { reportAdminError } from '/@/utils/adminError';
import { adminMapApi } from '/@/api/map';
import createUser from '/@/views/setting/component/createUser.vue';
const router = useRouter();
const selectlist = ref<any[]>([]);
const giveRoomCardRef = ref();
const bindUserRef = ref();
// 表格多选改变时，用于导出
const onSelectionChange = (val: any[]) => {
	selectlist.value = val;
};
// import { pageSwiper, deleteSwiper } from '/@/api/main/swiper';
const gameType: Record<number, string> = {
	1: '麻将',
	4: '考考',
	5: '跑得快',
	6: '扯旋',
	7: '牛牛',
	8: '金花',
};
const gameCity: Record<number, string> = {
	1: '成都',
	4: '金堂',
	5: '隆昌',
	6: '内江',
	7: '简阳',
	8: '冕宁',
	9: '凉山',
};
// 玩过的游戏
const playedGameFn = (num: number) => {
	return `${gameCity[~~(num / 1000)]}-${gameType[num % 1000]}`;
};

const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	arg: '',
	type: '',
});
const tableParams = ref({
	page: 1,
	pageSize: page_size,
	total: 0,
});
const editSwiperTitle = ref('');
const createUserRef = ref();
const setUserTypeRef = ref();

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	try {
		let arg = null;
		if (queryParams.value.arg) {
			arg = '0000100000' + queryParams.value.arg;
		}
		if (queryParams.value.nickName) {
			arg = queryParams.value.nickName;
		}

		const res = await $http('/admin/getUsers', {
			...queryParams.value,
			page: tableParams.value.page,
			maxperpage: tableParams.value.pageSize,
			arg: arg,
			type: queryParams.value.type == '' ? null : queryParams.value.type,
		});
		res.users.forEach((v: any) => {
			v.propertys = v.propertys.reduce((obj: any, item: any) => ({ ...obj, ...item }), {});
			// v.ppk = to32BitBinary(v.ppk);
		});
		tableData.value = res.users;
		tableData.value.forEach((v: any) => {
			// 获取城市信息
			if (v.ip) {
				adminMapApi.cityByIp(v.ip).then((cityInfo) => {
					if (cityInfo && cityInfo.status == '1') {
						v.city = cityInfo.province + '-' + cityInfo.city;
					} else {
						v.city = '未知';
					}
				});
			} else {
				v.city = '未知';
			}
		});
		tableParams.value.total = res.total;
	} catch (error) {
		reportAdminError(error, 'users.query', '用户列表加载失败，请重试');
	}
	loading.value = false;
};

// 打开新增页面
// const openAddSwiper = () => {
// 	editSwiperTitle.value = '添加轮播';
// 	editDialogRef.value.openDialog({});
// };

// 打开编辑页面
// const openEditSwiper = (row: any) => {
// 	editSwiperTitle.value = '编辑轮播';
// 	editDialogRef.value.openDialog(row);
// };

// 删除
// const delSwiper = (row: any) => {
// 	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
// 		confirmButtonText: '确定',
// 		cancelButtonText: '取消',
// 		type: 'warning',
// 	})
// 		.then(async () => {
// 			// await deleteSwiper(row);
// 			handleQuery();
// 			ElMessage.success('删除成功');
// 		})
// 		.catch(() => {});
// };

// 修改密码
const editUserPw = async (ppk: string[]) => {
	try {
		const { value: newPw } = await ElMessageBox.prompt('请输入新密码', '修改密码', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '请输入新密码',
		});
		await $http('/admin/modifyUserPassWord', {
			args: ppk,
			passWord: md5(newPw),
		});
		handleQuery();
		ElMessage.success('修改成功');
	} catch (error) {
		ElMessage.error('修改失败');
	}
};
// 修改昵称
const editUserName = async (row: any) => {
	try {
		const { value: newName } = await ElMessageBox.prompt('请输入新昵称', '修改昵称', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '请输入新昵称',
			inputValue: row.nickName,
		});
		await $http('/admin/setNickName', {
			ppk: row.ppk,
			nickName: newName,
		});
		handleQuery();
		ElMessage.success('修改成功');
	} catch (error) {
		ElMessage.error('修改失败');
	}
};
// 修改头像
const editAvatar = async (row: any) => {
	try {
		const { value: newAvatar } = await ElMessageBox.prompt('请输入新头像地址,头像ID(1-10000)', '修改头像', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPlaceholder: '头像ID(1-10000)',
		});
		await $http('/admin/setAvatarId', {
			ppk: row.ppk,
			avatarId: Number(newAvatar),
		});
		handleQuery();
		ElMessage.success('修改成功');
	} catch (error) {
		ElMessage.error('修改失败');
	}
};

const orderMap: any = {
	ascending: 1,
	descending: 2,
};
// 房卡排序
const sortChange = (data: any) => {
	queryParams.value[data.prop] = orderMap[data.order] || null;
	console.log(data);
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

const toIpPage = (ip: string) => {
	router.push({ path: '/userIp', query: { ip } });
};

handleQuery();
</script>
