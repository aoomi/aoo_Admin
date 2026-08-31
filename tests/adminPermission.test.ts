import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { ADMIN_BUTTONS, canUseAdminButton } from '../src/utils/adminPermission';
import { useUserInfo } from '../src/stores/userInfo';
import { createRequestId } from '../src/api/operations';

describe('admin control-plane permission wiring', () => {
	beforeEach(() => setActivePinia(createPinia()));

	it('requires both admin role and the backend button id', () => {
		const store = useUserInfo();
		store.userInfos.roles = ['admin'];
		store.userInfos.authBtnList = [ADMIN_BUTTONS.releaseActivate];
		expect(canUseAdminButton(ADMIN_BUTTONS.releaseActivate)).toBe(true);
		expect(canUseAdminButton(ADMIN_BUTTONS.releaseRollback)).toBe(false);
		store.userInfos.roles = ['common'];
		expect(canUseAdminButton(ADMIN_BUTTONS.releaseActivate)).toBe(false);
	});

	it('defines the same 21 button ids as AdminPermissionCatalog', () => {
		expect(new Set(Object.values(ADMIN_BUTTONS)).size).toBe(21);
	});

	it('creates distinct request ids for idempotent commands', () => {
		expect(createRequestId()).not.toBe(createRequestId());
	});
});
