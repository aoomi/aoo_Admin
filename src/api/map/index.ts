import request from '/@/utils/request';

export interface CityLookupResult {
	status: '1' | '0';
	province: string;
	city: string;
}

/** Admin UI map traffic is owned exclusively by the authenticated AdminApi control plane. */
export const adminMapApi = {
	cityByIp: (ip: string) => request<unknown, CityLookupResult>({
		url: '/api/v2/admin/map/ip-location',
		method: 'get',
		params: { ip },
	}),
};
