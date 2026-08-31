<template>
	<div class="game-profiles">
		<el-card shadow="never" class="filters">
			<el-form :inline="true" @submit.prevent="loadProfiles">
				<el-form-item label="玩法搜索"><el-input v-model="keyword" clearable placeholder="玩法名称、编号或玩法族" @keyup.enter="loadProfiles" /></el-form-item>
				<el-form-item label="发布状态">
					<el-select v-model="status" clearable placeholder="全部" style="width: 140px">
						<el-option label="已启用" value="ACTIVE" /><el-option label="已停用" value="INACTIVE" />
					</el-select>
				</el-form-item>
				<el-form-item><el-button type="primary" @click="loadProfiles">查询</el-button></el-form-item>
				<el-form-item><el-button @click="resetFilters">重置</el-button></el-form-item>
			</el-form>
		</el-card>
		<el-alert v-if="loadError" :title="loadError" type="error" show-icon :closable="false" />
		<el-card shadow="never">
			<el-table v-loading="loading" :data="filteredProfiles" row-key="gameId" border>
				<el-table-column prop="gameId" label="玩法编号" width="100" /><el-table-column prop="gameCode" label="玩法代码" min-width="130" />
				<el-table-column prop="displayName" label="玩法名称" min-width="150" /><el-table-column prop="categoryCode" label="牌类" width="110" />
				<el-table-column prop="familyCode" label="玩法族" min-width="180" /><el-table-column prop="playVersion" label="玩法版本" min-width="150" />
				<el-table-column label="地区标签" min-width="190"><template #default="scope">{{ regionLabel(scope.row) }}</template></el-table-column>
				<el-table-column label="小结算模板" min-width="210"><template #default="scope">{{ templateLabel(scope.row, 'small') }}</template></el-table-column>
				<el-table-column label="大结算模板" min-width="210"><template #default="scope">{{ templateLabel(scope.row, 'big') }}</template></el-table-column>
				<el-table-column prop="status" label="状态" width="100"><template #default="scope"><el-tag :type="scope.row.status === 'ACTIVE' ? 'success' : 'info'">{{ scope.row.status || '未知' }}</el-tag></template></el-table-column>
			</el-table>
			<div class="hint">模板留空表示自动使用所属牌类默认模板；扑克小结算按玩法族自动选择对应的 <code>_00</code> 模板。只有特殊结算才在后台直接选择具体模板。</div>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="GameProfiles">
import { computed, onMounted, ref } from 'vue';
import { operationsApi } from '/@/api/operations';
type GameProfile = Record<string, any>;
const loading = ref(false); const loadError = ref(''); const keyword = ref(''); const status = ref(''); const profiles = ref<GameProfile[]>([]);
const filteredProfiles = computed(() => { const query = keyword.value.trim().toLowerCase(); return profiles.value.filter((row) => {
	if (status.value && String(row.status ?? '').toUpperCase() !== status.value) return false;
	return !query || [row.gameId, row.gameCode, row.displayName, row.familyCode].some((value) => String(value ?? '').toLowerCase().includes(query));
}); });
function rows(value: any): GameProfile[] { return value?.data?.items ?? value?.data?.rows ?? value?.items ?? value?.rows ?? []; }
function ui(row: GameProfile): GameProfile { return row.ui ?? row.uiSchema ?? row.configuration?.ui ?? {}; }
function templateLabel(row: GameProfile, kind: 'small' | 'big'): string {
	const configured = ui(row)[kind === 'small' ? 'smallSettleTemplate' : 'bigSettleTemplate']; if (configured) return String(configured);
	if (kind === 'small' && String(row.categoryCode ?? row.category).toUpperCase() === 'POKER') return '按玩法族自动选择 _00';
	return '牌类默认 Tpl_00';
}
function regionLabel(row: GameProfile): string { const scope = String(row.scope ?? row.releaseScope ?? 'NATIONAL').toUpperCase(); if (scope === 'NATIONAL') return '全国玩法'; return [row.provinceName ?? row.provinceCode, row.cityName ?? row.cityCode].filter(Boolean).join(' / ') || '未设置标签'; }
async function loadProfiles() { loading.value = true; loadError.value = ''; try { profiles.value = rows(await operationsApi.gameProfiles({ limit: 200 })); } catch { profiles.value = []; loadError.value = '玩法配置加载失败，请检查管理服务后重试。'; } finally { loading.value = false; } }
function resetFilters() { keyword.value = ''; status.value = ''; void loadProfiles(); }
onMounted(loadProfiles);
</script>

<style scoped>
.game-profiles { display: grid; gap: 16px; }.filters :deep(.el-card__body) { padding-bottom: 2px; }.hint { margin-top: 14px; color: var(--el-text-color-secondary); line-height: 1.7; }.hint code { color: var(--el-color-primary); }
</style>
