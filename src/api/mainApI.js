import request from '@/utils/request';

//首页
export function fetchDashboardStatistics(data) {
    return request({
        url: '/system/statistics/dashboardStatistics',
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
        method: 'post',
    });
}

export function fetchDashboardStatisticsTwo(data) {
    return request({
        url: '/system/statistics/dashboardStatisticsTwo',
        method: 'post',
        data: data,
    });
}

export default {
    fetchDashboardStatistics,
    fetchMonthlyEarningsStatistics,
    fetchCustomerStatistics,
    fetchDashboardStatisticsTwo,
};
