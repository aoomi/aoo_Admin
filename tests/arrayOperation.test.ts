import { describe, expect, it } from 'vitest';
import { isObjectValueEqual, judementSameArr, removeDuplicate } from '/@/utils/arrayOperation';

describe('arrayOperation', () => {
	it('compares permission arrays without duplicate noise', () => {
		expect(judementSameArr(['read', 'write', 'read'], ['write', 'read'])).toBe(true);
	});

	it('compares nested values', () => {
		expect(isObjectValueEqual({ room: { id: 1 } }, { room: { id: 1 } })).toBe(true);
		expect(isObjectValueEqual({ room: { id: 1 } }, { room: { id: 2 } })).toBe(false);
	});

	it('removes duplicate primitive values', () => {
		expect(removeDuplicate(['a', 'a', 'b'])).toEqual(['a', 'b']);
	});
});
