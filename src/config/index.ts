export const gametypes = [
	{ label: '麻将', value: 1 },
	{ label: '考考', value: 4 },
	{ label: '跑得快', value: 5 },
	{ label: '扯旋', value: 6 },
	{ label: '牛牛', value: 7 },
	{ label: '金花', value: 8 },
] as const;

export const classificationRegionOptions = [
	{ label: '成都', value: 1 },
	{ label: '攀枝花', value: 3 },
	{ label: '金堂', value: 4 },
	{ label: '隆昌', value: 5 },
	{ label: '内江', value: 6 },
	{ label: '简阳', value: 7 },
	{ label: '冕宁', value: 8 },
	{ label: '凉山', value: 9 },
] as const;

// 使用 TypeScript 映射语法自动生成类型：value 作为 key，label 作为 value
export type GameTypeMap = {
	[K in (typeof gametypes)[number]['value']]: Extract<(typeof gametypes)[number], { value: K }>['label'];
};

// 创建运行时的映射对象
export const gameTypeMap = gametypes.reduce(
	(obj, item) => {
		obj[item.value] = item.label;
		return obj;
	},
	{} as Record<number, string>
) as GameTypeMap;

export type ClassificationRegionMap = {
	[K in (typeof classificationRegionOptions)[number]['value']]: Extract<(typeof classificationRegionOptions)[number], { value: K }>['label'];
};

// 创建运行时的映射对象
export const classificationRegionMap = classificationRegionOptions.reduce(
	(obj, item) => {
		obj[item.value] = item.label;
		return obj;
	},
	{} as Record<number, string>
) as ClassificationRegionMap;

// 身份类型
export const identitys = [
	{ label: '玩家', value: 0 },
	{ label: '陪玩', value: 1 },
	{ label: '机器人', value: 2 },
] as const;

export type IdentityMap = {
	[K in (typeof identitys)[number]['value']]: Extract<(typeof identitys)[number], { value: K }>['label'];
};

// 创建运行时的映射对象
export const identityMap = identitys.reduce(
	(obj, item) => {
		obj[item.value] = item.label;
		return obj;
	},
	{} as Record<number, string>
) as IdentityMap;

// 成员等级
export const levels = [
	{ label: '圈主', value: 0 },
	{ label: '管理 + 队长', value: 1 },
	{ label: '管理', value: 2 },
	{ label: '队长', value: 3 },
	{ label: '普通成员', value: 10 },
] as const;

export type LevelMap = {
	[K in (typeof levels)[number]['value']]: Extract<(typeof levels)[number], { value: K }>['label'];
};

export const levelMap = levels.reduce(
	(obj, item) => {
		obj[item.value] = item.label;
		return obj;
	},
	{} as Record<number, string>
) as LevelMap;

export const timeList = [
	{ label: '今天', value: '0' },
	{ label: '昨天', value: '1' },
	{ label: '前天', value: '2' },
	{ label: '本周', value: '3' },
	{ label: '上周', value: '4' },
	{ label: '本月', value: '5' },
	{ label: '上月', value: '6' },
] as const;
