<template>
	<el-alert title="高风险操作必须由另一名同权限管理员审批；审批凭证仅随本次请求发送。" type="warning" :closable="false" />
	<el-form-item label="审批 ID" required><el-input v-model="model.approvalId" autocomplete="off" /></el-form-item>
	<el-form-item label="审批人 ID" required><el-input v-model="model.approverId" autocomplete="off" /></el-form-item>
	<el-form-item label="到期时间" required><el-input v-model="model.expires" placeholder="ISO-8601 时间" autocomplete="off" /></el-form-item>
	<el-form-item label="审批签名" required><el-input v-model="model.signature" type="password" show-password autocomplete="new-password" /></el-form-item>
</template>
<script setup lang="ts">
import type { ApprovalHeaders } from '/@/api/operations';
const model = defineModel<ApprovalHeaders>({ required: true });
</script>
