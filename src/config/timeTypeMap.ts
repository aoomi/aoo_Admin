import { dayjs } from 'element-plus';

const now = dayjs();

// 判断今天是不是周末
const isWeekend = now.day() === 0 || now.day() === 6;

const weekFn = () => {
	if (isWeekend) return now.subtract(1, 'week');
	return now;
};

export const timeTypeMap = {
	0: {
		timeType: 1,
		zeroTime: now.startOf('day').unix(),
	},
	1: {
		timeType: 1,
		zeroTime: now.subtract(1, 'day').startOf('day').unix(),
	},
	2: {
		timeType: 1,
		zeroTime: now.subtract(2, 'day').startOf('day').unix(),
	},
	3: {
		timeType: 2,
		zeroTime: weekFn().startOf('week').add(1, 'day').unix(), // 本周一零点时间
	},
	4: {
		timeType: 2,
		zeroTime: weekFn().subtract(1, 'week').startOf('week').add(1, 'day').unix(),
	},
	5: {
		timeType: 3,
		zeroTime: now.startOf('month').unix(),
	},
	6: {
		timeType: 3,
		zeroTime: now.subtract(1, 'month').startOf('month').unix(),
	},
};
