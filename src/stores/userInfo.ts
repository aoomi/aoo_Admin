import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import request from '/@/utils/request';

export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: { userName: '', photo: '', time: 0, roles: [], authBtnList: [], roomCardNum: 0 },
	}),
	actions: {
		async setUserInfos() {
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
				return;
			}
			this.userInfos = <UserInfos>await this.getApiUserInfo();
		},
		async getApiUserInfo() {
			const response: any = await request.get('/api/auth/me');
			const data = response.data;
			const userInfos = {
				userName: data.userName,
				photo: '',
				time: new Date().getTime(),
				roles: data.roles,
				authBtnList: data.authBtnList,
				roomCardNum: 0,
			};
			Session.set('userInfo', userInfos);
			return userInfos;
		},
	},
});
