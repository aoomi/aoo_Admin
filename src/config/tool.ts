import dayjs from 'dayjs';
/**
 *
 * @param time 等待时间
 * @returns
 */
export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time, 'done'));

/**
 * 格式化日期
 * @param e 日期
 * @param type 格式
 * @returns
 */
export function setTime(e: string | number = Date.now() / 1000, type: string = 'YYYY-MM-DD HH:mm:ss') {
	return dayjs(e ? parseInt(e.toString()) * 1000 : Date.now()).format(type);
}
/**
 * 小时分钟格式化 时间戳
 * @param time
 * @returns
 */
export const formatHours = (time: string) => {
	const [h, m] = time.split(':');
	return Number(h) * 60 * 60 + Number(m) * 60;
};
/**
 * 格式化时分
 * @param ts 时间戳转。时分
 * @returns
 */
export const parseHours = (ts: number) => {
	const hours = ~~(ts / 3600);
	const minutes = ~~((ts % 3600) / 60);
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * 填充ID
 * @param id
 * @returns
 */
export function fillId(id: string) {
	if (!id) return null;
	if (id.length == 6) return '000010000' + id;
	if (id.length == 5) return '0000100000' + id;
	throw new Error('ID长度不合法');
}
/**
 * 填充ID
 * @param id
 * @returns 完整 ppk ID
 */
export function fillPpkId(id: string) {
	if (!id) return null;
	return '0000100000' + id;
}
/**
 * 格式化ID
 * @param id
 * @returns
 */
export function formatterId(id: string) {
	if (!id) return '';
	return id.replace('0000100000', '').replace('000010000', '');
}

// 清空obj的空属性
export function clearObjEmptyAttr(obj: any) {
	Object.keys(obj).forEach((key) => {
		if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
			delete obj[key];
		}
	});
	return obj;
}

/**
 * 将数字转换为32位二进制字符串，不足32位前面补0
 * @param num 要转换的数字
 * @returns 32位二进制字符串
 */
export function GetBit(value: number, s: number, max: number = 1) {
	// return num.toString(2).split('').reverse().join('');
	let a = max << s;
	let b = value & a;
	return b >> s;
}
