import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import request from '../src/utils/request';
import { isVersionConflict, NEW_RESOURCE_ETAG, operationsApi, resourceEtag } from '../src/api/operations';

vi.mock('../src/utils/request', () => ({ default: vi.fn() }));

const approval = { approvalId: 'approval-1', approverId: '2', expires: '9999999999', signature: 'signed' };
const command = { requestId: 'request-1', reason: 'planned change' };

describe('versioned admin resources', () => {
	it.each([
		['switch', () => operationsApi.updateOperationSwitch('game-1', command, approval, '"switch-v2"')],
		['appeal', () => operationsApi.resolveAppeal('appeal-1', command, approval, '"appeal-v3"')],
		['lifecycle', () => operationsApi.updateLifecyclePolicy('replay', command, approval, '"policy-v4"')],
	])('sends the authoritative If-Match for %s writes', (_name, invoke) => {
		invoke();
		expect(vi.mocked(request)).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'put', headers: expect.objectContaining({ 'If-Match': expect.stringMatching(/^".+"$/) }),
		}));
	});

	it('reserves wildcard matching for an explicit create call', () => {
		operationsApi.updateOperationSwitch('new-game', command, approval, NEW_RESOURCE_ETAG);
		expect(vi.mocked(request)).toHaveBeenLastCalledWith(expect.objectContaining({ headers: expect.objectContaining({ 'If-Match': '*' }) }));
	});

	it('refuses an existing resource without an etag', () => {
		expect(() => resourceEtag(undefined)).toThrow('资源缺少版本标识');
	});

	it('recognizes 412 as a version conflict', () => {
		const error = new AxiosError('conflict', 'ERR_BAD_RESPONSE', undefined, undefined, { data: { msg: 'version_conflict' }, status: 412, statusText: 'Precondition Failed', headers: {}, config: { headers: new AxiosHeaders() } });
		expect(isVersionConflict(error)).toBe(true);
	});

	it('wires all sensitive-export actions including four-eyes headers', () => {
		operationsApi.sensitiveExport('export-1', 'approve', command, approval);
		expect(vi.mocked(request)).toHaveBeenLastCalledWith(expect.objectContaining({
			url: '/api/v2/admin/sensitive-exports/export-1/approve', method: 'post',
			headers: expect.objectContaining({ 'X-Admin-Approver-Id': '2' }),
		}));
		operationsApi.downloadSensitiveExport('export-1');
		expect(vi.mocked(request)).toHaveBeenLastCalledWith(expect.objectContaining({
			url: '/api/v2/admin/sensitive-exports/export-1/download', method: 'get', responseType: 'blob',
		}));
	});
});
