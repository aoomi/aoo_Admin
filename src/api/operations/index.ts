import request from '/@/utils/request';
import axios from 'axios';

export interface CursorQuery { cursor?: string; limit: number; status?: string }
export interface AdminCommand { requestId: string; reason: string; [key: string]: unknown }
export interface ApprovalHeaders { approvalId: string; approverId: string; expires: string; signature: string }
export type ReleaseAction = 'draft' | 'validate' | 'submit' | 'approve' | 'canary' | 'activate' | 'rollback';
export type ResourceEtag = string;
export type ExportAction = 'request' | 'approve' | 'generate';

export const NEW_RESOURCE_ETAG: ResourceEtag = '*';

export const resourceEtag = (value: unknown): ResourceEtag => {
	if (typeof value !== 'string' || !value.trim()) throw new Error('资源缺少版本标识，请刷新后重试');
	return value;
};

export const isVersionConflict = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 412;

const approvalHeaders = (approval?: ApprovalHeaders) => approval ? {
	'X-Admin-Approval-Id': approval.approvalId, 'X-Admin-Approver-Id': approval.approverId,
	'X-Admin-Approval-Expires': approval.expires, 'X-Admin-Approval-Signature': approval.signature,
} : undefined;

const versionedApprovalHeaders = (approval: ApprovalHeaders, etag: ResourceEtag) => ({
	...approvalHeaders(approval),
	'If-Match': resourceEtag(etag),
});

export const createRequestId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const operationsApi = {
	appeals: (query: CursorQuery) => request({ url: '/api/v2/admin/appeals', method: 'get', params: query }),
	resolveAppeal: (id: string, command: AdminCommand, approval: ApprovalHeaders, etag: ResourceEtag) => request({ url: `/api/v2/admin/appeals/${encodeURIComponent(id)}/resolve`, method: 'put', data: command, headers: versionedApprovalHeaders(approval, etag) }),
	reconciliation: (date: string) => request({ url: '/api/v2/admin/reconciliation', method: 'get', params: { date } }),
	gameProfiles: (query: CursorQuery) => request({ url: '/api/v2/admin/game-profiles', method: 'get', params: query }),
	gameRelease: (gameId: string | number, releaseId: string, action: ReleaseAction, command: AdminCommand, approval?: ApprovalHeaders) => request({ url: `/api/v2/admin/game-profile-releases/${encodeURIComponent(gameId)}/${encodeURIComponent(releaseId)}/${action}`, method: 'post', data: command, headers: approvalHeaders(approval) }),
	getGameRelease: (gameId: string | number, releaseId: string) => request({ url: `/api/v2/admin/game-profile-releases/${encodeURIComponent(gameId)}/${encodeURIComponent(releaseId)}`, method: 'get' }),
	gameInvestigation: (roomId: string | number, query: { from: number; to: number; set: number }, reason: string) => request({ url: `/api/v2/admin/game-investigations/${encodeURIComponent(roomId)}`, method: 'get', params: query, headers: { 'X-Admin-Reason': reason } }),
	operationSwitches: () => request({ url: '/api/v2/admin/operation-switches', method: 'get' }),
	updateOperationSwitch: (gameId: string, command: AdminCommand, approval: ApprovalHeaders, etag: ResourceEtag) => request({ url: `/api/v2/admin/operation-switches/${encodeURIComponent(gameId)}`, method: 'put', data: command, headers: versionedApprovalHeaders(approval, etag) }),
	lifecyclePolicies: () => request({ url: '/api/v2/admin/data-lifecycle', method: 'get' }),
	updateLifecyclePolicy: (dataType: string, command: AdminCommand, approval: ApprovalHeaders, etag: ResourceEtag) => request({ url: `/api/v2/admin/data-lifecycle/${encodeURIComponent(dataType)}`, method: 'put', data: command, headers: versionedApprovalHeaders(approval, etag) }),
	sensitiveExport: (exportId: string, action: ExportAction, command: AdminCommand, approval?: ApprovalHeaders) => request({ url: `/api/v2/admin/sensitive-exports/${encodeURIComponent(exportId)}/${action}`, method: 'post', data: command, headers: approvalHeaders(approval) }),
	downloadSensitiveExport: (exportId: string) => request({ url: `/api/v2/admin/sensitive-exports/${encodeURIComponent(exportId)}/download`, method: 'get', responseType: 'blob' }),
};
