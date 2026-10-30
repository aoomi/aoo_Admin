/** 后台与客户端共用的亲友圈/联盟展示语义；value 是既有线上协议值。 */
export const allianceRoles = [
	{ label: '成员', value: 0 },
	{ label: '盟友', value: 1 },
	{ label: '联盟管理', value: 2 },
	{ label: '盟主', value: 3 },
] as const;

export const clubRoles = [
	{ label: '成员', value: 0 },
	{ label: '圈管理', value: 1 },
	{ label: '圈主', value: 2 },
	{ label: '联盟管理', value: 3 },
] as const;

export const promotionRoles = Object.freeze({
	Partner: '合伙人',
	Captain: '队长',
});

export const legacyClubTermAliases: Readonly<Record<string, string>> = Object.freeze({
	赛事: '联盟',
	赛事管理员: '联盟管理',
	俱乐部管理员: '圈管理',
	推广员: '队长',
	玩家: '成员',
});
