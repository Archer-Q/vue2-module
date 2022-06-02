import axios from '@/utils/index';
import QS from 'qs';
// export const getQuickEntryData = (params) => {
//     return axios.get(`/reportcfg/stationlist`, {params: params})
// }

export const getQuickEntryData = (params) => axios.post(`/reportcfg/stationlist`, params)

