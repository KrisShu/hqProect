import request from '@/utils/request';

//首页
export function fetchList(data) {
    return request({
        url: '/system/order/list',
        method: 'post',
        data: data,
    });
}

export function fetchMonthlyEarningsStatistics(data) {
    return request({
        url: '/system/statistics/monthlyEarningsStatistics',
        method: 'post',
        data: data,
    });
}

export function fetchCustomerStatistics() {
    return request({
        url: '/system/statistics/list',
        method: 'get',
    });
}

export default {
    fetchList,
};
