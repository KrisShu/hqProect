import request from '@/utils/request';

export function fetchList(data) {
    return request({
        url: '/system/performance/list',
        method: 'post',
        data,
    });
}
//修改基础工资比例
export function editBasicWage(data) {
    return request({
        url: '/system/performance/editBasicWage',
        method: 'post',
        data,
    });
}
// 修改比例
export function editCommissionRate(data) {
    return request({
        url: '/system/performance/editCommissionRate',
        method: 'post',
        data,
    });
}
export default {
    fetchList,
    editBasicWage,
    editCommissionRate,
};
