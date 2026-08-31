import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('production admin UI/API ledger', () => {
	it('proves every exposed control-plane action reaches authorization, a handler and JDBC', () => {
		const output = execFileSync(process.execPath, ['scripts/admin-api-ledger.mjs'], { encoding: 'utf8' });
		const report = JSON.parse(output);
		expect(report.verification).toEqual({ status: 'passed', failures: [] });
		expect(report.totals).toEqual({ routes: 22, complete: 22 });
		expect(report.rows.every((row: any) => row.responseStates.join(',') === 'loading,success,empty,error')).toBe(true);
	});
});
