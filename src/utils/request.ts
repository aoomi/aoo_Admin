import axios, { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import qs from 'qs';
import { Session } from '/@/utils/storage';
let apiUrl, avatarUrl: string;

if (import.meta.env.MODE !== 'test') fetch('./config.json?v=' + Date.now())
	.then((e) => {
		return e.json();
	})
	.then((v) => {
		avatarUrl = v.avatarUrl;
		apiUrl = v[v.urlKey];
		service.defaults.baseURL = apiUrl;
	});

export const errorCode = new Map([
	[-100, '服务器未注册'],
	[-101, '配置不存在'],
	[-102, '客户端参数错误'],
	[-103, 'USDT不足'],
	[-104, '玩家不存在'],
	[-105, '玩家昵称不合法'],
	[-106, '服务器繁忙'],
	[-107, '不支持的URI'],
	[-108, '权限不足'],
	[-109, '管理員已存在'],
	[-110, '管理員不存在'],
	[-111, '不在活动时间'],
	[-112, '订单超时'],
	[-114, '用户不存在'],
	[-115, '游戏不存在'],
	[-200, '无法连接认证服务器'],
	[-201, '账号已登录'],
	[-202, '服务器已达最大人数'],
	[-203, '未开放此类型的登录'],
	[-204, '账号格式错误'],
	[-205, '密码格式错误'],
	// [-206, '请输入正确的推荐人地址'],
	[-207, '请先登录'],
	[-208, '账号已在其他设备登录'],
	[-209, '账号无权限登录,请联系管理员'],
	[-210, '账号已存在'],
	[-211, '角色不存在'],
	[-212, '玩家不存在'],
	[-213, '推荐人不能为空'],
	[-214, '推荐人不能是自己'],
	[-215, '推荐人链中存在自己'],
	[-216, '推荐人不存在'],
	[-301, '俱乐部不存在'],
	// [-301, "盲盒不存在"],
	// [-302, "盲盒已打开"],
	[-400, '无效的类型'],
	[-401, '金额错误'],
	[-402, '24小时只能申请一次'],
	[-500, '24小时只能提现一次'],
	[-600, 'VIP等级不足'],
	[-601, '单次下注已超过当前VIP限制'],
	[-602, '累积下注已超过当前VIP限制'],
	// [-603, "元素上架中"],
	// [-604, "盲盒不能合成"],
	[-700, '团队有效人数不足'],
	[-800, '项目不存在'],
	[-900, '服务未开启'],
	// [-10004, '服务未开启'],
	[-20005, '幸运值记录不存在'],
	[-20006, '幸运值记录已存在'],
	[-20000, '管理員已存在'],
	[-20001, '管理員不存在'],
	[-20002, '管理員房卡不足'],
	[-20003, '赠送目标不存在'],
	[-20004, '目标房卡数量不足'],
	[-20005, '幸运值记录不存在'],
	[-20006, '幸运值记录已存在'],
	[-20007, '俱乐部AI已存在'],
	[-20008, '俱乐部AI不存在'],
	[-20009, '俱乐部AI规则房间已存在'],
	[-20010, '俱乐部AI规则房间不存在'],
]);

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	// baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		config.headers!['X-Request-Id'] = (config.data as Record<string, unknown> | undefined)?.requestId
			?? globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		const csrf = Session.get('csrfToken');
		if (csrf && !['get', 'head'].includes(String(config.method).toLowerCase())) config.headers!['X-CSRF-Token'] = csrf;
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.errorCode && res.errorCode < 0) {
			// `token` 过期或者账号已在别处登录
			if (res.errorCode == -207 || res.errorCode == -100) {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => {})
					.catch(() => {});
			} else if (errorCode.get(res.errorCode)) {
				ElMessage({
					message: errorCode.get(res.errorCode) || '服务器忙',
					type: 'error',
					duration: 5 * 1000,
				});
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return res;
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.response?.status === 401) {
			Session.clear();
			if (!window.location.hash.startsWith('#/login')) window.location.href = '/#/login';
			ElMessage.error('登录状态已失效，请重新登录');
		} else if (error.response?.status === 412) {
			// Versioned resource views own the conflict flow: notify, reload and discard stale edits.
		} else if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			ElMessage({
				message: error.response?.data?.msg === 'invalid_request' ? '请求参数不合法' : '请求失败，请稍后重试',
				type: 'error',
				duration: 5 * 1000,
			});
			// if (error.response.data) ElMessage.error(error.response.statusText);
			// else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);
export const $http = service.post;
// 导出 axios 实例
export default service;

// 拼接头像地址
export const getAvatarUrl = (path: string) => {
	if (!path) return '#';
	if (path.includes('http')) return path;
	return `${avatarUrl}${path}.png`;
	// return `${import.meta.env.VITE_AVATR_URL}head/${path}.png`;
};
