import { ElMessage } from 'element-plus';

type SafeErrorTrace = {
	traceId: string;
	context: string;
	name: string;
	code?: string;
	status?: number;
};

const createTraceId = () =>
	globalThis.crypto?.randomUUID?.() ?? `admin-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Records a correlation trace without serializing request bodies, headers, URLs,
 * response payloads, stack traces or exception messages, which may contain secrets.
 */
export const reportAdminError = (error: unknown, context: string, userMessage: string) => {
	const candidate = error as {
		name?: unknown;
		code?: unknown;
		response?: { status?: unknown };
	};
	const trace: SafeErrorTrace = {
		traceId: createTraceId(),
		context,
		name: typeof candidate?.name === 'string' ? candidate.name : 'UnknownError',
	};
	if (typeof candidate?.code === 'string') trace.code = candidate.code.slice(0, 64);
	if (typeof candidate?.response?.status === 'number') trace.status = candidate.response.status;

	console.error('[admin-error]', trace);
	ElMessage.error(`${userMessage}（追踪号：${trace.traceId}）`);
	return trace.traceId;
};
