import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('admin map network boundary', () => {
	it('uses only the AdminApi route and keeps provider details out of production UI', () => {
		const api = fs.readFileSync('src/api/map/index.ts', 'utf8');
		const request = fs.readFileSync('src/utils/request.ts', 'utf8');
		expect(api).toContain('/api/v2/admin/map/ip-location');
		expect(`${api}\n${request}`).not.toMatch(/restapi|amap\.com|[?&]key=/i);
	});
});
