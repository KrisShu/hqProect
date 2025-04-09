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

// 绩效详情

export function fetchDetail(data) {
    return request({
        url: '/system/list/list',
        method: 'post',
        data,
    });
}

export function fetchDetailTotal(data) {
    return request({
        url: '/system/list/listTotal',
        method: 'post',
        data,
    });
}

// 获取列表
export function fetchRulesList(data) {
    return request({
        url: '/system/commissionConfig/list',
        method: 'get',
    });
}

// 编辑
export function editRules(data) {
    return request({
        url: '/system/commissionConfig/edit',
        method: 'post',
        data,
    });
}
export default {
    fetchList,
    editBasicWage,
    editCommissionRate,
    fetchDetail,
    fetchRulesList,
    editRules,
    fetchDetailTotal,
};
