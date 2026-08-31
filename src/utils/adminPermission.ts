import { useUserInfo } from '/@/stores/userInfo';

export const ADMIN_BUTTONS = {
	profileList: 'game-profile-list', releaseRead: 'game-release-read', releaseDraft: 'game-release-draft', releaseValidate: 'game-release-validate',
	releaseSubmit: 'game-release-submit', releaseApprove: 'game-release-approve', releaseCanary: 'game-release-canary', releaseActivate: 'game-release-activate', releaseRollback: 'game-release-rollback',
	investigationRead: 'game-investigation-read', switchList: 'operation-switch-list', switchUpdate: 'operation-switch-update', appealList: 'appeal-list', appealResolve: 'appeal-resolve',
	reconciliation: 'reconciliation-run', lifecycleList: 'data-lifecycle-list', lifecycleUpdate: 'data-lifecycle-update',
	exportRequest: 'sensitive-export-request', exportApprove: 'sensitive-export-approve', exportGenerate: 'sensitive-export-generate', exportDownload: 'sensitive-export-download',
} as const;
export type AdminButton = typeof ADMIN_BUTTONS[keyof typeof ADMIN_BUTTONS];
export function canUseAdminButton(button: AdminButton): boolean {
	const user = useUserInfo().userInfos;
	return user.roles.includes('admin') && user.authBtnList.includes(button);
}
